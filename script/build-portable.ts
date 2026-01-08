import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, mkdir, cp, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { execSync } from "child_process";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "@neondatabase/serverless",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildPortable() {
  const portableDir = path.resolve(import.meta.dirname, "..", "portable");
  
  // Save launcher files before cleaning
  const tempDir = path.resolve(import.meta.dirname, "..", ".portable-temp");
  const startBat = path.resolve(portableDir, "start.bat");
  const startJs = path.resolve(portableDir, "start.js");
  const readmeTxt = path.resolve(portableDir, "README.txt");
  
  if (existsSync(portableDir)) {
    await mkdir(tempDir, { recursive: true });
    if (existsSync(startBat)) {
      await cp(startBat, path.resolve(tempDir, "start.bat"));
    }
    if (existsSync(startJs)) {
      await cp(startJs, path.resolve(tempDir, "start.js"));
    }
    if (existsSync(readmeTxt)) {
      await cp(readmeTxt, path.resolve(tempDir, "README.txt"));
    }
  }
  
  console.log("Cleaning portable directory...");
  await rm(portableDir, { recursive: true, force: true });
  await mkdir(portableDir, { recursive: true });

  console.log("Building production client...");
  await viteBuild();

  console.log("Building production server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  console.log("Copying built files to portable directory...");
  
  // Copy dist directory
  const distPath = path.resolve(import.meta.dirname, "..", "dist");
  const portableDistPath = path.resolve(portableDir, "dist");
  await cp(distPath, portableDistPath, { recursive: true });

  // Copy launcher scripts from temp directory
  if (existsSync(tempDir)) {
    const tempStartBat = path.resolve(tempDir, "start.bat");
    const tempStartJs = path.resolve(tempDir, "start.js");
    const tempReadmeTxt = path.resolve(tempDir, "README.txt");
    
    if (existsSync(tempStartBat)) {
      await cp(tempStartBat, path.resolve(portableDir, "start.bat"));
    }
    if (existsSync(tempStartJs)) {
      await cp(tempStartJs, path.resolve(portableDir, "start.js"));
    }
    if (existsSync(tempReadmeTxt)) {
      await cp(tempReadmeTxt, path.resolve(portableDir, "README.txt"));
    }
    
    // Clean up temp directory
    await rm(tempDir, { recursive: true, force: true });
  }

  // Copy package.json
  const packageJsonPath = path.resolve(import.meta.dirname, "..", "package.json");
  const portablePackageJsonPath = path.resolve(portableDir, "package.json");

  // Create a minimal package.json for portable (production deps only)
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));
  const portablePackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    type: packageJson.type,
    dependencies: packageJson.dependencies,
    optionalDependencies: packageJson.optionalDependencies,
  };
  await writeFile(
    portablePackageJsonPath,
    JSON.stringify(portablePackageJson, null, 2),
    "utf-8"
  );

  console.log("Installing production dependencies...");
  // Install only production dependencies in portable directory
  process.chdir(portableDir);
  try {
    execSync("npm install --production --no-audit --no-fund", {
      stdio: "inherit",
      cwd: portableDir,
    });
  } catch (error) {
    console.error("Error installing dependencies:", error);
    throw error;
  }

  console.log("Portable build complete!");
  console.log(`\nPortable package is ready at: ${portableDir}`);
  console.log("\nTo use:");
  console.log("1. Copy the 'portable' folder to your USB stick");
  console.log("2. On any Windows computer with Node.js installed:");
  console.log("   - Navigate to the portable folder on your USB");
  console.log("   - Double-click 'start.bat'");
  console.log("   - Your browser will open to http://localhost:5000");
}

buildPortable().catch((err) => {
  console.error(err);
  process.exit(1);
});

