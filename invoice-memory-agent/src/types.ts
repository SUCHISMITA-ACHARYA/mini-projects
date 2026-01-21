export interface Invoice {
  invoiceId: string;
  vendor: string;
  fields: Record<string, any>;
  rawText: string;
  confidence: number;
}

export interface MemoryItem {
  id: string;
  vendor: string;
  type: "VENDOR" | "CORRECTION" | "RESOLUTION";
  rule: string;
  confidence: number;
  usageCount: number;
  lastUsed: string;
}
