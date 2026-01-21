import fs from "fs";
import { execSync } from "child_process";

if (fs.existsSync("memory.json")) {
  fs.unlinkSync("memory.json");
}

console.log("FIRST RUN (learning)");
execSync("npx ts-node src/index.ts", { stdio: "inherit" });

console.log("\nSECOND RUN (using memory)");
execSync("npx ts-node src/index.ts", { stdio: "inherit" });
