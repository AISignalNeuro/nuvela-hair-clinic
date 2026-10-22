// Normalizes a phone number to a compact "+<digits>" form so lookups are consistent.
// Local Turkish numbers ("0532…" or "532…") are converted to +90.
export function normalizePhone(input) {
  if (!input) return null;
  let digits = String(input).replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (!digits.startsWith("+")) {
    if (digits.startsWith("0") && digits.length === 11) digits = `+90${digits.slice(1)}`;
    else if (digits.length === 10 && digits.startsWith("5")) digits = `+90${digits}`;
    else digits = `+${digits}`;
  }
  const count = digits.replace(/\D/g, "").length;
  return count >= 8 && count <= 15 ? digits : null;
}
