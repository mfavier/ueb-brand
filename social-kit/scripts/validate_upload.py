#!/usr/bin/env python3
"""Check a direct plugin-upload ZIP before extracting or running bundled code.

This validates the archive boundary, not installation in ChatGPT. The source
validator remains responsible for the skill and plugin's detailed metadata.
Official structure: https://developers.openai.com/plugins/deploy/submission-errors
"""
import argparse
import json
import re
import stat
import unicodedata
import zlib
from pathlib import Path, PurePosixPath
from zipfile import BadZipFile, ZIP_DEFLATED, ZIP_STORED, ZipFile

MAX_COMPRESSED_BYTES = 100_000_000
MAX_UNCOMPRESSED_BYTES = 512 * 1024 * 1024
MAX_MEMBER_BYTES = 100 * 1024 * 1024
MAX_ENTRIES = 5000
MAX_PATH_SEGMENTS = 20
COMPATIBILITY_DIRECTORIES = {".codex-plugin", ".claude-plugin", ".agent-plugin"}


def normalized(value):
    return unicodedata.normalize("NFC", unicodedata.normalize("NFC", value).casefold())


def checked_path(info):
    raw = info.filename
    if not raw or raw != raw.strip():
        raise ValueError(f"Chemin ZIP vide ou entouré d’espaces : {raw!r}")
    if "\\" in raw:
        raise ValueError(f"Séparateur inverse interdit dans le ZIP : {raw!r}")
    if raw.startswith("/") or re.match(r"^[A-Za-z]:", raw):
        raise ValueError(f"Chemin absolu interdit dans le ZIP : {raw!r}")
    if "\x00" in raw or info.orig_filename != raw:
        raise ValueError(f"Chemin ZIP contenant un caractère nul : {raw!r}")
    directory = raw.endswith("/")
    name = raw[:-1] if directory else raw
    parts = name.split("/")
    if any(part in {"", ".", ".."} for part in parts):
        raise ValueError(f"Segment vide, courant ou parent interdit : {raw!r}")
    if len(parts) > MAX_PATH_SEGMENTS:
        raise ValueError(f"Chemin ZIP trop profond : {raw!r}")
    kind = stat.S_IFMT(info.external_attr >> 16)
    allowed = {0, stat.S_IFDIR} if directory else {0, stat.S_IFREG}
    if kind not in allowed:
        raise ValueError(f"Type d’entrée ZIP interdit (fichiers et dossiers seulement) : {raw!r}")
    if info.flag_bits & 1:
        raise ValueError(f"Entrée ZIP chiffrée interdite : {raw!r}")
    if info.compress_type not in {ZIP_STORED, ZIP_DEFLATED}:
        raise ValueError(f"Compression ZIP non prise en charge pour l’import direct : {raw!r}")
    if info.file_size > MAX_MEMBER_BYTES:
        raise ValueError(f"Entrée ZIP supérieure à 100 Mio : {raw!r}")
    return name, directory


def manifest_root(name):
    parts = PurePosixPath(name).parts
    if not parts or parts[-1] != "plugin.json":
        return None
    if len(parts) >= 2 and parts[-2] in COMPATIBILITY_DIRECTORIES:
        return "/".join(parts[:-2])
    return "/".join(parts[:-1])


def validate_archive(path):
    """Return the unique plugin root and entry report, or raise ValueError.

    ``root`` is an empty string for a flat ZIP, otherwise its single containing
    directory. Portable and compatibility manifests at that same root are one
    plugin. No extraction takes place.
    """
    path = Path(path)
    try:
        compressed_bytes = path.stat().st_size
    except OSError as error:
        raise ValueError(f"Archive ZIP inaccessible : {path} ({error})") from error
    if compressed_bytes > MAX_COMPRESSED_BYTES:
        raise ValueError("Archive ZIP compressée supérieure à 100 MB.")
    try:
        with ZipFile(path) as archive:
            entries = archive.infolist()
            if not entries:
                raise ValueError("Archive ZIP vide.")
            if len(entries) > MAX_ENTRIES:
                raise ValueError("Archive ZIP contenant plus de 5 000 entrées.")
            uncompressed_bytes = sum(item.file_size for item in entries)
            if uncompressed_bytes > MAX_UNCOMPRESSED_BYTES:
                raise ValueError("Archive ZIP décompressée supérieure à 512 Mio.")

            seen = {}
            files = {}
            for info in entries:
                name, directory = checked_path(info)
                key = normalized(name)
                if key in seen:
                    raise ValueError(f"Chemin ZIP dupliqué après normalisation Unicode/casse : {name!r}")
                seen[key] = (name, directory)
                if not directory:
                    files[name] = info
            for name, _directory in seen.values():
                for ancestor in PurePosixPath(name).parents:
                    if str(ancestor) == ".":
                        continue
                    parent = seen.get(normalized(str(ancestor)))
                    if parent is not None and not parent[1]:
                        raise ValueError(f"Conflit fichier/dossier dans le ZIP : {parent[0]!r}")

            corrupt = archive.testzip()
            if corrupt is not None:
                raise ValueError(f"CRC ZIP invalide : {corrupt}")

            roots = {}
            for name in files:
                root = manifest_root(name)
                if root is not None:
                    roots.setdefault(root, []).append(name)
            if not roots:
                raise ValueError("Manifeste de plugin absent du ZIP.")
            if len(roots) != 1:
                raise ValueError("Plusieurs racines de plugin dans le ZIP : " + ", ".join(repr(r or ".") for r in sorted(roots)))
            root, manifests = next(iter(roots.items()))
            if root and len(PurePosixPath(root).parts) != 1:
                raise ValueError(f"Racine de plugin trop imbriquée : {root!r} ; attendue à la racine du ZIP ou dans un seul dossier de premier niveau.")
            if root:
                siblings = [name for name, _ in seen.values() if name != root and not name.startswith(root + "/")]
                if siblings:
                    raise ValueError(f"Fichiers ou dossiers frères de la racine du plugin interdits : {siblings[0]!r}")

            for name in manifests:
                try:
                    manifest = json.loads(archive.read(files[name]).decode("utf-8"))
                except (UnicodeDecodeError, json.JSONDecodeError) as error:
                    raise ValueError(f"Manifeste JSON UTF-8 invalide : {name}") from error
                if not isinstance(manifest, dict):
                    raise ValueError(f"Le manifeste doit contenir un objet JSON : {name}")
                for field in ("name", "version", "description"):
                    value = manifest.get(field)
                    if not isinstance(value, str) or not value.strip():
                        raise ValueError(f"Champ {field!r} absent ou vide dans le manifeste : {name}")

            prefix = root + "/" if root else ""
            skills = []
            for name, info in files.items():
                if not name.startswith(prefix):
                    continue
                relative = name[len(prefix):]
                parts = PurePosixPath(relative).parts
                if len(parts) == 3 and parts[0] == "skills" and parts[-1] == "SKILL.md" and info.file_size:
                    skills.append(name)
            if not skills:
                raise ValueError("Aucune skill directe non vide dans skills/*/SKILL.md.")
            return {"root": root, "manifests": sorted(manifests), "skills": sorted(skills),
                    "entries": len(entries), "compressed_bytes": compressed_bytes,
                    "uncompressed_bytes": uncompressed_bytes}
    except ValueError:
        raise
    except (BadZipFile, OSError, RuntimeError, NotImplementedError, EOFError, UnicodeDecodeError, zlib.error) as error:
        raise ValueError(f"Archive ZIP invalide ou illisible : {error}") from error


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    args = parser.parse_args()
    try:
        report = validate_archive(args.archive)
    except ValueError as error:
        parser.exit(1, f"Erreur d’archive : {error}\n")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
