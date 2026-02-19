/**
 * Collapse consecutive hyphens in a slug to a single hyphen.
 * github-slugger produces double hyphens when special characters
 * like &, →, :, / are adjacent to spaces (e.g. "Billing & Finance"
 * becomes "billing--finance"). This normalizes to "billing-finance".
 */
export function normalizeSlug(slug: string): string {
  return slug.replace(/-{2,}/g, '-');
}
