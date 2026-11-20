from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
SITE_URL = "https://keffyjnr.github.io/Uni-Pilot/"

EXCLUDED = {
    "ai.html", "auth.html", "privacy.html", "terms.html",
    "result.html", "results.html", "reg.html", "open.html",
    "search.html"
}
SKIP_DIRS = {".git", ".github", "node_modules", "scripts"}

class PageText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.skip_depth = 0
        self.skip_tags = {"script", "style", "noscript", "svg", "nav", "footer", "header"}

    def handle_starttag(self, tag, attrs):
        if tag in self.skip_tags:
            self.skip_depth += 1

    def handle_endtag(self, tag):
        if tag in self.skip_tags and self.skip_depth:
            self.skip_depth -= 1
        elif tag in {"p", "div", "section", "article", "li", "tr", "h1", "h2", "h3", "h4", "br"}:
            self.parts.append("\n")

    def handle_data(self, data):
        if not self.skip_depth:
            text = re.sub(r"\s+", " ", data).strip()
            if text:
                self.parts.append(text)

def clean_text(html):
    parser = PageText()
    parser.feed(html)
    text = "\n".join(part for part in parser.parts if part)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

pages = []
for path in sorted(ROOT.rglob("*.html")):
    rel = path.relative_to(ROOT)
    if any(part in SKIP_DIRS for part in rel.parts):
        continue
    if len(rel.parts) != 1 or rel.name in EXCLUDED:
        continue
    try:
        raw = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue
    content = clean_text(raw)
    if len(content) < 80:
        continue
    title_match = re.search(r"<title[^>]*>(.*?)</title>", raw, re.I | re.S)
    title = re.sub(r"\s+", " ", title_match.group(1)).strip() if title_match else path.stem.replace("-", " ").title()
    pages.append({
        "title": title,
        "url": SITE_URL + path.name,
        "content": content[:50000]
    })

output = ROOT / "knowledge.json"
output.write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Indexed {len(pages)} public HTML pages into knowledge.json")
