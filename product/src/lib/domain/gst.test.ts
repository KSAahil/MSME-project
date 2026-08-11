import { describe, expect, it } from "vitest";
import { calculateInvoice, calculateLine } from "./gst";
import { parseDecimalToScale, rupeesToPaise } from "./money";

const baseLine = {
  description: "Boxes",
  quantity: "25",
  unit: "Boxes",
  unitPricePaise: 85_000,
  taxRateBps: 1_800,
  priceIncludesTax: false,
  hsnSac: "",
};

describe("GST calculation", () => {
  it("calculates the reference intra-state invoice exactly", () => {
    const result = calculateInvoice([baseLine], false);
    expect(result.totals).toEqual({
      taxablePaise: 2_125_000,
      cgstPaise: 191_250,
      sgstPaise: 191_250,
      igstPaise: 0,
      taxPaise: 382_500,
      totalPaise: 2_507_500,
    });
  });

  it("allocates all tax to IGST for an inter-state invoice", () => {
    const result = calculateInvoice([baseLine], true);
    expect(result.totals.igstPaise).toBe(382_500);
    expect(result.totals.cgstPaise).toBe(0);
    expect(result.totals.sgstPaise).toBe(0);
  });

  it("backs tax out of a GST-inclusive price", () => {
    const line = calculateLine({ ...baseLine, quantity: "1", unitPricePaise: 118_000, priceIncludesTax: true }, false);
    expect(line.taxablePaise).toBe(100_000);
    expect(line.taxPaise).toBe(18_000);
    expect(line.totalPaise).toBe(118_000);
  });

  it("supports quantities with up to three decimal places", () => {
    const line = calculateLine({ ...baseLine, quantity: "1.250", unitPricePaise: 10_000 }, false);
    expect(line.taxablePaise).toBe(12_500);
  });
});

describe("money parsing", () => {
  it("parses Indian-formatted rupees into paise", () => {
    expect(rupeesToPaise("₹1,25,000.50")).toBe(12_500_050);
  });

  it("parses scaled decimal quantities without floating arithmetic", () => {
    expect(parseDecimalToScale("12.345", 3)).toBe(12_345);
  });

  it("rejects excess precision", () => {
    expect(() => parseDecimalToScale("1.2345", 3)).toThrow();
  });
});
