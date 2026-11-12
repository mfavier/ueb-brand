#!/usr/bin/env python3
"""Reproduce/check the static DM Sans instances without mutating a release."""
import argparse,io
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
ROOT=Path(__file__).resolve().parents[1]
FONTS=ROOT/'identity/releases/ueb-public-2026/1.0.0/assets/fonts'
def instance(weight):
 font=TTFont(FONTS/'DM-Sans-Variable.ttf',recalcTimestamp=False)
 static=instantiateVariableFont(font,{'wght':weight,'opsz':14},inplace=False)
 static.recalcTimestamp=False
 family='DM Sans UEB';style='Regular' if weight==400 else 'Bold'
 for name_id,value in [(1,family),(16,family),(2,style),(17,style),(4,family+' '+style),(6,'DMSansUEB-'+style)]:
  for platform,encoding,language in [(3,1,0x409),(1,0,0)]:static['name'].setName(value,name_id,platform,encoding,language)
 output=io.BytesIO();static.save(output,reorderTables=True);return output.getvalue()
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');parser.add_argument('--output',type=Path);args=parser.parse_args()
 if not args.check and not args.output:parser.error('--check or --output is required')
 for weight in [400,700]:
  data=instance(weight);name=f'DM-Sans-{weight}.ttf'
  if args.check:assert data==(FONTS/name).read_bytes(),f'Static font drift: {name}'
  else:args.output.mkdir(parents=True,exist_ok=True);(args.output/name).write_bytes(data)
 print('DM Sans static instances match the recorded derivation.')
