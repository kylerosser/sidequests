# A script that takes the LINZ Places CSV file and creates a JSON file mapping
# place names (city/town/suburb) to a latitude, longitude and approximate radius
import csv
import json
import re
import unicodedata

INPUT_FILE = "nz-place-names-nzgb.csv"
OUTPUT_FILE = "places_data.json"

VALID_TYPES = {"Suburb", "Town", "City"}

RADIUS_MAP = {
    "Suburb": 6,
    "Town": 12,
    "City": 25
}


def normalize_place_name(name: str) -> str:
    """
    Normalize place names for search aliases:
    - lowercase
    - remove macrons/diacritics
    - remove all symbols
    - collapse whitespace
    """

    # lowercase
    name = name.lower()

    # normalize unicode (split accent marks from letters)
    name = unicodedata.normalize("NFKD", name)

    # remove accent marks (macrons etc)
    name = "".join(c for c in name if not unicodedata.combining(c))

    # remove all non alphanumeric characters except spaces
    name = re.sub(r"[^a-z0-9\s]", "", name)

    # collapse multiple spaces
    name = re.sub(r"\s+", " ", name).strip()

    return name


def generate_aliases(name: str):
    """
    Generate useful alias variants.
    Example:
        Mount Eden → ["mount eden", "mt eden"]
    """

    normalized = normalize_place_name(name)
    aliases = {normalized}

    if normalized.startswith("mount "):
        aliases.add(normalized.replace("mount ", "mt ", 1))

    if normalized.startswith("mt "):
        aliases.add(normalized.replace("mt ", "mount ", 1))

    return aliases


places = {}

with open(INPUT_FILE, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        feat_type = row["feat_type"]

        if feat_type not in VALID_TYPES:
            continue

        name = row["name"]

        try:
            lat = float(row["crd_latitude"])
            lng = float(row["crd_longitude"])
        except (ValueError, TypeError):
            continue

        radius = RADIUS_MAP[feat_type]

        for alias in generate_aliases(name):
            if alias not in places:
                places[alias] = {
                    "name": name,
                    "lat": lat,
                    "lng": lng,
                    "radiusKm": radius
                }

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(places, f, indent=2)

print(f"Generated {len(places)} place aliases → {OUTPUT_FILE}")