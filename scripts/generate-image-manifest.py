#!/usr/bin/env python3
"""Generate the carousel manifest from every supported image in /images."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "images"
OUTPUT = IMAGE_DIR / "images.json"
EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}


def natural_key(path: Path) -> list[object]:
    import re

    return [int(part) if part.isdigit() else part.casefold() for part in re.split(r"(\d+)", path.name)]


images = sorted(
    (path for path in IMAGE_DIR.iterdir() if path.is_file() and path.suffix.casefold() in EXTENSIONS),
    key=natural_key,
)
manifest = {"images": [f"images/{path.name}" for path in images]}
OUTPUT.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {OUTPUT.relative_to(ROOT)} with {len(images)} image(s).")
