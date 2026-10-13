import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { SEED_LOCATIONS } from "../src/data/corpus/seed-registry";

const outDir = path.join(process.cwd(), "public/data");
mkdirSync(outDir, { recursive: true });
const locations = SEED_LOCATIONS.map(({ baseScores: _b, ...rest }) => rest);
writeFileSync(
  path.join(outDir, "locations.seed.json"),
  JSON.stringify({ version: 1, locations }, null, 2),
);
console.log(`Exported ${locations.length} cities to public/data/locations.seed.json`);
