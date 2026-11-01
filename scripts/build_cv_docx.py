"""Turns cv-build/cv.json (written by scripts/build-cv.ts) into a Word CV.

Run: python3 scripts/build_cv_docx.py
"""
import json
from pathlib import Path

from docx import Document
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "cv-build" / "cv.json").read_text())

INK = RGBColor(0x1E, 0x0B, 0x12)
CHERRY = RGBColor(0x4A, 0x10, 0x24)
ACCENT = RGBColor(0x2C, 0x4A, 0x6B)
MUTED = RGBColor(0x5C, 0x5A, 0x55)

doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Mm(210), Mm(297)
sec.left_margin = sec.right_margin = Mm(14)
sec.top_margin, sec.bottom_margin = Mm(13), Mm(12)
text_width = sec.page_width - sec.left_margin - sec.right_margin

base = doc.styles["Normal"]
base.font.name = "Arial"
base.element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
base.font.size = Pt(9)
base.font.color.rgb = INK
base.paragraph_format.space_after = Pt(0)
base.paragraph_format.line_spacing = 1.12


def para(space_before=0):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    return p


def run(p, text, size=None, bold=False, color=None, font=None, italic=False):
    r = p.add_run(text)
    if size:
        r.font.size = Pt(size)
    r.bold = bold
    r.italic = italic
    if color:
        r.font.color.rgb = color
    if font:
        r.font.name = font
    return r


def rule(p, color="141413", size=6):
    pPr = p._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), str(size))
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), color)
    bdr.append(bottom)
    pPr.append(bdr)


p = para()
run(p, data["name"], size=24, font="Georgia", color=CHERRY)
p = para(2)
run(p, data["role"], size=10.5, bold=True, color=ACCENT)
p = para(3)
run(p, "  |  ".join(data["contact"]), size=8.2, color=MUTED)
p = para(6)
rule(p, "4A1024")
p = para(4)
run(p, data["summary"], size=9.4)

for block in data["blocks"]:
    h = para(9)
    run(h, block["heading"].upper(), size=8, bold=True, color=ACCENT)
    rule(h, "D9D3C6", 4)
    skills = block["heading"] == "Skills"
    for it in block["items"]:
        p = para(2 if skills else 4)
        p.paragraph_format.tab_stops.add_tab_stop(text_width, WD_TAB_ALIGNMENT.RIGHT)
        p.paragraph_format.keep_with_next = bool(it.get("bullets") or it.get("text")) and not skills
        if skills:
            run(p, it["title"] + ": ", bold=True)
            run(p, it.get("text", ""))
            continue
        run(p, it["title"], bold=True)
        if it.get("org"):
            run(p, ", " + it["org"])
        if it.get("where"):
            run(p, " (" + it["where"] + ")", color=MUTED)
        if it.get("when"):
            run(p, "\t" + it["when"], size=8, color=MUTED)
        if it.get("text"):
            t = para(1)
            run(t, it["text"])
        for b in it.get("bullets") or []:
            bp = doc.add_paragraph(style="List Bullet")
            bp.paragraph_format.left_indent = Mm(4)
            bp.paragraph_format.space_before = Pt(1)
            run(bp, b)

core = doc.core_properties
core.author = data["name"]
core.title = f'{data["name"]} CV'

out = ROOT / "public" / "rachelcooray-cv.docx"
doc.save(out)
print(f"Wrote {out}")
