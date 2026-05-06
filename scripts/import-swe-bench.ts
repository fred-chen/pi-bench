import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error("Usage: bun run scripts/import-swe-bench.ts <path/to/swe-bench-lite.json>");
    process.exit(1);
  }

  const outDir = join(import.meta.dir, "../tasks/synthetic");
  await mkdir(outDir, { recursive: true });

  const content = await readFile(inputFile, "utf-8");
  
  // Try to parse as JSON array or JSONL
  let instances: any[] = [];
  try {
    instances = JSON.parse(content);
  } catch (e) {
    // If not a JSON array, try JSONL
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    instances = lines.map(l => JSON.parse(l));
  }

  console.log(`[INFO] Found ${instances.length} SWE-bench instances.`);

  let count = 0;
  for (const instance of instances) {
    const task = {
      id: instance.instance_id,
      repo: instance.repo,
      commit: instance.base_commit,
      prompt: instance.problem_statement,
      expectedDiff: instance.patch,
      testPatch: instance.test_patch, // The test diff to apply
      // If SWE-bench provides a known solution commit or pull request, we could add it, but 'patch' is the gold diff.
    };

    const outPath = join(outDir, `${task.id}.json`);
    await writeFile(outPath, JSON.stringify(task, null, 2));
    count++;
  }

  console.log(`[INFO] Generated ${count} tasks in ${outDir}`);
}

main().catch(console.error);
