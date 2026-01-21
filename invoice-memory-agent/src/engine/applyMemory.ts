export function applyMemory(invoice: any, memories: any[]) {
  const proposedCorrections: string[] = [];
  const appliedRules = new Set<string>(); 

  for (const m of memories) {
    
    if (
      m.rule === "Leistungsdatum=serviceDate" &&
      !appliedRules.has(m.rule) &&
      !invoice.fields.serviceDate &&
      invoice.rawText.includes("Leistungsdatum")
    ) {
      invoice.fields.serviceDate = "AUTO_FROM_RAWTEXT";
      proposedCorrections.push(
        "Filled serviceDate using Supplier GmbH memory (Leistungsdatum)"
      );
      appliedRules.add(m.rule);
    }

  
    if (
      m.rule === "VAT_INCLUDED_RECALCULATE" &&
      !appliedRules.has(m.rule) &&
      invoice.rawText.toLowerCase().includes("vat")
    ) {
      proposedCorrections.push(
        "Detected VAT included in prices; recommend tax/gross recalculation"
      );
      appliedRules.add(m.rule);
    }
  }

  return proposedCorrections;
}
