const fs = require("node:fs");
const path = require("node:path");

// =====================================================
// PROJECT CONFIGURATION
// =====================================================

// Go one directory up from scripts to project root.
const PROJECT_ROOT = path.resolve(__dirname, "..");

const SOURCE_DIR = path.join(PROJECT_ROOT, "src");

const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated-packs");

// Supported source extensions.
const EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
]);

// Directories to ignore.
const EXCLUDED_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".git",
  ".next",
  ".vite",
]);

// =====================================================
// COLLECT SOURCE FILES
// =====================================================

function collectFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const result = [];

  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true,
  })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        result.push(...collectFiles(fullPath));
      }

      continue;
    }

    if (EXTENSIONS.has(path.extname(entry.name))) {
      result.push(fullPath);
    }
  }

  return result;
}

// =====================================================
// NORMALIZE FILE PATH
// =====================================================

function normalizePath(file) {
  return path
    .relative(SOURCE_DIR, file)
    .replace(/\\/g, "/");
}

// =====================================================
// CLASSIFY FILES INTO GROUPS
// =====================================================

function classifyFiles(files) {
  const groups = {
    all: {
      title: "React + Vite Complete Source Code",
      files: [],
    },

    forms: {
      title: "Application Forms",
      files: [],
    },

    candidates: {
      title: "Candidate Management Forms",
      files: [],
    },

    hiringManagers: {
      title: "Hiring Manager Forms",
      files: [],
    },

    jobs: {
      title: "Jobs and Job Description Forms",
      files: [],
    },

    interviews: {
      title: "Interview Management Forms",
      files: [],
    },

    users: {
      title: "User and Role Management Forms",
      files: [],
    },

    validations: {
      title: "Validation Schemas and Rules",
      files: [],
    },

    components: {
      title: "Reusable Form Components",
      files: [],
    },

    services: {
      title: "API Services and Form Payloads",
      files: [],
    },

    constants: {
      title: "Dropdowns, Enums and Constants",
      files: [],
    },
  };

  for (const file of files) {
    const relativePath = normalizePath(file);

    const filename = path.basename(file);

    const content = fs.readFileSync(file, "utf8");

    // Complete source pack.
    groups.all.files.push(file);

    // Identify form-related files.
    const isForm =
      /form|create|edit|add|update/i.test(filename) ||
      /<form|useForm|Formik|handleSubmit/i.test(content);

    if (isForm) {
      groups.forms.files.push(file);
    }

    // Candidate files.
    if (/candidate|applicant|resume/i.test(relativePath)) {
      groups.candidates.files.push(file);
    }

    // Hiring manager files.
    if (/hiring.?manager|hiringmanager/i.test(relativePath)) {
      groups.hiringManagers.files.push(file);
    }

    // Job files.
    if (/job|vacanc|position/i.test(relativePath)) {
      groups.jobs.files.push(file);
    }

    // Interview files.
    if (/interview|schedule/i.test(relativePath)) {
      groups.interviews.files.push(file);
    }

    // User management files.
    if (/user|employee|role|department/i.test(relativePath)) {
      groups.users.files.push(file);
    }

    // Validation files.
    if (
      /validation|schema/i.test(relativePath) ||
      /yup|zod|yup\.object|z\.object/i.test(content)
    ) {
      groups.validations.files.push(file);
    }

    // Reusable form components.
    if (
      /components/i.test(relativePath) &&
      /input|select|textarea|form/i.test(content)
    ) {
      groups.components.files.push(file);
    }

    // API service files.
    if (/service|api|query|mutation/i.test(relativePath)) {
      groups.services.files.push(file);
    }

    // Constants and dropdown options.
    if (/constant|enum|option|dropdown/i.test(relativePath)) {
      groups.constants.files.push(file);
    }
  }

  return groups;
}

// =====================================================
// GENERATE MARKDOWN CONTENT
// =====================================================

function generateMarkdown(title, files) {
  let markdown = `# ${title}\n\n`;

  markdown += `Generated Date: ${new Date().toISOString()}\n\n`;

  markdown += `Total Source Files: ${files.length}\n\n`;

  markdown += "---\n\n";

  for (const file of files) {
    const relativePath = normalizePath(file);

    const content = fs.readFileSync(file, "utf8");

    // Find the longest existing backtick sequence.
    const matches = content.match(/`+/g) || [];

    const longestRun = Math.max(
      0,
      ...matches.map((match) => match.length)
    );

    // Generate a safe Markdown code fence.
    const fence = "`".repeat(
      Math.max(3, longestRun + 1)
    );

    markdown += `## File: ${relativePath}\n\n`;

    markdown += `${fence}javascript\n`;

    markdown += `${content}\n`;

    markdown += `${fence}\n\n`;

    markdown += "---\n\n";
  }

  return markdown;
}

// =====================================================
// WRITE MARKDOWN FILE
// =====================================================

function writePack(filename, title, files) {
  if (files.length === 0) {
    console.log(`Skipped ${filename}: No matching files found.`);
    return;
  }

  const outputFile = path.join(OUTPUT_DIR, filename);

  const markdown = generateMarkdown(title, files);

  fs.writeFileSync(outputFile, markdown, "utf8");

  console.log(
    `Generated: ${filename} (${files.length} files)`
  );
}

// =====================================================
// MAIN FUNCTION
// =====================================================

function main() {
  console.log("\n====================================");
  console.log(" React + Vite Pack Generator");
  console.log("====================================\n");

  console.log("Project Root:", PROJECT_ROOT);

  console.log("Source Directory:", SOURCE_DIR);

  console.log("Output Directory:", OUTPUT_DIR);

  console.log("\nScanning source files...\n");

  // Check source directory.
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(
      "\nCould not find src directory:",
      SOURCE_DIR
    );

    process.exitCode = 1;

    return;
  }

  // Create output directory.
  fs.mkdirSync(OUTPUT_DIR, {
    recursive: true,
  });

  // Collect all source files.
  const files = collectFiles(SOURCE_DIR).sort();

  if (files.length === 0) {
    console.log("No supported source files found.");
    return;
  }

  console.log(`Found ${files.length} source files.\n`);

  // Classify files.
  const groups = classifyFiles(files);

  // Output file mapping.
  const outputMap = {
    all: "pack-forms-all.md",

    forms: "pack-forms.md",

    candidates: "pack-forms-candidates.md",

    hiringManagers: "pack-forms-hiring-managers.md",

    jobs: "pack-forms-jobs.md",

    interviews: "pack-forms-interviews.md",

    users: "pack-forms-users.md",

    validations: "pack-forms-validations.md",

    components: "pack-forms-components.md",

    services: "pack-forms-api-services.md",

    constants: "pack-forms-constants.md",
  };

  // Generate each Markdown pack.
  for (const [key, filename] of Object.entries(outputMap)) {
    const group = groups[key];

    writePack(
      filename,
      group.title,
      group.files
    );
  }

  console.log("\n====================================");

  console.log(" Pack Generation Completed!");

  console.log("====================================\n");

  console.log("Generated files:");

  for (const [key, filename] of Object.entries(outputMap)) {
    if (groups[key].files.length > 0) {
      console.log(
        `- ${filename}: ${groups[key].files.length} files`
      );
    }
  }

  console.log("\nOutput Location:");

  console.log(OUTPUT_DIR);

  console.log("\n");
}

// =====================================================
// EXECUTE
// =====================================================

main();