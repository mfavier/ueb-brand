#!/usr/bin/env python3
"""Assemble one self-contained private UEB documents plugin from canonical files."""
import argparse,hashlib,json,re,subprocess,tempfile,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'plugins/ueb-documents'
sha=lambda b:hashlib.sha256(b).hexdigest()
def build(output):
    meta=json.loads((SOURCE/'plugin.json').read_text())
    assert meta['name']=='ueb-documents' and len(meta['extensions']['com.openai']['interface']['shortDescription'])<=30
    assert meta['$schema']=='https://agent-plugins.org/schemas/1.0.0/plugin.schema.json'
    files={}
    def add_tree(source,prefix,skip=()):
        for file in sorted(source.rglob('*')):
            if any(part in {'node_modules','__pycache__','.DS_Store',*skip} for part in file.relative_to(source).parts):continue
            if file.is_symlink():raise ValueError(f'Symlink forbidden: {file}')
            if file.is_file():files[str(Path(prefix)/file.relative_to(source))]=file.read_bytes()
    add_tree(SOURCE,'')
    add_tree(ROOT/'identity','identity')
    add_tree(ROOT/'document-kit','document-kit')
    add_tree(ROOT/'examples/documents','examples/documents')
    files['assets/ueb-plugin-icon.png']=(ROOT/'social-kit/assets/ueb-plugin-icon.png').read_bytes()
    files['README.md']=b'''# UEB - Documents 0.1.0\n\nSelf-contained private plugin. Follow skills/ueb-documents/SKILL.md.\nNode 22+ runs document-kit/scripts/render.mjs without npm installation.\nThe identity, fonts, recipes, examples and renderer are bundled and versioned.\nDELIVERY.json records the source revision and SHA256 of every shipped file.\nNo MCP server, external publishing or automatic update is installed.\n'''
    revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
    dirty=bool(subprocess.check_output(['git','status','--porcelain','--','identity','document-kit','plugins/ueb-documents','scripts/package_documents.py','examples/documents'],cwd=ROOT,text=True).strip())
    delivery={'schemaVersion':1,'name':meta['name'],'version':meta['version'],'source':{'repository':'mfavier/ueb-brand','commit':revision,'dirty':dirty},'identity':{'id':'ueb-public-2026','version':'1.0.0'},'renderer':{'id':'ueb-documents','version':'0.1.0'},'files':{name:sha(data) for name,data in sorted(files.items())}}
    files['DELIVERY.json']=(json.dumps(delivery,ensure_ascii=False,indent=2)+'\n').encode()
    required=['plugin.json','skills/ueb-documents/SKILL.md','document-kit/dist/renderer.mjs','identity/registry.json','assets/ueb-plugin-icon.png']
    assert all(name in files for name in required)
    assert not any(name.startswith('.') or 'node_modules' in name.split('/') for name in files)
    output=Path(output).resolve();output.parent.mkdir(parents=True,exist_ok=True)
    if output.is_relative_to(SOURCE):raise ValueError('Archive must be outside plugin source')
    with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
        for name,data in sorted(files.items()):
            info=zipfile.ZipInfo(name,date_time=(2026,11,11,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16
            archive.writestr(info,data)
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None and len(archive.namelist())==len(files)
        for name,expected in delivery['files'].items():assert sha(archive.read(name))==expected
    return {'archive':str(output),'name':meta['name'],'version':meta['version'],'files':len(files),'bytes':output.stat().st_size,'sha256':sha(output.read_bytes()),'source':delivery['source']}
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,required=True);args=parser.parse_args()
    print(json.dumps(build(args.output),ensure_ascii=False))
