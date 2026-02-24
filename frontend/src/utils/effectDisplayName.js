/**
 * Maps canonical effect names (from the quiz engine) to user-friendly display names.
 * Conditions like "stress", "pain", "anxiety" should read as relief/alleviation,
 * while positive effects like "relaxed", "euphoric" just get capitalized.
 */
const CANONICAL_TO_DISPLAY = {
  pain: 'Pain Relief',
  stress: 'Stress Relief',
  anxiety: 'Anxiety Relief',
  inflammation: 'Anti-Inflammatory',
  insomnia: 'Sleep Aid',
  'appetite-loss': 'Appetite Stimulant',
  arthritis: 'Arthritis Relief',
  fibromyalgia: 'Fibromyalgia Relief',
  depression: 'Mood Lift',
  nausea: 'Anti-Nausea',
  fatigue: 'Energy Boost',
  'muscle-spasms': 'Muscle Relaxation',
  headache: 'Headache Relief',
  migraines: 'Migraine Relief',
  seizures: 'Seizure Relief',
  ptsd: 'PTSD Relief',
  cramps: 'Cramp Relief',
}

/**
 * Convert a canonical effect name to a friendly display name.
 * First checks the explicit map, then falls back to title-casing.
 */
export function getEffectDisplayName(canonicalName) {
  if (!canonicalName) return ''
  const lower = canonicalName.toLowerCase().trim()
  if (CANONICAL_TO_DISPLAY[lower]) return CANONICAL_TO_DISPLAY[lower]
  // Fallback: replace hyphens with spaces and title-case
  return canonicalName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
