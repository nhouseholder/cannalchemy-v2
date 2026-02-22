"""Migrate Strain Finder's 90 strain metadata into Cannalchemy's database.

Reads frontend/src/data/strains.json and fuzzy-matches each strain to the
Cannalchemy database, then inserts supplementary metadata (consumption
suitability, price range, best_for, lineage, flavors, genetics).
"""
import json
import sqlite3
import sys
from pathlib import Path

# Add project root to path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from cannalchemy.data.normalize import normalize_strain_name, match_strain_names
from cannalchemy.data.schema import init_db


def migrate(db_path: str | None = None):
    """Run the migration."""
    if db_path is None:
        db_path = str(ROOT / "data" / "processed" / "cannalchemy.db")

    sf_path = ROOT / "frontend" / "src" / "data" / "strains.json"
    if not sf_path.exists():
        print(f"ERROR: Strain Finder data not found at {sf_path}")
        return

    # Load SF strains
    with open(sf_path) as f:
        sf_strains = json.load(f)

    print(f"Loaded {len(sf_strains)} Strain Finder strains")

    # Open database
    conn = init_db(db_path)

    # Get all existing strain names
    existing = conn.execute(
        "SELECT id, normalized_name, name FROM strains"
    ).fetchall()
    name_to_id = {row[1]: row[0] for row in existing}
    known_names = list(name_to_id.keys())
    print(f"Database has {len(known_names)} existing strains")

    stats = {"matched": 0, "created": 0, "metadata": 0, "flavors": 0}

    for sf in sf_strains:
        sf_name = sf["name"]
        normalized = normalize_strain_name(sf_name)

        # Try exact match first
        strain_id = name_to_id.get(normalized)

        # Fuzzy match if no exact match
        if strain_id is None and known_names:
            matches = match_strain_names(normalized, known_names, limit=1, score_cutoff=85.0)
            if matches:
                matched_name, score = matches[0]
                strain_id = name_to_id.get(matched_name)
                if strain_id:
                    stats["matched"] += 1

        # Create new strain if no match
        if strain_id is None:
            cursor = conn.execute(
                "INSERT OR IGNORE INTO strains (name, normalized_name, strain_type, description, source) "
                "VALUES (?, ?, ?, ?, ?)",
                (sf_name, normalized, sf.get("type", "unknown"),
                 sf.get("description", ""), "strain-finder"),
            )
            if cursor.lastrowid:
                strain_id = cursor.lastrowid
                name_to_id[normalized] = strain_id
                known_names.append(normalized)
                stats["created"] += 1
            else:
                # Race condition or duplicate, fetch existing
                row = conn.execute(
                    "SELECT id FROM strains WHERE normalized_name = ?",
                    (normalized,),
                ).fetchone()
                strain_id = row[0] if row else None

        if strain_id is None:
            print(f"  SKIP: Could not resolve strain '{sf_name}'")
            continue

        # Insert metadata
        consumption = json.dumps(sf.get("consumptionSuitability", {}))
        lineage_data = sf.get("lineage", {"self": sf_name})
        best_for = json.dumps(sf.get("bestFor", []))
        not_ideal = json.dumps(sf.get("notIdealFor", []))

        conn.execute(
            "INSERT OR REPLACE INTO strain_metadata "
            "(strain_id, consumption_suitability, price_range, best_for, "
            "not_ideal_for, genetics, lineage, description_extended) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                strain_id,
                consumption,
                sf.get("priceRange", "mid"),
                best_for,
                not_ideal,
                sf.get("genetics", ""),
                json.dumps(lineage_data),
                sf.get("description", ""),
            ),
        )
        stats["metadata"] += 1

        # Insert flavors
        for flavor in sf.get("flavors", []):
            conn.execute(
                "INSERT OR IGNORE INTO strain_flavors (strain_id, flavor) VALUES (?, ?)",
                (strain_id, flavor),
            )
            stats["flavors"] += 1

        # Insert terpene compositions
        for terp in sf.get("terpenes", []):
            terp_name = terp["name"].lower()
            mol_row = conn.execute(
                "SELECT id FROM molecules WHERE name = ?", (terp_name,)
            ).fetchone()
            if mol_row:
                pct = float(str(terp.get("pct", 0)).replace("%", ""))
                conn.execute(
                    "INSERT OR IGNORE INTO strain_compositions "
                    "(strain_id, molecule_id, percentage, measurement_type, source) "
                    "VALUES (?, ?, ?, 'reported', 'strain-finder')",
                    (strain_id, mol_row[0], pct),
                )
                stats["compositions"] = stats.get("compositions", 0) + 1

        # Insert cannabinoid compositions (THC, CBD, CBN, CBG, THCV, CBC)
        cannabinoid_fields = {
            "thc": sf.get("thc", {}).get("avg") if isinstance(sf.get("thc"), dict) else sf.get("thc"),
            "cbd": sf.get("cbd", {}).get("avg") if isinstance(sf.get("cbd"), dict) else sf.get("cbd"),
            "cbn": sf.get("cbn"),
            "cbg": sf.get("cbg"),
            "thcv": sf.get("thcv"),
            "cbc": sf.get("cbc"),
        }
        for cname, cval in cannabinoid_fields.items():
            if cval is not None and float(cval) > 0:
                mol_row = conn.execute(
                    "SELECT id FROM molecules WHERE name = ?", (cname,)
                ).fetchone()
                if mol_row:
                    conn.execute(
                        "INSERT OR IGNORE INTO strain_compositions "
                        "(strain_id, molecule_id, percentage, measurement_type, source) "
                        "VALUES (?, ?, ?, 'reported', 'strain-finder')",
                        (strain_id, mol_row[0], float(cval)),
                    )
                    stats["compositions"] = stats.get("compositions", 0) + 1

        # Insert effect reports
        for effect_name in sf.get("effects", []):
            effect_lower = effect_name.lower()
            eff_row = conn.execute(
                "SELECT id FROM effects WHERE name = ?", (effect_lower,)
            ).fetchone()
            if not eff_row:
                cursor = conn.execute(
                    "INSERT OR IGNORE INTO effects (name, category) VALUES (?, 'positive')",
                    (effect_lower,),
                )
                eff_id = cursor.lastrowid or conn.execute(
                    "SELECT id FROM effects WHERE name = ?", (effect_lower,)
                ).fetchone()[0]
            else:
                eff_id = eff_row[0]
            conn.execute(
                "INSERT OR IGNORE INTO effect_reports (strain_id, effect_id, report_count, source) "
                "VALUES (?, ?, 1, 'strain-finder')",
                (strain_id, eff_id),
            )
            stats["effect_reports"] = stats.get("effect_reports", 0) + 1

        for neg_name in sf.get("negatives", []):
            neg_lower = neg_name.lower().replace(" ", "-")
            eff_row = conn.execute(
                "SELECT id FROM effects WHERE name = ?", (neg_lower,)
            ).fetchone()
            if not eff_row:
                cursor = conn.execute(
                    "INSERT OR IGNORE INTO effects (name, category) VALUES (?, 'negative')",
                    (neg_lower,),
                )
                eff_id = cursor.lastrowid or conn.execute(
                    "SELECT id FROM effects WHERE name = ?", (neg_lower,)
                ).fetchone()[0]
            else:
                eff_id = eff_row[0]
            conn.execute(
                "INSERT OR IGNORE INTO effect_reports (strain_id, effect_id, report_count, source) "
                "VALUES (?, ?, 1, 'strain-finder')",
                (strain_id, eff_id),
            )
            stats["effect_reports"] = stats.get("effect_reports", 0) + 1

    conn.commit()
    conn.close()

    print(f"\nMigration complete:")
    print(f"  Matched to existing:    {stats['matched']}")
    print(f"  Created new:            {stats['created']}")
    print(f"  Metadata records:       {stats['metadata']}")
    print(f"  Flavor records:         {stats['flavors']}")
    print(f"  Compositions:           {stats.get('compositions', 0)}")
    print(f"  Effect reports:         {stats.get('effect_reports', 0)}")


if __name__ == "__main__":
    db_path = sys.argv[1] if len(sys.argv) > 1 else None
    migrate(db_path)
