export function decide(
  proposedCorrections: string[],
  invoiceConfidence: number,
  memoryConfidence = 0.7
): boolean {
  if (
    invoiceConfidence > 0.8 &&
    memoryConfidence >= 0.75 &&
    proposedCorrections.length > 0
  ) {
    return false;
  }
  return true;
}
