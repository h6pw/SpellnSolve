"""Conversor para o subconjunto Markdown usado pelo GDD, sem recursos remotos."""
import html
import json
import os
import pathlib
from datetime import datetime, timezone
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.pagesizes import A4
pkg = json.loads(pathlib.Path('package.json').read_text(encoding='utf-8-sig'))
version = pkg['version']
ref = os.environ.get('GITHUB_REF_NAME', '')
if os.environ.get('GITHUB_REF_TYPE') == 'tag' and ref != 'v' + version:
    raise SystemExit('Versão do GDD diverge da tag')
date = datetime.fromtimestamp(int(os.environ.get('SOURCE_DATE_EPOCH', datetime.now(timezone.utc).timestamp())), timezone.utc).date().isoformat()
source = pathlib.Path('docs/gdd.md').read_text(encoding='utf-8-sig').replace('{{VERSION}}', version).replace('{{DATE}}', date)
styles = getSampleStyleSheet()
styles['Normal'].fontName = 'Helvetica'
styles['Normal'].fontSize = 9.5
styles['Normal'].leading = 14
styles['Normal'].spaceAfter = 6
styles['Normal'].allowOrphans = 0
styles['Normal'].allowWidows = 0
for key in ['Title','Heading1','Heading2']:
    styles[key].textColor = colors.HexColor('#214451')
    styles[key].alignment = TA_LEFT
    styles[key].keepWithNext = True
story=[]
for line in source.splitlines():
    if not line.strip():
        story.append(Spacer(1, 5))
        continue
    level = len(line) - len(line.lstrip('#'))
    style = 'Title' if level == 1 else 'Heading1' if level == 2 else 'Heading2' if level == 3 else 'Normal'
    text = line.lstrip('# ').replace('**','').replace('`','').replace('—','-').replace('→',' > ')
    story.append(Paragraph(html.escape(text), styles[style]))
def footer(canvas, doc):
    canvas.setFont('Helvetica',8)
    canvas.setFillColor(colors.HexColor('#60757a'))
    canvas.drawString(42,28,f'Spell & Solve | GDD {version} | {date}')
    canvas.drawRightString(A4[0]-42,28,str(doc.page))
pathlib.Path('artifacts').mkdir(exist_ok=True)
SimpleDocTemplate('artifacts/GDD.pdf',pagesize=A4,rightMargin=42,leftMargin=42,topMargin=42,bottomMargin=48,title='Spell & Solve - GDD').build(story,onFirstPage=footer,onLaterPages=footer)
print('artifacts/GDD.pdf gerado')
