// scripts/initialize-project.ts
import { $ } from "bun";
import readline from "readline";

// Helper to prompt user for input
function prompt(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function main() {
  try {
    console.log("🛠️ Bun React TypeScript Project Setup");

    // Prompt for project name
    const projectName = await prompt("Enter your project name: ");
    if (!projectName) {
      console.error("❌ Project name is required.");
      process.exit(1);
    }

    // Create project directory and initialize React app
    await $`bun create react ${projectName} --typescript`;

    // Change directory to project
    process.chdir(projectName);

    // Install additional dependencies (if needed)
    await $`bun add -D typescript @types/react @types/react-dom`;

    // Create a basic tsconfig.json if not present
    const fs = require("fs");
    if (!fs.existsSync("tsconfig.json")) {
      fs.writeFileSync(
        "tsconfig.json",
        JSON.stringify(
          {
            compilerOptions: {
              target: "esnext",
              module: "esnext",
              jsx: "react-jsx",
              strict: true,
              moduleResolution: "node",
              esModuleInterop: true,
              skipLibCheck: true,
              forceConsistentCasingInFileNames: true,
            },
            include: ["src"],
          },
          null,
          2
        )
      );
      console.log("✅ tsconfig.json created.");
    }

    // Success message and next steps
    console.log(`\n✅ Project "${projectName}" created successfully!`);
    console.log("Next steps:");
    console.log(`  cd ${projectName}`);
    console.log("  bun install");
    console.log("  bun run dev");
  } catch (err: any) {
    console.error("❌ Error during setup:", err.message || err);
    process.exit(1);
  }
}

main();
