"""Render governed Markdown specifications as stable, reviewable PDF files."""

from __future__ import annotations

import argparse
import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)

PAGE_WIDTH, PAGE_HEIGHT = A4
BRAND = colors.HexColor('#0052FF')
BRAND_INK = colors.HexColor('#0037A5')
AMBER_INK = colors.HexColor('#B45309')
INK = colors.HexColor('#0F172A')
MUTED = colors.HexColor('#475569')
LINE = colors.HexColor('#E2E8F0')
TINT = colors.HexColor('#E6F0FF')
FONT_DIR = Path(r'C:\Windows\Fonts')


def register_fonts() -> tuple[str, str]:
    regular = FONT_DIR / 'segoeui.ttf'
    bold = FONT_DIR / 'segoeuib.ttf'
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont('WebsiteSans', str(regular)))
        pdfmetrics.registerFont(TTFont('WebsiteSansBold', str(bold)))
        return 'WebsiteSans', 'WebsiteSansBold'
    return 'Helvetica', 'Helvetica-Bold'


REGULAR, BOLD = register_fonts()


def inline_markup(value: str) -> str:
    escaped = html.escape(value)
    escaped = re.sub(r'`([^`]+)`', r'<font name="WebsiteSansBold" color="#0037A5">\1</font>', escaped)
    escaped = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', escaped)
    return escaped.replace('->', '→')


def styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()['BodyText']
    return {
        'title': ParagraphStyle(
            'WebsiteTitle', parent=base, fontName=BOLD, fontSize=27, leading=32,
            textColor=INK, alignment=TA_CENTER, spaceAfter=12,
        ),
        'meta': ParagraphStyle(
            'WebsiteMeta', parent=base, fontName=REGULAR, fontSize=9, leading=13,
            textColor=MUTED, alignment=TA_CENTER, spaceAfter=5,
        ),
        'h2': ParagraphStyle(
            'WebsiteH2', parent=base, fontName=BOLD, fontSize=16, leading=20,
            textColor=BRAND_INK, spaceBefore=15, spaceAfter=7, keepWithNext=True,
        ),
        'h3': ParagraphStyle(
            'WebsiteH3', parent=base, fontName=BOLD, fontSize=11.5, leading=15,
            textColor=INK, spaceBefore=11, spaceAfter=4, keepWithNext=True,
        ),
        'body': ParagraphStyle(
            'WebsiteBody', parent=base, fontName=REGULAR, fontSize=9.2, leading=13.4,
            textColor=INK, spaceAfter=6, alignment=TA_LEFT,
        ),
        'bullet': ParagraphStyle(
            'WebsiteBullet', parent=base, fontName=REGULAR, fontSize=9.2, leading=13.3,
            textColor=INK, leftIndent=13, firstLineIndent=-9, spaceAfter=3,
        ),
        'number': ParagraphStyle(
            'WebsiteNumber', parent=base, fontName=REGULAR, fontSize=9.2, leading=13.3,
            textColor=INK, leftIndent=16, firstLineIndent=-12, spaceAfter=3,
        ),
        'callout': ParagraphStyle(
            'WebsiteCallout', parent=base, fontName=REGULAR, fontSize=9.2, leading=13.3,
            textColor=AMBER_INK, leftIndent=10, rightIndent=10, spaceAfter=7,
            backColor=TINT, borderColor=BRAND, borderWidth=0.75, borderPadding=7,
        ),
    }


def page_chrome(label: str):
    def draw(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.5)
        canvas.line(doc.leftMargin, PAGE_HEIGHT - 15 * mm, PAGE_WIDTH - doc.rightMargin, PAGE_HEIGHT - 15 * mm)
        canvas.setFont(BOLD, 7.5)
        canvas.setFillColor(BRAND_INK)
        canvas.drawString(doc.leftMargin, PAGE_HEIGHT - 11 * mm, 'MUHAMMED AJMAL CONSULTING')
        canvas.setFont(REGULAR, 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(PAGE_WIDTH - doc.rightMargin, PAGE_HEIGHT - 11 * mm, label)
        canvas.line(doc.leftMargin, 13 * mm, PAGE_WIDTH - doc.rightMargin, 13 * mm)
        canvas.setFont(REGULAR, 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(doc.leftMargin, 8.5 * mm, 'Current governed specification')
        canvas.drawRightString(PAGE_WIDTH - doc.rightMargin, 8.5 * mm, f'Page {doc.page}')
        canvas.restoreState()
    return draw


def markdown_story(markdown: str) -> list:
    story: list = []
    active = styles()
    pending: list[str] = []

    def flush_pending() -> None:
        if pending:
            story.append(Paragraph(inline_markup(' '.join(pending)), active['body']))
            pending.clear()

    for raw_line in markdown.splitlines():
        line = raw_line.rstrip()
        if not line.strip():
            flush_pending()
            continue
        if line == '<PAGE_BREAK>':
            flush_pending()
            story.append(PageBreak())
            continue
        if line.startswith('# '):
            flush_pending()
            story.append(Spacer(1, 53 * mm))
            story.append(Paragraph(inline_markup(line[2:]), active['title']))
            continue
        if line.startswith('## '):
            flush_pending()
            story.append(Paragraph(inline_markup(line[3:]), active['h2']))
            continue
        if line.startswith('### '):
            flush_pending()
            story.append(Paragraph(inline_markup(line[4:]), active['h3']))
            continue
        if line.startswith('- '):
            flush_pending()
            story.append(Paragraph('• ' + inline_markup(line[2:]), active['bullet']))
            continue
        numbered = re.match(r'^(\d+)\.\s+(.*)$', line)
        if numbered:
            flush_pending()
            story.append(Paragraph(f'{numbered.group(1)}. ' + inline_markup(numbered.group(2)), active['number']))
            continue
        if line.startswith('> '):
            flush_pending()
            story.append(Paragraph(inline_markup(line[2:]), active['callout']))
            continue
        if line == '---':
            flush_pending()
            story.append(Spacer(1, 4 * mm))
            continue
        if line.startswith('Status:') or line.startswith('Owner:') or line.startswith('Purpose:'):
            flush_pending()
            story.append(Paragraph(inline_markup(line), active['meta']))
            continue
        pending.append(line.strip())

    flush_pending()
    return story


def render(source: Path, destination: Path, label: str) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    document = BaseDocTemplate(
        str(destination), pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm, topMargin=23 * mm, bottomMargin=20 * mm,
        title=label, author='Muhammed Ajmal Consulting',
    )
    frame = Frame(document.leftMargin, document.bottomMargin, document.width, document.height, id='body')
    document.addPageTemplates([PageTemplate(id='specification', frames=[frame], onPage=page_chrome(label))])
    document.build(markdown_story(source.read_text(encoding='utf-8')))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    parser.add_argument('destination', type=Path)
    parser.add_argument('--label', required=True)
    args = parser.parse_args()
    render(args.source, args.destination, args.label)


if __name__ == '__main__':
    main()
