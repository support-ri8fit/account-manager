
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");

const extensions = [
  ".js", ".jsx", ".ts", ".tsx",
  ".json", ".mjs", ".cjs"
];

function getFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return getFiles(fullPath);
      }

      return [fullPath];
    });
}

const files = getFiles(SRC);
const allPaths = new Set(files.map(file => path.resolve(file)));

const errors = [];

for (const file of files) {
  if (!/\.(js|jsx|ts|tsx)$/.test(file)) continue;

  const content = fs.readFileSync(file, "utf8");

  const regex =
    /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']|import\(["']([^"']+)["']\)/g;

  let match;

  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1] || match[2];

    if (!importPath.startsWith(".")) continue;

    const resolved = path.resolve(
      path.dirname(file),
      importPath
    );

    const candidates = [
      resolved,
      ...extensions.map(ext => resolved + ext),
      ...extensions.map(ext => path.join(resolved, "index" + ext))
    ];

    const exists = candidates.some(candidate =>
      allPaths.has(candidate)
    );

    if (!exists) {
      const caseMatch = files.find(candidate =>
        candidate.toLowerCase() === resolved.toLowerCase() ||
        extensions.some(ext =>
          (candidate.toLowerCase() === (resolved + ext).toLowerCase()) ||
          (candidate.toLowerCase() ===
            path.join(resolved, "index" + ext).toLowerCase())
        )
      );

      errors.push({
        file: path.relative(ROOT, file),
        importPath,
        suggestion: caseMatch
          ? path.relative(ROOT, caseMatch)
          : "File not found"
      });
    }
  }
}

if (errors.length) {
  console.log("\nImport path issues found:\n");

  errors.forEach(error => {
    console.log(`File: ${error.file}`);
    console.log(`Import: ${error.importPath}`);
    console.log(`Suggestion: ${error.suggestion}\n`);
  });

  process.exitCode = 1;
} else {
  console.log("All relative imports look correct!");
}
