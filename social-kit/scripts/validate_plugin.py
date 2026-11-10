#!/usr/bin/env python3
"""Validate the UEB plugin source or an extracted compact bundle, without installing it."""
import argparse
import copy
import hashlib
import importlib.util
import json
import re
import shutil
import sys
import tempfile
import xml.etree.ElementTree as ET
import struct
from pathlib import Path
from urllib.parse import unquote, urlsplit

LOGO_SHA256 = "9037f430905f4d33a05a843468ba9b3cc318a74f46d791b9b3a7f8eeab2456bf"
PLUGIN_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
ASSET_FIELDS = ("logo", "photo", "portrait", "backgroundPhoto")
NS = "{http://www.w3.org/2000/svg}"
sys.dont_write_bytecode = True


class Validation:
    def __init__(self, root):
        self.root = root.resolve()
        self.passed = 0
        self.failures = []
        self.warnings = []
        self.details = {}

    def check(self, condition, message):
        if condition:
            self.passed += 1
        else:
            self.failures.append(message)
        return bool(condition)

    def local(self, value, base=None, require=True):
        """Resolve a resource reference and require containment in the plugin root."""
        path = ((base or self.root) / value).resolve()
        inside = path.is_relative_to(self.root)
        if not self.check(inside, f"Chemin hors du plugin : {value}"):
            return None
        if require and not self.check(path.exists(), f"Ressource absente : {path.relative_to(self.root)}"):
            return None
        return path

    def load(self, relative):
        path = self.local(relative)
        if path is None:
            return None
        try:
            return json.loads(path.read_text())
        except (OSError, ValueError) as error:
            self.failures.append(f"JSON invalide : {relative} ({error})")
            return None

    def run(self, name, action):
        """Continue independent checks after a malformed resource is found."""
        try:
            action()
        except Exception as error:
            self.failures.append(f"{name} : {type(error).__name__} : {error}")


def manifest_checks(v):
    manifest = v.load("plugin.json")
    if not isinstance(manifest, dict):
        v.check(False, "plugin.json doit contenir un objet.")
        return
    v.check(manifest.get("$schema") == PLUGIN_SCHEMA, "Le manifeste doit déclarer le schéma racine Agent Plugins 1.0.0.")
    v.check(bool(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", str(manifest.get("name", "")))), "Nom de plugin absent ou invalide.")
    v.check(bool(re.fullmatch(r"\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?", str(manifest.get("version", "")))), "Version du plugin absente ou invalide.")
    v.check(isinstance(manifest.get("description"), str) and bool(manifest["description"].strip()), "Description du plugin absente.")
    interface = manifest.get("extensions", {}).get("com.openai", {}).get("interface", {})
    if v.check(isinstance(interface, dict) and bool(interface), "Interface OpenAI absente du manifeste."):
        for key in ("displayName", "shortDescription", "developerName"):
            v.check(isinstance(interface.get(key), str) and bool(interface[key].strip()), f"Interface : {key} absent.")
        v.check(isinstance(interface.get("shortDescription"), str) and len(interface["shortDescription"]) <= 30,
                "Interface : shortDescription doit contenir au plus30caractères.")
        for key in ("composerIcon", "logo"):
            value = interface.get(key)
            if v.check(isinstance(value, str) and value.startswith("./assets/"), f"Interface : {key} doit référencer ./assets/."):
                path = v.local(value)
                if path:
                    v.check(path.is_file(), f"Interface : {key} doit référencer un fichier.")
                    if path.is_file() and path.suffix.lower() == ".svg":
                        svg = ET.parse(path).getroot()
                        box = [float(x) for x in svg.get("viewBox", "").split()]
                        v.check(len(box) == 4 and box[2] == box[3] and box[2] >= 48,
                                f"Interface : {key} doit être une image carrée d’au moins48×48.")
                    elif path.is_file() and path.suffix.lower() == ".png":
                        width, height = struct.unpack(">II", path.read_bytes()[16:24])
                        v.check(width == height and 48 <= width <= 4096,
                                f"Interface : {key} doit être un PNG carré entre48et4096px.")
        prompts = interface.get("defaultPrompt")
        v.check(isinstance(prompts, list) and bool(prompts) and all(isinstance(p, str) and p.strip() for p in prompts), "Interface : defaultPrompt doit être une liste de textes non vides.")

    def local_refs(value):
        if isinstance(value, dict):
            for child in value.values():
                local_refs(child)
        elif isinstance(value, list):
            for child in value:
                local_refs(child)
        elif isinstance(value, str) and value.startswith(("./", "../")):
            v.local(value)

    local_refs(manifest)
    compatibility = v.root / ".codex-plugin/plugin.json"
    if compatibility.is_file():
        other = v.load(".codex-plugin/plugin.json")
        if isinstance(other, dict):
            for key in ("name", "version"):
                v.check(other.get(key) == manifest.get(key), f"Manifeste de compatibilité : {key} non aligné.")
            local_refs(other)
    v.details["manifest"] = {"name": manifest.get("name"), "version": manifest.get("version"), "compatibility": compatibility.is_file()}

    catalogue = v.root.parent / ".agents/plugins/marketplace.json"
    if not catalogue.is_file():
        v.warnings.append("Catalogue parent absent : non requis pour une source plugin autonome ; découverte locale non vérifiée.")
        v.details["catalogue"] = "absent"
        return
    catalogue_data = json.loads(catalogue.read_text())
    entries = catalogue_data.get("plugins", [])
    matching = [p for p in entries if isinstance(p, dict) and p.get("name") == manifest.get("name")]
    if v.check(len(matching) == 1, "Le catalogue doit contenir exactement une entrée portant le nom du plugin."):
        source = matching[0].get("source", {})
        v.check(source.get("source") == "local" and source.get("path") == "./social-kit", "Le catalogue doit référencer la source locale ./social-kit.")
        v.check((v.root.parent / source.get("path", "")).resolve() == v.root, "La source du catalogue ne correspond pas à la racine validée.")
    v.details["catalogue"] = "present"


def skill_checks(v):
    path = v.local("skills/ueb-social-posts/SKILL.md")
    if path is None:
        return
    text = path.read_text()
    lines = text.splitlines()
    if not v.check(bool(lines) and lines[0] == "---", "SKILL.md : frontmatter YAML absent."):
        return
    try:
        end = lines.index("---", 1)
    except ValueError:
        v.check(False, "SKILL.md : frontmatter YAML non fermé.")
        return
    fields = {}
    for line in lines[1:end]:
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        match = re.fullmatch(r"([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*?)\s*", line)
        if not v.check(bool(match), "SKILL.md : le frontmatter doit contenir des champs simples nom: valeur."):
            continue
        key, value = match.groups()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
            value = value[1:-1]
        v.check(key not in fields, f"SKILL.md : champ {key} dupliqué.")
        fields[key] = value
    v.check(fields.get("name") == "ueb-social-posts", "SKILL.md : name doit correspondre à ueb-social-posts.")
    v.check(bool(fields.get("description", "").strip()), "SKILL.md : description vide.")
    v.check(bool("\n".join(lines[end + 1:]).strip()), "SKILL.md : instructions absentes.")
    v.details["skill"] = fields.get("name")


def markdown_checks(v):
    count = 0
    for md in sorted(v.root.rglob("*.md")):
        if any(p in {"node_modules", ".git", "__pycache__"} for p in md.relative_to(v.root).parts):
            continue
        kept, fence = [], None
        for line in md.read_text().splitlines():
            marker = re.match(r"\s*(`{3,}|~{3,})", line)
            if marker:
                if fence is None:
                    fence = marker.group(1)[0]
                elif marker.group(1)[0] == fence:
                    fence = None
                continue
            if fence is None:
                kept.append(line)
        text = re.sub(r"(`+).*?\1", "", "\n".join(kept))
        for match in re.finditer(r"!?\[[^\]]*\]\(([^)]+)\)", text):
            raw = match.group(1).strip()
            target = raw[1:raw.index(">")] if raw.startswith("<") and ">" in raw else raw.split()[0]
            parsed = urlsplit(target)
            if parsed.scheme in {"http", "https", "mailto"} or target.startswith("#"):
                continue
            if parsed.scheme:
                v.check(False, f"Lien local non portable dans {md.relative_to(v.root)} : {target}")
                continue
            local = unquote(parsed.path)
            if local:
                v.local(local, base=md.parent)
                count += 1
    v.details["local_markdown_links"] = count


def resource_checks(v):
    required = ["REGLES-CREATION.md", "CHARTE.md", "BRIEF-CHATGPT.md", "README.md",
                "schemas/post.schema.json", "skills/ueb-social-posts/references/production.md",
                "scripts/generate.py", "assets/ueb-logo.svg", "assets/ueb-logo.png",
                "assets/fonts/Kanit-Bold.ttf", "assets/fonts/Kanit-ExtraBold.ttf",
                "assets/fonts/DM-Sans-Variable.ttf", "assets/fonts/Kanit-OFL.txt",
                "assets/fonts/DM-Sans-OFL.txt", "assets/photos/portrait-illustratif-adulte.png",
                "assets/decorative/ueb-crest-night.svg", "assets/decorative/ueb-crest-blue.svg",
                "assets/decorative/ueb-crest-white.svg"]
    for relative in required:
        path = v.local(relative)
        if path:
            v.check(path.is_file() and path.stat().st_size > 0, f"Ressource vide ou non régulière : {relative}")
            if path.suffix == ".ttf" and path.is_file():
                v.check(path.read_bytes()[:4] in (b"\x00\x01\x00\x00", b"OTTO", b"ttcf"), f"Signature de police invalide : {relative}")
            if path.suffix == ".png" and path.is_file():
                v.check(path.read_bytes()[:8] == b"\x89PNG\r\n\x1a\n", f"Signature PNG invalide : {relative}")
    for path in v.root.rglob("*"):
        if any(p in {"node_modules", ".git", "__pycache__"} for p in path.relative_to(v.root).parts):
            continue
        v.check(path.resolve().is_relative_to(v.root), f"Ressource ou lien symbolique hors du plugin : {path.relative_to(v.root)}")
    logo = v.root / "assets/ueb-logo.svg"
    if logo.is_file():
        v.check(hashlib.sha256(logo.read_bytes()).hexdigest() == LOGO_SHA256, "Le SVG du blason officiel diffère de la source de référence.")
    for path in sorted(v.root.rglob("*.svg")):
        if "node_modules" in path.parts:
            continue
        try:
            root = ET.parse(path).getroot()
            v.check(root.tag == NS + "svg", f"SVG racine invalide : {path.relative_to(v.root)}")
            for node in root.iter():
                for name in ("href", "{http://www.w3.org/1999/xlink}href"):
                    value = node.get(name)
                    if value and not value.startswith(("data:", "#")):
                        v.local(value, base=path.parent)
        except (ET.ParseError, OSError) as error:
            v.check(False, f"SVG invalide : {path.relative_to(v.root)} ({error})")


def data_checks(v):
    schema = v.load("schemas/post.schema.json")
    if isinstance(schema, dict):
        v.check(schema.get("type") == "object", "Le schéma de post doit décrire un objet.")
        v.check(schema.get("$schema") == "https://json-schema.org/draft/2020-12/schema", "Le schéma de post doit déclarer JSON Schema 2020-12.")
    spec = importlib.util.spec_from_file_location("ueb_plugin_generator_validation", v.root / "scripts/generate.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.ROOT = v.root
    examples, samples = {}, []
    for key in module.NAMES:
        for suffix in ("example", "template"):
            relative = f"data/{key}-{suffix}.json"
            d = v.load(relative)
            if not isinstance(d, dict):
                v.check(False, f"Données de référence invalides : {relative}")
                continue
            for name in ASSET_FIELDS:
                if isinstance(d.get(name), str) and d[name]:
                    v.local(d[name])
            module.validate(key, d)
            samples.append((relative, d))
            if suffix == "example":
                examples[key] = d
        for suffix in ("feed", "story"):
            v.local(f"templates/{key}-{suffix}.svg")
        v.local(f"examples/{key}-feed.png")
    v.check(len(samples) == 14, "Quatorze jeux de données de référence sont requis.")
    explorations = v.load("data/explorations.json")
    v.check(isinstance(explorations, list) and len(explorations) == 6, "Six explorations sont requises.")
    if isinstance(explorations, list):
        ids = []
        for entry in explorations:
            identifier = entry.get("id", "")
            v.check(bool(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", identifier)), "Identifiant d’exploration invalide.")
            ids.append(identifier)
            source = v.local(entry["source"], base=v.root / "data")
            if source:
                d = json.loads(source.read_text())
                d.update(entry.get("overrides", {}))
                for name in ASSET_FIELDS:
                    if isinstance(d.get(name), str) and d[name]:
                        v.local(d[name])
                module.validate(d.get("template"), d)
                samples.append((f"exploration:{identifier}", d))
            v.local(f"explorations/{identifier}-feed.png")
        v.check(len(ids) == len(set(ids)), "Identifiants d’exploration dupliqués.")
    v.details["reference_data"] = {"reference": len(samples) - len(explorations or []), "explorations": len(explorations or [])}

    try:
        import jsonschema
    except ImportError:
        v.details["json_schema"] = {"status": "skipped", "reason": "Module jsonschema non installé ; validation complète du schéma non exécutée."}
        v.warnings.append("Validation JSON Schema complète non exécutée : module optionnel jsonschema absent. Les données sont contrôlées par generate.validate().")
    else:
        validator_class = jsonschema.validators.validator_for(schema)
        validator_class.check_schema(schema)
        validator = validator_class(schema)
        schema_failures = 0
        for relative, data in samples:
            errors = list(validator.iter_errors(data))
            schema_failures += len(errors)
            v.check(not errors, f"JSON Schema : {relative} : " + "; ".join(error.message for error in errors[:3]))
        v.details["json_schema"] = {"status": "failed" if schema_failures else "passed", "samples": len(samples), "errors": schema_failures}

    negative_count = 0

    def reject(label, key, data):
        nonlocal negative_count
        negative_count += 1
        try:
            module.validate(key, data, production=True)
        except ValueError:
            v.check(True, label)
        else:
            v.check(False, f"Cas négatif accepté à tort : {label}")

    production = {}
    for key, sample in examples.items():
        d = copy.deepcopy(sample)
        d.update(demo=False, alt="Contrôle technique")
        if key == "04-player-of-the-week":
            d["portrait"] = None
        if key == "07-score-final":
            d.update(home=["ROYAL BRUSSELS", "WOLUWE BASKET"], away=["UCCLE", "EUROPE"],
                     homeScore="101", awayScore="108", backgroundPhoto=None, photo=None,
                     closing=["Contrôle technique", "Sans diffusion"])
        module.validate(key, d, production=True)
        production[key] = d
    v.check(len(production) == 7, "Les sept types doivent être valides en mode production technique.")

    final_key = "07-score-final"
    for demo in (True, None, 0, "false"):
        bad = copy.deepcopy(production[final_key])
        bad["demo"] = demo
        reject(f"demo={demo!r}", final_key, bad)
    bad = copy.deepcopy(production[final_key])
    del bad["demo"]
    reject("demo absent", final_key, bad)
    essential = {"01-resultats": "matches", "02-programme": "edition", "03-partenaire": "contribution",
                 "04-player-of-the-week": "name", "05-annonce-officielle": "body",
                 "06-communication": "details", final_key: "awayScore"}
    for key, field in essential.items():
        bad = copy.deepcopy(production[key])
        del bad[field]
        reject(f"{key}, {field} absent", key, bad)
    bad = copy.deepcopy(production[final_key])
    bad["homeScore"] = "—"
    reject("score final tiret", final_key, bad)

    with tempfile.TemporaryDirectory(prefix="ueb-plugin-validation-") as temporary:
        temporary = Path(temporary)
        player_key = "04-player-of-the-week"
        bad = copy.deepcopy(production[player_key])
        bad["portrait"] = "assets/photos/portrait-illustratif-adulte.png"
        reject("portrait de démonstration direct", player_key, bad)
        source = v.root / bad["portrait"]
        if source.is_file():
            copied = temporary / "portrait-copie.png"
            shutil.copyfile(source, copied)
            bad["portrait"] = str(copied)
            reject("copie identique du portrait de démonstration", player_key, bad)
        for key, data in production.items():
            module.single(key, data, temporary, "production")
        files = sorted(temporary.glob("*.svg"))
        v.check(len(files) == 14, "La génération technique doit produire quatorze SVG temporaires.")
        for path in files:
            svg = ET.parse(path).getroot()
            v.check(svg.get("width") == "1080" and svg.get("height") == ("1920" if "-story" in path.name else "1350"), f"Dimensions incorrectes : {path.name}")
            if path.name.startswith(final_key):
                text = {n.get("id"): n.text for n in svg.iter(NS + "text")}
                v.check(text.get("home-name-1") == "ROYAL BRUSSELS" and text.get("home-score") == "101", f"Association domicile–101 incorrecte : {path.name}")
                v.check(text.get("away-name-1") == "UCCLE" and text.get("away-name-2") == "EUROPE" and text.get("away-score") == "108", f"Association UEB extérieur–108 incorrecte : {path.name}")
        v.details["temporary_svg_generation"] = len(files)
    v.details["production_cases"] = {"positive_types": len(production), "negative_cases": negative_count}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1],
                        help="Racine du plugin (dossier contenant plugin.json).")
    args = parser.parse_args()
    v = Validation(args.root)
    for name, action in (("Manifeste et catalogue", manifest_checks), ("Skill", skill_checks),
                         ("Ressources", resource_checks), ("Liens Markdown", markdown_checks),
                         ("Données et génération", data_checks)):
        v.run(name, lambda action=action: action(v))
    report = {"status": "failed" if v.failures else "passed", "checks_passed": v.passed,
              "details": v.details, "warnings": v.warnings, "failures": v.failures,
              "limits": "Contrôles locaux statiques et scripts uniquement ; aucune installation ni recette dans ChatGPT n’est attestée."}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if v.failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
