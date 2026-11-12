import json,hashlib,re,sys,zipfile,unittest,posixpath
from pathlib import Path
import yaml
class ArchiveTest(unittest.TestCase):
 def test_package(self):
  archive=Path(sys.argv[-1])
  with zipfile.ZipFile(archive) as z:
   names=set(z.namelist());meta=json.loads(z.read('plugin.json'));delivery=json.loads(z.read('DELIVERY.json'))
   self.assertEqual(meta['name'],'ueb-documents');self.assertLessEqual(len(meta['extensions']['com.openai']['interface']['shortDescription']),30)
   self.assertFalse(any(name.startswith('.') or '/node_modules/' in name or '\\' in name or '..' in name.split('/') for name in names))
   skills=[n for n in names if re.fullmatch(r'skills/[^/]+/SKILL\.md',n)];self.assertEqual(len(skills),1)
   for name in skills:
    contents=z.read(name).decode();front=yaml.safe_load(contents.split('---',2)[1]);self.assertEqual(front['name'],'ueb-documents');self.assertIsInstance(front['description'],str)
   for name in names:
    if not name.endswith('.md'):continue
    for match in re.finditer(r'\]\(([^)]+)\)',z.read(name).decode()):
     link=match.group(1).split('#')[0]
     if not link or re.match(r'^[a-z]+:',link):continue
     target=posixpath.normpath(posixpath.join(posixpath.dirname(name),link))
     self.assertIn(target,names,(name,link))
   for name,expected in delivery['files'].items():self.assertEqual(hashlib.sha256(z.read(name)).hexdigest(),expected)
if __name__=='__main__':
 suite=unittest.defaultTestLoader.loadTestsFromTestCase(ArchiveTest)
 result=unittest.TextTestRunner(verbosity=2).run(suite)
 raise SystemExit(not result.wasSuccessful())
