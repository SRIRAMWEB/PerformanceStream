/**
 * Formats a number as Indian Rupee currency (e.g. ₹22,500).
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats numbers in Indian numbering system with tabular formatting.
 */
export function formatNumberIN(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}
