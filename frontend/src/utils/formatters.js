export function formatPercentage(value, decimals = 1) {
  if (value == null) return 'N/A';
  return `${Number(value).toFixed(decimals)}%`;
}

export function formatDistance(miles) {
  if (miles == null) return '';
  return miles < 0.1 ? 'Nearby' : `${miles.toFixed(1)} mi`;
}

export function formatCurrency(amount) {
  if (amount == null) return '';
  return `$${Number(amount).toFixed(0)}`;
}

export function formatReviewCount(count) {
  if (count == null) return '';
  if (typeof count === 'string') return count;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}
