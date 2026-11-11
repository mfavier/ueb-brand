"""Render a review board from PDF pages; does not alter the PDF or its images."""
import sys,math
import fitz
from PIL import Image
pdf=fitz.open(sys.argv[1]);columns=min(3,len(pdf));rows=math.ceil(len(pdf)/columns)
board=Image.new('RGB',(columns*310,rows*435),'#d8dde4')
for index,page in enumerate(pdf):
 pix=page.get_pixmap(alpha=False);image=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
 image.thumbnail((300,425));board.paste(image,((index%columns)*310+5,(index//columns)*435+5))
board.save(sys.argv[2])
