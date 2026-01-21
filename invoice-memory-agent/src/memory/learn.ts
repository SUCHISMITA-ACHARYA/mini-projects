import { loadMemory, saveMemory } from "./memoryStore";

export function learn(humanCorrection: any) {
  const memory = loadMemory();

  for (const c of humanCorrection.corrections) {
    let rule = "";

    if (
      c.field === "serviceDate" &&
      c.reason.toLowerCase().includes("leistungsdatum")
    ) {
      rule = "Leistungsdatum=serviceDate";
    }

    if (
      c.field === "taxTotal" &&
      c.reason.toLowerCase().includes("vat")
    ) {
      rule = "VAT_INCLUDED_RECALCULATE";
    }

    if (!rule) continue;

    const existing = memory.find(
      (m: any) =>
        m.vendor === humanCorrection.vendor && m.rule === rule
    );

    if (existing) {
      existing.confidence = Math.min(existing.confidence + 0.1, 1);
      existing.usageCount += 1;
      existing.lastUsed = new Date().toISOString();
    } else {
      memory.push({
        id: Date.now().toString(),
        vendor: humanCorrection.vendor,
        type: "CORRECTION",
        rule,
        confidence: 0.7,
        usageCount: 1,
        lastUsed: new Date().toISOString()
      });
    }
  }

  saveMemory(memory);
}
