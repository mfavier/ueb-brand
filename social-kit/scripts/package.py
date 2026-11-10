#!/usr/bin/env python3
"""Package the complete review kit; the archive is a local delivery, not a source file."""
import argparse
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--out", type=Path, default=ROOT.parent / "ueb-social-kit-v01.zip")
args = parser.parse_args()

source = ROOT.parent / "GUIDE-POSTS-RESEAUX-SOCIAUX.md"
if source.is_file():
    charte = source.read_text().replace("](src/logos/uccle-europe.svg)", "](assets/ueb-logo.svg)")
    for old, new in [("social-kit/README.md", "README.md"),
                     ("social-kit/previews/planche-feed.png", "previews/planche-feed.png"),
                     ("social-kit/BRIEF-CHATGPT.md", "BRIEF-CHATGPT.md")]:
        charte = charte.replace(f"]({old})", f"]({new})")
    (ROOT / "CHARTE.md").write_text(charte)

report = json.loads((ROOT / "previews/render-check.json").read_text())
assert len(report) == 28, "Régénérer les 28 visuels avant la remise."
for item in report:
    assert not item["overflow"] and not item["overlapping"], item["file"]
    assert all(f["status"] == "loaded" for f in item["fonts"]), item["file"]
    assert all(f["ratio"] >= .8 for f in item["fit"]), item["file"]
manifest = json.loads((ROOT / "manifest.json").read_text())
for item in manifest["files"]:
    path = ROOT / item["file"]
    assert hashlib.sha256(path.read_bytes()).hexdigest() == item["sha256"], path
    assert path.with_suffix(".png").is_file(), path

files = sorted(p for p in ROOT.rglob("*") if p.is_file() and
               not any(part in {"__pycache__", "production"} for part in p.relative_to(ROOT).parts) and
               p.name != ".DS_Store")
args.out.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(args.out, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for p in files:
        archive.write(p, Path("ueb-social-kit-v01") / p.relative_to(ROOT))
print(f"{len(files)} fichiers dans {args.out} ({args.out.stat().st_size / 1024 / 1024:.1f} Mio).")
