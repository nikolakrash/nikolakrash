#!/usr/bin/env python3
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, ElementTree


SITE_URL = "https://teleboosting.com"
ROOT = Path(__file__).resolve().parent.parent
SITEMAP_PATH = ROOT / "sitemap.xml"
ROBOTS_PATH = ROOT / "robots.txt"

# Транзакционные страницы (noindex) и служебные файлы верификации —
# не должны попадать в sitemap, даже если лежат в корне как *.html.
EXCLUDE_FROM_SITEMAP = {
    "payment.html",
    "payment-success.html",
    "wsf2rcsoogn4walk.html",
}


def page_url(path: Path) -> str:
    if path.name == "index.html":
        return f"{SITE_URL}/"
    return f"{SITE_URL}/{path.stem}"


def lastmod(path: Path) -> str:
    dt = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
    return dt.date().isoformat()


def build_sitemap() -> None:
    html_pages = sorted(
        p for p in ROOT.glob("*.html") if p.name not in EXCLUDE_FROM_SITEMAP
    )
    urlset = Element(
        "urlset",
        {
            "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        },
    )

    priorities = {
        "index.html": "1.0",
        "guide.html": "0.9",
        "updates.html": "0.8",
        "articles.html": "0.8",
    }

    for html in html_pages:
        url = SubElement(urlset, "url")
        SubElement(url, "loc").text = page_url(html)
        SubElement(url, "lastmod").text = lastmod(html)
        SubElement(url, "changefreq").text = "weekly"
        SubElement(url, "priority").text = priorities.get(html.name, "0.7")

    ElementTree(urlset).write(SITEMAP_PATH, encoding="utf-8", xml_declaration=True)


def build_robots() -> None:
    ROBOTS_PATH.write_text(
        "\n".join(
            [
                "User-agent: *",
                "Allow: /",
                "",
                f"Sitemap: {SITE_URL}/sitemap.xml",
                "",
            ]
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    build_sitemap()
    build_robots()
