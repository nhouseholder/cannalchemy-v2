import { INVALID_STRAIN_NAMES } from './constants';

export function isValidStrainName(name) {
  if (!name || typeof name !== 'string') return false;
  const lower = name.trim().toLowerCase();
  if (lower.length < 2) return false;
  if (INVALID_STRAIN_NAMES.includes(lower)) return false;
  if (/^strain\s*\d+$/i.test(name)) return false;
  return true;
}

export function validateStrainResponse(strain) {
  if (!strain || typeof strain !== 'object') return false;
  if (!isValidStrainName(strain.name)) return false;
  if (!['indica', 'sativa', 'hybrid'].includes(strain.type?.toLowerCase())) return false;
  if (typeof strain.matchPct !== 'number' || strain.matchPct < 0 || strain.matchPct > 100) return false;
  return true;
}

export function validateQuizState(state) {
  return state && Array.isArray(state.effects) && state.effects.length > 0;
}
