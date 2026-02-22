"""Bootstrap the Cannalchemy database with seed data.

Creates the schema, seeds receptors + binding data, molecules, and canonical
effects. This gives us a working database even without the full Strain Tracker
import — enough for the backend to start and serve quiz recommendations.

After this, run migrate_sf_strains.py to import SF's 90 strains.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from cannalchemy.data.schema import init_db
from cannalchemy.data.pubchem import KNOWN_COMPOUNDS
from cannalchemy.data.chembl import seed_receptors_and_bindings, KNOWN_BINDING_DATA
from cannalchemy.data.taxonomy import seed_canonical_effects


def bootstrap(db_path: str | None = None):
    if db_path is None:
        db_path = str(ROOT / "data" / "processed" / "cannalchemy.db")

    print(f"Bootstrapping database at {db_path}")
    conn = init_db(db_path)

    # 1. Seed molecules from KNOWN_COMPOUNDS
    print("Seeding molecules...")
    mol_count = 0
    for name, data in KNOWN_COMPOUNDS.items():
        mol_type = "cannabinoid" if name in ("thc", "cbd", "cbn", "cbg", "cbc", "thcv") else "terpene"
        conn.execute(
            "INSERT OR IGNORE INTO molecules (name, smiles, molecular_weight, pubchem_cid, molecule_type) "
            "VALUES (?, ?, ?, ?, ?)",
            (name, data.get("smiles", ""), data.get("mw"), data.get("cid"), mol_type),
        )
        mol_count += 1
    conn.commit()
    print(f"  {mol_count} molecules seeded")

    # 2. Seed receptors and binding data
    print("Seeding receptors and binding affinities...")
    stats = seed_receptors_and_bindings(conn)
    print(f"  {stats['receptors_created']} receptors, {stats['bindings_created']} bindings")

    # 3. Seed canonical effects
    print("Seeding canonical effects...")
    inserted = seed_canonical_effects(conn)
    print(f"  {inserted} canonical effects inserted")

    conn.close()
    print(f"\nBootstrap complete. Database ready at {db_path}")


if __name__ == "__main__":
    db_path = sys.argv[1] if len(sys.argv) > 1 else None
    bootstrap(db_path)
