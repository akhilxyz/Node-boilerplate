import { readFileSync } from "node:fs";
import { join } from "node:path";

const packageJsonPath = join(process.cwd(), 'package.json');
const packageJsonData = readFileSync(packageJsonPath, 'utf-8');
const packageJson = JSON.parse(packageJsonData);

const memory = {
  MEMORY_HEAP_USAGE_THRESHOLD: 0.8,
  MEMORY_USAGE_THRESHOLD: 0.9,
};
// Get name and version
const appInfo = {
  name: packageJson.name,
  version: packageJson.version,
};

export { appInfo, memory };
