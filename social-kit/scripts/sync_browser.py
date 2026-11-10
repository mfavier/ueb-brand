#!/usr/bin/env python3
"""Copy the canonical browser engine and production brand assets into Manager.

Run from any directory. --check verifies byte equality without writing.
No dependency on a sibling checkout remains in Manager's build.
"""
from pathlib import Path
import argparse
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANAGER = ROOT.parents[1] / "ueb-manager"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manager", type=Path, default=DEFAULT_MANAGER)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    manager = args.manager.resolve()
    if not (manager / "package.json").is_file():
        parser.error("Manager checkout not found: provide --manager /absolute/path")
    files = {}
    for name in ("poster-engine.js", "poster-engine.d.ts"):
        files[ROOT / "browser" / name] = manager / "src/vendor/ueb-social" / name
    asset_names = ["ueb-logo.svg", "ueb-logo.png", "PROVENANCE.md"]
    asset_names += [str(path.relative_to(ROOT / "assets")) for folder in ("fonts", "decorative")
                    for path in sorted((ROOT / "assets" / folder).iterdir())
                    if path.is_file() and path.name != "preview.png"]
    for name in asset_names:
        files[ROOT / "assets" / name] = manager / "public/social-posts/assets" / name
    mismatches = []
    manifest = {}
    for source, target in files.items():
        content = source.read_bytes()
        manifest[str(target.relative_to(manager))] = hashlib.sha256(content).hexdigest()
        if args.check:
            if not target.is_file() or target.read_bytes() != content:
                mismatches.append(str(target.relative_to(manager)))
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
    if mismatches:
        raise SystemExit("Browser kit differs: " + ", ".join(mismatches))
    print(json.dumps({"mode": "check" if args.check else "sync", "files": len(files), "sha256": manifest}, indent=2))


if __name__ == "__main__":
    main()
