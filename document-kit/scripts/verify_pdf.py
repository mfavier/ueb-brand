"""Structural/visual QA. Requires the pinned QA requirements, never edits PDFs."""
import json,re,sys,unicodedata
from pathlib import Path
import fitz

def normal(value):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', value)).strip()

def check(pdf_path, brief_path):
    doc=fitz.open(pdf_path); brief=json.loads(Path(brief_path).read_text()); failures=[]
    all_text=normal(' '.join(page.get_text(sort=False) for page in doc))
    for index,page in enumerate(doc):
        if abs(page.rect.width-595.28)>.2 or abs(page.rect.height-841.89)>.2: failures.append(f'page {index+1}: not A4')
        spans=[s for b in page.get_text('dict')['blocks'] if 'lines' in b for line in b['lines'] for s in line['spans'] if s['text'].strip()]
        for span in spans:
            x0,y0,x1,y1=span['bbox']
            if x0 < -1 or y0 < -1 or x1>page.rect.width+1 or y1>page.rect.height+1: failures.append(f'page {index+1}: text outside page: {span["text"]}')
            if '\ufffd' in span['text']: failures.append(f'page {index+1}: missing glyph')
        for i,a in enumerate(spans):
            for b in spans[i+1:]:
                aa,bb=fitz.Rect(a['bbox']),fitz.Rect(b['bbox']); overlap=aa&bb
                if not overlap.is_empty and overlap.width>1 and overlap.height>min(a['size'],b['size'])*.65: failures.append(f'page {index+1}: overlapping text: {a["text"]} / {b["text"]}')
        if brief['demo'] and ('LAYOUT SAMPLE' if brief['language']=='en' else 'CONTENUS À VALIDER') not in page.get_text(): failures.append(f'page {index+1}: demo label absent')
        if normal(f'{index+1} / {len(doc)}') not in normal(page.get_text()): failures.append(f'page {index+1}: page counter absent')
        used={s['font'] for s in spans}
        for xref,ext,kind,name,*_ in page.get_fonts():
            if name.split('+')[-1] in used and not doc.extract_font(xref)[-1]: failures.append(f'page {index+1}: used font not embedded')
    for page in brief['pages']:
        values=[page['title'],page.get('lead',''),page.get('quote',''),page.get('note',''),*page.get('paragraphs',[])]
        for card in page.get('cards',[]): values.extend([card['title'],card['text'],*card.get('items',[])])
        if page.get('photo'): values.append(page['photo']['caption'])
        for value in values:
            if value and normal(value) not in all_text: failures.append(f'text lost: {value[:100]}')
    expected=f'{brief["identity"]["id"]}@{brief["identity"]["version"]}'
    if expected not in doc.metadata['subject']: failures.append('identity metadata absent')
    if failures: raise AssertionError('\n'.join(failures))
    return {'file':str(pdf_path),'pages':len(doc),'a4':True,'usedFontsEmbedded':True,'allCopyPreserved':True,'noTextOverflow':True,'identity':expected}
if __name__=='__main__':
    print(json.dumps(check(sys.argv[1],sys.argv[2]),ensure_ascii=False))
