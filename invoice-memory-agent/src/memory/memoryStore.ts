import fs from "fs";

const MEMORY_FILE = "memory.json";

export function loadMemory(): any[] {
  if (!fs.existsSync(MEMORY_FILE)) {
    return [];
  }
  const data = fs.readFileSync(MEMORY_FILE, "utf-8");
  return JSON.parse(data);
}

export function saveMemory(memory: any[]): void {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}
