export function roundDiv(numerator: number, denominator: number): number {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) {
    throw new Error("Money calculation exceeded safe integer limits");
  }
  if (denominator <= 0) throw new Error("Denominator must be positive");
  return Math.floor((numerator + Math.floor(denominator / 2)) / denominator);
}

export function parseDecimalToScale(value: string, decimals = 3): number {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) throw new Error(`Invalid decimal value: ${value}`);
  const [whole, fraction = ""] = normalized.split(".");
  if (fraction.length > decimals) throw new Error(`Maximum ${decimals} decimal places are supported`);
  return Number(whole) * 10 ** decimals + Number(fraction.padEnd(decimals, "0"));
}

export function rupeesToPaise(value: string | number): number {
  const normalized = String(value).replace(/[₹,\s]/g, "").trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) throw new Error(`Invalid rupee amount: ${value}`);
  const [rupees, paise = ""] = normalized.split(".");
  const result = Number(rupees) * 100 + Number(paise.padEnd(2, "0"));
  if (!Number.isSafeInteger(result)) throw new Error("Amount is too large");
  return result;
}

export function paiseToRupees(paise: number): string {
  const sign = paise < 0 ? "-" : "";
  const absolute = Math.abs(paise);
  return `${sign}${Math.floor(absolute / 100)}.${String(absolute % 100).padStart(2, "0")}`;
}

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);
}
