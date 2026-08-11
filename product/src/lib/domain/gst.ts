import type { CalculatedInvoiceLine, InvoiceLineInput, InvoiceTotals } from "./types";
import { parseDecimalToScale, roundDiv } from "./money";

export function calculateLine(input: InvoiceLineInput, interState: boolean): CalculatedInvoiceLine {
  if (input.unitPricePaise < 0 || !Number.isSafeInteger(input.unitPricePaise)) {
    throw new Error("Unit price must be a non-negative integer in paise");
  }
  if (input.taxRateBps < 0 || input.taxRateBps > 10000) throw new Error("GST rate is outside the supported range");
  const quantityMilli = parseDecimalToScale(input.quantity, 3);
  if (quantityMilli <= 0) throw new Error("Quantity must be greater than zero");
  const grossPaise = roundDiv(quantityMilli * input.unitPricePaise, 1000);
  const taxablePaise = input.priceIncludesTax
    ? roundDiv(grossPaise * 10000, 10000 + input.taxRateBps)
    : grossPaise;
  const taxPaise = input.priceIncludesTax
    ? grossPaise - taxablePaise
    : roundDiv(taxablePaise * input.taxRateBps, 10000);
  const totalPaise = taxablePaise + taxPaise;
  const igstPaise = interState ? taxPaise : 0;
  const cgstPaise = interState ? 0 : Math.floor(taxPaise / 2);
  const sgstPaise = interState ? 0 : taxPaise - cgstPaise;
  return { ...input, quantityMilli, grossPaise, taxablePaise, taxPaise, cgstPaise, sgstPaise, igstPaise, totalPaise };
}

export function calculateInvoice(lines: InvoiceLineInput[], interState: boolean) {
  if (lines.length === 0) throw new Error("At least one invoice line is required");
  const calculatedLines = lines.map((line) => calculateLine(line, interState));
  const totals = calculatedLines.reduce<InvoiceTotals>((result, line) => ({
    taxablePaise: result.taxablePaise + line.taxablePaise,
    cgstPaise: result.cgstPaise + line.cgstPaise,
    sgstPaise: result.sgstPaise + line.sgstPaise,
    igstPaise: result.igstPaise + line.igstPaise,
    taxPaise: result.taxPaise + line.taxPaise,
    totalPaise: result.totalPaise + line.totalPaise,
  }), { taxablePaise: 0, cgstPaise: 0, sgstPaise: 0, igstPaise: 0, taxPaise: 0, totalPaise: 0 });
  return { lines: calculatedLines, totals };
}
