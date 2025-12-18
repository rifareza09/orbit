/**
 * Format number to Indonesian Rupiah currency
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return 'Rp 0';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

/**
 * Format number with thousand separators (Indonesian format)
 */
export const formatNumber = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0';

  return new Intl.NumberFormat('id-ID').format(numValue);
};

/**
 * Parse formatted currency string to number
 */
export const parseCurrency = (value: string): number => {
  // Remove all non-digit characters except dots and commas
  const cleanValue = value.replace(/[^\d.,]/g, '');
  // Replace Indonesian decimal separator if exists
  const normalizedValue = cleanValue.replace(',', '.');
  return parseFloat(normalizedValue) || 0;
};

/**
 * Format input value for currency display while typing
 */
export const formatCurrencyInput = (value: string): string => {
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, '');

  if (!numericValue) return '';

  // Format with thousand separators
  const formatted = new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
  return formatted;
};

/**
 * Convert Indonesian formatted number back to plain number for submission
 * Format: 1.000.000 => 1000000
 */
export const convertFormattedToNumber = (formatted: string): number => {
  // Remove all non-digit characters (removes dots, spaces, etc)
  const numericOnly = formatted.replace(/\D/g, '');
  return parseInt(numericOnly) || 0;
};
