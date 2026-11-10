"""Regression checks for the ZIP boundary actually selected in the import UI."""
import json
import stat
import sys
import tempfile
import unittest
import warnings
from pathlib import Path
from unittest.mock import patch
from zipfile import ZIP_STORED, ZipFile, ZipInfo

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import validate_upload


MANIFEST = json.dumps({"name": "ueb-social-studio", "version": "0.1.1", "description": "UEB posts"})
SKILL = "---\nname: ueb-social-posts\ndescription: Create UEB posts.\n---\nInstructions.\n"


def plugin(prefix="", compatibility=False):
    entries = [(prefix + "plugin.json", MANIFEST), (prefix + "skills/ueb-social-posts/SKILL.md", SKILL)]
    if compatibility:
        entries.append((prefix + ".codex-plugin/plugin.json", MANIFEST))
    return entries


class UploadArchiveTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="ueb-upload-test-")
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / "upload.zip"

    def write(self, entries):
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", UserWarning)
            with ZipFile(self.path, "w", compression=ZIP_STORED) as archive:
                for name, value in entries:
                    archive.writestr(name, value)
        return self.path

    def test_accepts_flat_portable_plugin(self):
        report = validate_upload.validate_archive(self.write(plugin()))
        self.assertEqual(report["root"], "")
        self.assertEqual(report["manifests"], ["plugin.json"])
        self.assertEqual(report["skills"], ["skills/ueb-social-posts/SKILL.md"])

    def test_accepts_single_top_level_plugin_folder(self):
        report = validate_upload.validate_archive(self.write(plugin("ueb/")))
        self.assertEqual(report["root"], "ueb")

    def test_compatibility_overlay_is_same_plugin_root(self):
        report = validate_upload.validate_archive(self.write(plugin(compatibility=True)))
        self.assertEqual(report["root"], "")
        self.assertEqual(len(report["manifests"]), 2)

    def test_accepts_legacy_manifests_at_supported_location(self):
        for folder in (".codex-plugin", ".claude-plugin", ".agent-plugin"):
            with self.subTest(folder=folder):
                entries = [(f"ueb/{folder}/plugin.json", MANIFEST), ("ueb/skills/ueb-social-posts/SKILL.md", SKILL)]
                self.assertEqual(validate_upload.validate_archive(self.write(entries))["root"], "ueb")

    def test_rejects_previous_double_wrapper_marketplace_layout(self):
        entries = plugin("ueb-social-studio-0.1.0/social-kit/", compatibility=True)
        entries += [("ueb-social-studio-0.1.0/README.md", "wrapper"),
                    ("ueb-social-studio-0.1.0/.agents/plugins/marketplace.json", "{}")]
        with self.assertRaisesRegex(ValueError, "trop imbriquée"):
            validate_upload.validate_archive(self.write(entries))

    def test_rejects_two_plugin_roots(self):
        with self.assertRaisesRegex(ValueError, "Plusieurs racines"):
            validate_upload.validate_archive(self.write(plugin("a/") + plugin("b/")))

    def test_rejects_siblings_of_single_plugin_folder(self):
        for sibling in ("README.md", ".agents/plugins/marketplace.json"):
            with self.subTest(sibling=sibling), self.assertRaisesRegex(ValueError, "frères"):
                validate_upload.validate_archive(self.write(plugin("ueb/") + [(sibling, "text")]))

    def test_rejects_unsafe_paths(self):
        for unsafe in ("../secret", "/secret", "C:/secret", "assets\\secret", "assets//secret", "./secret"):
            with self.subTest(path=unsafe), self.assertRaises(ValueError):
                validate_upload.validate_archive(self.write(plugin() + [(unsafe, "text")]))

    def test_rejects_exact_case_and_unicode_duplicate_paths(self):
        pairs = [("assets/logo.svg", "assets/logo.svg"),
                 ("assets/logo.svg", "ASSETS/LOGO.SVG"),
                 ("assets/café.txt", "assets/cafe\u0301.txt")]
        for left, right in pairs:
            with self.subTest(pair=(left, right)), self.assertRaisesRegex(ValueError, "dupliqué"):
                validate_upload.validate_archive(self.write(plugin() + [(left, "one"), (right, "two")]))

    def test_rejects_symlink_and_file_directory_conflict(self):
        link = ZipInfo("assets/link")
        link.create_system = 3
        link.external_attr = (stat.S_IFLNK | 0o777) << 16
        with self.assertRaisesRegex(ValueError, "Type d’entrée"):
            validate_upload.validate_archive(self.write(plugin() + [(link, "../../target")]))
        with self.assertRaisesRegex(ValueError, "Conflit fichier/dossier"):
            validate_upload.validate_archive(self.write(plugin() + [("assets", "file"), ("assets/logo.svg", "image")]))

    def test_rejects_corrupt_crc(self):
        self.write(plugin() + [("assets/probe.txt", "CRC-PROBE")])
        blob = bytearray(self.path.read_bytes())
        index = blob.index(b"CRC-PROBE")
        blob[index] ^= 1
        self.path.write_bytes(blob)
        with self.assertRaisesRegex(ValueError, "CRC"):
            validate_upload.validate_archive(self.path)

    def test_rejects_empty_or_invalid_manifest_fields(self):
        for value in ("[]", "bad json", json.dumps({"name": "ueb"}),
                      json.dumps({"name": "ueb", "version": "0.1.1", "description": " "})):
            with self.subTest(manifest=value), self.assertRaisesRegex(ValueError, "manifeste|Manifeste"):
                validate_upload.validate_archive(self.write([("plugin.json", value), ("skills/ueb/SKILL.md", SKILL)]))

    def test_requires_a_direct_nonempty_skill(self):
        for name, content in [("skills/ueb/nested/SKILL.md", SKILL), ("skills/ueb/SKILL.md", "")]:
            with self.subTest(skill=name), self.assertRaisesRegex(ValueError, "skill directe"):
                validate_upload.validate_archive(self.write([("plugin.json", MANIFEST), (name, content)]))

    def test_archive_limits_are_enforced_before_extraction(self):
        self.write(plugin())
        for name in ("MAX_COMPRESSED_BYTES", "MAX_UNCOMPRESSED_BYTES", "MAX_ENTRIES", "MAX_MEMBER_BYTES"):
            with self.subTest(limit=name), patch.object(validate_upload, name, 1), self.assertRaises(ValueError):
                validate_upload.validate_archive(self.path)

    def test_rejects_non_zip_input(self):
        self.path.write_text("This is not a ZIP")
        with self.assertRaisesRegex(ValueError, "ZIP invalide"):
            validate_upload.validate_archive(self.path)


if __name__ == "__main__":
    unittest.main()
