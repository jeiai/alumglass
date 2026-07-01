import json
import re
import sys
import zipfile
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_WIDTH = 1200
WEBP_QUALITY = 76


def slugify(value):
    value = value.lower().strip()
    replacements = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "ñ": "n",
        "ü": "u",
    }
    for source, target in replacements.items():
        value = value.replace(source, target)
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def titleize(value):
    labels = {
        "barandales": "Barandales",
        "canceles de vidrio": "Canceles de vidrio",
        "canceles plasticos": "Canceles plásticos",
        "domos": "Domos",
        "espejos": "Espejos",
        "mamparas": "Mamparas",
        "puerta ligeras": "puertas ligeras",
        "puertas europeas 1400": "Puertas europeas 1400",
        "ventana nacional 3 pulgadas": "Ventana nacional 3 pulgadas",
        "ventanas europeas 1400": "Ventanas europeas 1400",
        "vitrales": "Vitrales",
    }
    if value in labels:
        return labels[value]
    return " ".join(word.capitalize() for word in value.split())


def convert_image(raw, output_path):
    if output_path.exists():
        with Image.open(output_path) as existing:
            return existing.width, existing.height

    with Image.open(BytesIO(raw)) as image:
        image = ImageOps.exif_transpose(image)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        if image.mode == "RGBA":
            background = Image.new("RGB", image.size, "white")
            background.paste(image, mask=image.getchannel("A"))
            image = background
        if image.width > MAX_WIDTH:
            ratio = MAX_WIDTH / image.width
            image = image.resize((MAX_WIDTH, round(image.height * ratio)), Image.Resampling.LANCZOS)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(output_path, "WEBP", quality=WEBP_QUALITY, method=4)
        return image.width, image.height


def build(zip_path, project_root):
    output_root = project_root / "assets" / "images" / "gallery"
    data = []

    with zipfile.ZipFile(zip_path) as archive:
        entries = [
            entry
            for entry in archive.infolist()
            if not entry.is_dir() and Path(entry.filename).suffix.lower() in IMAGE_EXTENSIONS
        ]

        grouped = {}
        for entry in entries:
            parts = entry.filename.split("/")
            if len(parts) < 2:
                continue
            grouped.setdefault(parts[0], []).append(entry)

        for category_name in sorted(grouped):
            category_slug = slugify(category_name)
            images = []
            for index, entry in enumerate(sorted(grouped[category_name], key=lambda item: item.filename), start=1):
                output_name = f"{category_slug}-{index:02d}.webp"
                output_path = output_root / category_slug / output_name
                width, height = convert_image(archive.read(entry), output_path)
                images.append(
                    {
                        "src": f"assets/images/gallery/{category_slug}/{output_name}",
                        "alt": f"Trabajo de {titleize(category_name)} realizado por Alumglass",
                        "width": width,
                        "height": height,
                    }
                )
            data.append(
                {
                    "id": category_slug,
                    "name": titleize(category_name),
                    "count": len(images),
                    "images": images,
                }
            )

    js_path = project_root / "assets" / "js" / "gallery-data.js"
    js_path.write_text(
        "window.ALUMGLASS_GALLERY = "
        + json.dumps(data, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    return data


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: build_gallery.py <zip-path> <project-root>", file=sys.stderr)
        raise SystemExit(2)

    result = build(Path(sys.argv[1]), Path(sys.argv[2]))
    print(f"Generated {sum(category['count'] for category in result)} images in {len(result)} categories.")
