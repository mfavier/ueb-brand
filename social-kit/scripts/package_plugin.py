#!/usr/bin/env python3
"""Build one plugin ZIP for direct upload, or an explicitly selected local marketplace."""
import argparse
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from validate_upload import validate_archive

ROOT = Path(__file__).resolve().parents[1]


def sync_charter():
    source = ROOT.parent / "GUIDE-POSTS-RESEAUX-SOCIAUX.md"
    if not source.is_file():
        return
    text = source.read_text().replace("](src/logos/uccle-europe.svg)", "](assets/ueb-logo.svg)")
    for name in ("README.md", "BRIEF-CHATGPT.md", "REGLES-CREATION.md", "INSTALLATION-CHATGPT.md",
                 "previews/planche-feed.png", "previews/planche-explorations.png"):
        text = text.replace(f"](social-kit/{name})", f"]({name})")
    (ROOT / "CHARTE.md").write_text(text)


def files_to_ship():
    paths = set()
    for folder in ("assets", "data", "skills", "schemas", ".codex-plugin"):
        paths.update(p for p in (ROOT / folder).rglob("*") if p.is_file())
    paths.update((ROOT / "templates").glob("*.svg"))
    paths.update((ROOT / "examples").glob("*-feed.png"))
    paths.update((ROOT / "explorations").glob("*-feed.png"))
    for name in ("plugin.json", "CHARTE.md", "REGLES-CREATION.md", "BRIEF-CHATGPT.md",
                 "INSTALLATION-CHATGPT.md", "TESTS-ACCEPTATION.md",
                 "scripts/generate.py", "scripts/render.mjs", "scripts/validate_plugin.py",
                 "scripts/package_plugin.py", "scripts/validate_upload.py", "previews/index.html", "previews/explorations.html",
                 "previews/planche-feed.png", "previews/planche-explorations.png", "previews/lecture-mobile.png"):
        paths.add(ROOT / name)
    return sorted(p for p in paths if p.name != ".DS_Store" and "__pycache__" not in p.parts)


def main():
    meta = json.loads((ROOT / "plugin.json").read_text())
    name, version = meta["name"], meta["version"]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--layout", choices=("upload", "marketplace"), default="upload",
                        help="upload : un plugin à la racine du ZIP ; marketplace : catalogue local avec sa source.")
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    kind = "plugin" if args.layout == "upload" else "marketplace"
    args.out = args.out or ROOT.parent / f"{name}-{kind}-{version}.zip"
    sync_charter()
    validator = ROOT / "scripts/validate_plugin.py"
    subprocess.run([sys.executable, str(validator)], check=True)
    files = files_to_ship()
    if args.layout == "upload":
        # A portable manifest is sufficient: exclude the repo's compatibility overlay
        # and keep exactly one plugin directly at the ZIP root.
        files = [p for p in files if ".codex-plugin" not in p.relative_to(ROOT).parts]
    for p in files:
        if not p.is_file():
            raise ValueError(f"Ressource manquante : {p.relative_to(ROOT)}")
    outer = Path(f"{name}-{version}")
    catalogue = {
        "name": "ueb-brand-local", "interface": {"displayName": "Uccle Europe — Communication"},
        "plugins": [{"name": name, "source": {"source": "local", "path": "./social-kit"},
                     "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
                     "category": "Productivity"}],
    }
    runtime_readme = """# UEB — Atelier communication

Source compacte du plugin. Les compositions complètes de revue restent dans le dépôt ueb-brand.

- [Installer dans ChatGPT](INSTALLATION-CHATGPT.md).
- [Règles générales de création](REGLES-CREATION.md).
- [Entrée de la skill](skills/ueb-social-posts/SKILL.md).
- [Charte détaillée](CHARTE.md).
- [Planche des sept rubriques](previews/planche-feed.png).
- [Comparaison photo et blason](previews/planche-explorations.png).
- [Recette après installation](TESTS-ACCEPTATION.md).

Les modèles SVG sont dans `templates/`, les exemples PNG feed dans `examples/`, les explorations PNG feed dans `explorations/`. Les données de départ sont dans `data/` et les actifs dans `assets/`. Les noms et données des exemples sont fictifs ; le portrait illustratif est réservé à la démonstration.

Pour une production, suivre le contrat de travail de la skill et appeler le moteur avec un JSON réel. Les SVG sont autonomes. Un PNG fidèle nécessite un exporteur disponible dans la session. Cette sélection n’inclut pas les exports de bibliothèque redondants ; elle contient les ressources nécessaires à l’exécution de la skill.
"""
    top_readme = """# UEB — Atelier communication

Le plugin est dans `social-kit/`. Le catalogue de source locale est dans `.agents/plugins/marketplace.json` et pointe vers ce dossier.

Lire [l’installation](social-kit/INSTALLATION-CHATGPT.md), puis la [recette](social-kit/TESTS-ACCEPTATION.md).

L’archive est une source de plugin à installer et tester ; elle n’atteste pas son installation dans un compte ChatGPT.
"""
    shipped = [{"file": str(p.relative_to(ROOT)), "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]
    delivery = {"name": name, "version": version, "kind": "skills-only", "files": shipped,
                "archive_layout": args.layout,
                "validation": "static structure and local scripts; target ChatGPT conversation still to test"}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(args.out, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for p in files:
            relative = p.relative_to(ROOT)
            archive.write(p, relative if args.layout == "upload" else outer / "social-kit" / relative)
        if args.layout == "upload":
            archive.writestr("README.md", runtime_readme)
            archive.writestr("delivery.json", json.dumps(delivery, ensure_ascii=False, indent=2) + "\n")
        else:
            archive.writestr(str(outer / ".agents/plugins/marketplace.json"), json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n")
            archive.writestr(str(outer / "social-kit/README.md"), runtime_readme)
            archive.writestr(str(outer / "README.md"), top_readme)
            archive.writestr(str(outer / "delivery.json"), json.dumps(delivery, ensure_ascii=False, indent=2) + "\n")
    if args.layout == "upload":
        validate_archive(args.out)
    # Validate the delivered tree, not just the checkout used to assemble it.
    with tempfile.TemporaryDirectory(prefix="ueb-plugin-delivery-") as temp:
        with ZipFile(args.out) as archive:
            if archive.testzip() is not None:
                raise ValueError("Archive endommagée.")
            archive.extractall(temp)
        delivered = Path(temp) if args.layout == "upload" else Path(temp) / outer / "social-kit"
        subprocess.run([sys.executable, str(delivered / "scripts/validate_plugin.py"), "--root", str(delivered)], check=True)
        for item in shipped:
            actual = hashlib.sha256((delivered / item["file"]).read_bytes()).hexdigest()
            if actual != item["sha256"]:
                raise ValueError(f"Empreinte incohérente : {item['file']}")
    print(json.dumps({"archive": str(args.out), "layout": args.layout, "files": len(files) + (2 if args.layout == "upload" else 4),
                      "sizeMiB": round(args.out.stat().st_size / 1024 / 1024, 1),
                      "status": "source packaged and local checks passed; not installed in ChatGPT"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
