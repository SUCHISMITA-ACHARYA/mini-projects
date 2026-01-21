export function recallMemory(memory: any[], invoice: any) {
  return memory.filter(
    m => m.vendor === invoice.vendor && m.confidence >= 0.6
  );
}
