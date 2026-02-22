"""Generate WHY explanations from knowledge graph pathway data."""
from cannalchemy.data.graph import get_strain_profile, get_molecule_pathways


def explain_strain_match(
    graph,
    strain_name: str,
    desired_effects: list[str],
    effect_receptor_map: dict[str, str],
) -> str:
    """Build a natural language explanation of why a strain matches.

    Uses receptor binding data to explain the molecular mechanism.
    Template-based (no LLM call) for speed.
    """
    profile = get_strain_profile(graph, strain_name)
    if not profile or not profile.get("compositions"):
        return f"{strain_name} matches your desired effects based on community reports."

    # Get top 3 molecules by percentage
    top_molecules = profile["compositions"][:3]

    sentences = []
    for mol in top_molecules:
        mol_name = mol["molecule"]
        pct = mol["percentage"]
        mol_type = mol.get("type", "terpene")
        pathways = get_molecule_pathways(graph, mol_name)

        if not pathways:
            continue

        # Find the most relevant pathway for the user's desired effects
        best_pathway = _find_best_pathway(pathways, desired_effects, effect_receptor_map)
        if not best_pathway:
            best_pathway = pathways[0]

        receptor = best_pathway["receptor"]
        ki = best_pathway.get("ki_nm")
        action = best_pathway.get("action_type", "modulator")
        receptor_fn = best_pathway.get("receptor_function", "")

        # Build sentence
        if ki:
            binding_str = f" (Ki={ki}nM, {action})" if ki < 1000 else f" ({action})"
        else:
            binding_str = f" ({action})" if action else ""

        # Match to a desired effect
        matched_effect = _pathway_matches_effect(receptor, desired_effects, effect_receptor_map)
        effect_clause = f", contributing to {matched_effect}" if matched_effect else ""

        display_name = mol_name.capitalize()
        sentences.append(
            f"{display_name} ({pct:.2f}%) targets {receptor}{binding_str}{effect_clause}."
        )

    if not sentences:
        return f"{strain_name} matches your desired effects based on community reports."

    return f"{strain_name}'s profile: " + " ".join(sentences)


def get_strain_pathways(graph, strain_name: str) -> list[dict]:
    """Get structured pathway data for a strain's molecules.

    Returns list of:
    {molecule, receptor, ki_nm, action_type, effect_contribution, confidence}
    """
    profile = get_strain_profile(graph, strain_name)
    if not profile:
        return []

    pathways = []
    seen = set()

    for comp in profile.get("compositions", []):
        mol_name = comp["molecule"]
        mol_pathways = get_molecule_pathways(graph, mol_name)

        for p in mol_pathways:
            key = (mol_name, p["receptor"])
            if key in seen:
                continue
            seen.add(key)

            pathways.append({
                "molecule": mol_name,
                "receptor": p["receptor"],
                "ki_nm": p.get("ki_nm"),
                "action_type": p.get("action_type", ""),
                "effect_contribution": p.get("receptor_function", ""),
                "confidence": p.get("affinity_score", 0.5),
            })

    return pathways


def build_effect_predictions(
    graph,
    conn,
    strain_name: str,
    desired_canonicals: list[str],
    effect_receptor_map: dict[str, str],
) -> list[dict]:
    """Build effect predictions with probability and pathway info.

    Uses a combination of:
    - Effect report frequency (crowdsourced)
    - Receptor pathway alignment (pharmacology)
    """
    profile = get_strain_profile(graph, strain_name)
    if not profile:
        return []

    # Get effect report counts for this strain
    effect_counts = {}
    total_reports = 0
    for e in profile.get("effects", []):
        effect_counts[e["effect"]] = e["report_count"]
        total_reports += e["report_count"]

    # Get strain's molecule -> receptor bindings
    strain_receptors = set()
    for comp in profile.get("compositions", []):
        for p in get_molecule_pathways(graph, comp["molecule"]):
            strain_receptors.add(p["receptor"])

    predictions = []
    for canonical in desired_canonicals:
        # Factor 1: Report frequency (0-1)
        report_count = effect_counts.get(canonical, 0)
        report_prob = min(report_count / max(total_reports, 1) * 5, 1.0) if report_count > 0 else 0.0

        # Factor 2: Pathway alignment (0-1)
        pathway_str = effect_receptor_map.get(canonical, "")
        effect_receptors = {r.strip() for r in pathway_str.split(",") if r.strip()}
        if effect_receptors:
            overlap = len(strain_receptors & effect_receptors)
            pathway_prob = min(overlap / len(effect_receptors), 1.0)
        else:
            pathway_prob = 0.3

        # Combined probability
        probability = round(report_prob * 0.6 + pathway_prob * 0.4, 2)
        confidence = round(min(probability * 0.9, 0.95), 2)

        predictions.append({
            "effect": canonical,
            "probability": probability,
            "confidence": confidence,
            "pathway": pathway_str or "multiple pathways",
        })

    # Sort by probability descending
    predictions.sort(key=lambda x: x["probability"], reverse=True)
    return predictions


def _find_best_pathway(
    pathways: list[dict],
    desired_effects: list[str],
    effect_receptor_map: dict[str, str],
) -> dict | None:
    """Find the pathway most relevant to desired effects."""
    desired_receptors = set()
    for effect in desired_effects:
        pathway_str = effect_receptor_map.get(effect, "")
        for r in pathway_str.split(", "):
            if r.strip():
                desired_receptors.add(r.strip())

    for p in pathways:
        if p["receptor"] in desired_receptors:
            return p
    return None


def _pathway_matches_effect(
    receptor: str,
    desired_effects: list[str],
    effect_receptor_map: dict[str, str],
) -> str | None:
    """Find which desired effect a receptor contributes to."""
    for effect in desired_effects:
        pathway_str = effect_receptor_map.get(effect, "")
        if receptor in pathway_str:
            return effect.replace("-", " ")
    return None
