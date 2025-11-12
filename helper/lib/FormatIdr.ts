const DEFAULT_DECIMAL_PLACES = 2;

/**
 * Format amount to IDR currency with configurable decimal places
 * @param amount - The amount to format
 * @param decimalPlaces - Decimal places (default: 2)
 */
export const formatIDR = (
  amount: number,
  decimalPlaces: number = DEFAULT_DECIMAL_PLACES
): string => {
  const safe = Number.isFinite(amount) ? amount : 0;

  const formatted =
    decimalPlaces > 0
      ? safe.toFixed(decimalPlaces).replace(".", ",")
      : Math.round(safe).toString();

  // Format dengan separator ribuan
  const parts = formatted.split(",");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `Rp ${parts.join(",")}`;
};

export default formatIDR;
