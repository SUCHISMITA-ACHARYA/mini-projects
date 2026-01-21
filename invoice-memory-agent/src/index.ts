import invoices from "./data/invoices_extracted.json";
import humanCorrections from "./data/human_corrections.json";

import { loadMemory } from "./memory/memoryStore";
import { recallMemory } from "./memory/recallMemory";
import { applyMemory } from "./engine/applyMemory";
import { decide } from "./engine/decide";
import { learn } from "./memory/learn";

for (const invoice of invoices as any[]) {
  const auditTrail: any[] = [];
  const memoryUpdates: string[] = [];

  const memory = loadMemory();

  const relevantMemory = recallMemory(memory, invoice);
  auditTrail.push({
    step: "recall",
    timestamp: new Date().toISOString(),
    details: `Loaded ${relevantMemory.length} memory rules for vendor`
  });

  const proposedCorrections = applyMemory(invoice, relevantMemory);
  auditTrail.push({
    step: "apply",
    timestamp: new Date().toISOString(),
    details:
      proposedCorrections.length > 0
        ? `Applied memory rules: ${proposedCorrections.join("; ")}`
        : "No memory rules applied"
  });

  const avgMemoryConfidence =
    relevantMemory.length > 0
      ? relevantMemory.reduce((s, m) => s + m.confidence, 0) /
        relevantMemory.length
      : 0;

  const requiresHumanReview = decide(
    proposedCorrections,
    invoice.confidence,
    avgMemoryConfidence
  );

  auditTrail.push({
    step: "decide",
    timestamp: new Date().toISOString(),
    details: requiresHumanReview
      ? "Decision deferred to human due to insufficient confidence"
      : "Auto-processed using high-confidence memory"
  });

  const human = (humanCorrections as any[]).find(
    h => h.invoiceId === invoice.invoiceId
  );

  if (human) {
    learn(human);
    memoryUpdates.push(
      `Learned ${human.corrections.length} correction(s) from human approval`
    );
    auditTrail.push({
      step: "learn",
      timestamp: new Date().toISOString(),
      details: "Human-approved corrections stored and memory confidence updated"
    });
  }

  let confidenceScore = invoice.confidence;
  if (proposedCorrections.length > 0 && !requiresHumanReview) {
    confidenceScore = Math.min(confidenceScore + 0.1, 1);
  }

  const reasoning = requiresHumanReview
    ? "Memory confidence or invoice confidence was insufficient, so human review is required."
    : "High-confidence vendor-specific memory was applied based on past approved invoices.";

  const output = {
    normalizedInvoice: invoice.fields,
    proposedCorrections,
    requiresHumanReview,
    reasoning,
    confidenceScore,
    memoryUpdates,
    auditTrail
  };

  console.log(JSON.stringify(output, null, 2));
}
