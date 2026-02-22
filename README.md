# Cannalchemy

**AI-powered cannabis strain recommendations grounded in molecular pharmacology.**

Take a 5-step quiz about your desired effects, tolerance, and preferences. Get strain recommendations scored by a 5-layer algorithm that traces terpene and cannabinoid molecules through receptor pathways to explain *why* each strain matches you at the molecular level.

## What Makes This Different

Most strain finders rely on crowdsourced labels ("relaxing", "energetic"). Cannalchemy goes deeper:

- **Receptor Pathway Scoring** — Maps how terpenes and cannabinoids interact with CB1, CB2, TRPV1, 5-HT1A, PPARgamma, and GPR55 receptors
- **5-Layer Matching Algorithm** — Receptor pathways (40%), effect reports (25%), avoid penalty (15%), cannabinoid fit (10%), preference fit (10%)
- **Effect Predictions with Probabilities** — Combines community report frequency with pathway alignment for calibrated probability estimates
- **Molecular WHY Explanations** — "Blue Dream's myrcene (0.50%) activates CB1 (Ki=40.7nM), driving the relaxation you prioritized"
- **Full Quiz UI** — Beautiful React 19 interface with journal, favorites, compare, dispensary finder, and learn sections

## Architecture

```
cannalchemy-main/
├── frontend/          React 19 + Vite 7 + TailwindCSS 4
│   ├── src/
│   │   ├── routes/          Quiz flow, results, dashboard, journal, learn
│   │   ├── components/      Strain cards, molecular science, terpene profiles
│   │   ├── services/api.js  Backend API client
│   │   └── context/         React context (quiz, results, user state)
│   └── vite.config.js       Proxy /api/v1 → backend
│
├── backend/app/       FastAPI REST API
│   ├── main.py              App entry, loads DB + knowledge graph
│   ├── routers/quiz.py      POST /api/v1/quiz/recommend
│   ├── services/
│   │   ├── matching_engine.py   5-layer scoring algorithm
│   │   ├── effect_mapper.py     Quiz effects ↔ 51 canonical effects
│   │   └── pathway_explainer.py WHY explanations + effect predictions
│   └── models/quiz.py      Pydantic request/response models
│
├── cannalchemy/       Data science package
│   └── data/                Schema, graph, taxonomy, normalization
│
├── scripts/           Database bootstrap + migration
│   ├── bootstrap_db.py      Seeds molecules, receptors, binding data, effects
│   └── migrate_sf_strains.py Imports strains with fuzzy matching
│
└── data/processed/    SQLite database (single source of truth)
    └── cannalchemy.db
```

## Data Foundation

| Component | Count |
|-----------|-------|
| Strains | 77 (with full compositions, metadata, and effects) |
| Molecules | 28 (21 terpenes + 6 cannabinoids + THC) |
| Receptors | 6 (CB1, CB2, TRPV1, 5-HT1A, PPARgamma, GPR55) |
| Binding affinities | 19 (literature-sourced Ki values in nM) |
| Canonical effects | 51 (with pharmacology descriptions + receptor mappings) |
| Effect reports | 572 (strain-effect links from community data) |
| Knowledge graph | 130 nodes, 1,289 edges |

## Quick Start

```bash
# Clone
git clone https://github.com/nhouseholder/cannalchemy.git
cd cannalchemy

# Backend setup
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[api]"

# Start backend (Terminal 1)
uvicorn backend.app.main:app --reload --port 8000

# Frontend setup (Terminal 2)
cd frontend && npm install && npm run dev
```

Open http://localhost:5173 and take the quiz.

## API

### `POST /api/v1/quiz/recommend`

**Request:**
```json
{
  "effects": ["relaxation", "pain_relief", "sleep"],
  "effectRanking": ["relaxation", "pain_relief", "sleep"],
  "tolerance": "intermediate",
  "avoidEffects": ["anxiety"],
  "consumptionMethod": "flower",
  "budget": "mid",
  "subtype": "indica",
  "thcPreference": "medium",
  "cbdPreference": "some",
  "flavors": ["earthy", "berry"]
}
```

**Response:**
```json
{
  "strains": [
    {
      "name": "Critical Mass",
      "type": "indica",
      "matchPct": 52,
      "thc": 20.0,
      "cbd": 3.0,
      "effectPredictions": [
        {"effect": "relaxed", "probability": 0.63, "confidence": 0.57, "pathway": "CB1, GABA-A"}
      ],
      "pathways": [
        {"molecule": "thc", "receptor": "CB1", "ki_nm": 40.7, "action_type": "partial agonist", "confidence": 0.85}
      ],
      "whyMatch": "Critical Mass's profile: THC (20.00%) targets CB1 (Ki=40.7nM)..."
    }
  ],
  "aiPicks": [...],
  "idealProfile": {...}
}
```

### `GET /api/health`

Returns database status and knowledge graph metrics.

## Scoring Algorithm

The matching engine uses 5 weighted layers:

1. **Receptor Pathway (40%)** — Walks molecule → receptor → effect paths using binding affinity (Ki) × concentration
2. **Effect Reports (25%)** — How often the community reports your desired effects for each strain
3. **Avoid Penalty (15%)** — Penalizes strains with effects you want to avoid
4. **Cannabinoid Fit (10%)** — Matches THC/CBD ranges to your preference
5. **Preference Fit (10%)** — Subtype match, consumption suitability, budget alignment

## Tech Stack

- **Frontend:** React 19, Vite 7, TailwindCSS 4, React Router 7, Recharts, Leaflet
- **Backend:** FastAPI, SQLite, NetworkX, Pydantic
- **Data:** PubChem SMILES, ChEMBL binding data, community effect reports

## License

MIT
