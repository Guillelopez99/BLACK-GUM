/**
 * Ensure DATABASE_URL is set before Prisma commands run.
 *
 * When DATABASE_URL is not in the environment (e.g. during Infomaniak build),
 * this script writes a root .env with a safe SQLite fallback so that every
 * subsequent Prisma CLI command (generate, db push, migrate, etc.) can find it.
 *
 * Prisma reads from <project-root>/.env automatically.
 * We intentionally write to root .env (not prisma/.env) to avoid conflicts.
 *
 * Run automatically via "postinstall" or manually before any Prisma step.
 */
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.join(__dirname, "..");
const prismaDir = path.join(projectRoot, "prisma");
const dbPath = path.join(prismaDir, "dev.db");
const rootEnvFile = path.join(projectRoot, ".env");

// Use relative path — Prisma resolves it from the schema dir (prisma/)
const relativeUrl = "file:./dev.db";

if (process.env.DATABASE_URL) {
  console.log("[ensure-db] DATABASE_URL already set in env, skipping.");
  process.exit(0);
}

// If root .env already exists and contains DATABASE_URL, skip
if (fs.existsSync(rootEnvFile)) {
  const content = fs.readFileSync(rootEnvFile, "utf-8");
  if (content.includes("DATABASE_URL")) {
    console.log("[ensure-db] .env already has DATABASE_URL, skipping.");
    process.exit(0);
  }
}

// Delete prisma/.env if it exists to avoid conflicts
const prismaEnvFile = path.join(prismaDir, ".env");
if (fs.existsSync(prismaEnvFile)) {
  fs.unlinkSync(prismaEnvFile);
  console.log("[ensure-db] Removed prisma/.env to avoid conflicts.");
}

// Append DATABASE_URL to root .env (create if needed)
const line = `DATABASE_URL="${relativeUrl}"\n`;
if (fs.existsSync(rootEnvFile)) {
  fs.appendFileSync(rootEnvFile, `\n${line}`, "utf-8");
} else {
  fs.writeFileSync(rootEnvFile, line, "utf-8");
}
console.log(`[ensure-db] Wrote DATABASE_URL=${relativeUrl} → ${rootEnvFile}`);

// Also create an empty SQLite file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
  console.log(`[ensure-db] Created empty ${dbPath}`);
}
