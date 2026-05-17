/**
 * Format paisa (smallest INR unit) to display string like ₹1,299
 * Prices are stored in paisa (100 paisa = ₹1)
 */
export function formatINR(paisa: number | bigint): string {
  const rupees = Number(paisa) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatINRFromRupees(rupees: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}
