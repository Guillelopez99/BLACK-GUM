const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const { join } = require("node:path");

const port = process.env.PORT || "3000";
const host = process.env.HOST || "0.0.0.0";

const nextBinCandidates = [
  join(__dirname, "node_modules", "next", "dist", "bin", "next"),
  join(process.cwd(), "node_modules", "next", "dist", "bin", "next"),
];

const nextBin = nextBinCandidates.find((candidate) => existsSync(candidate));

if (!nextBin) {
  console.error(
    "Next.js binary not found. Ensure dependencies are installed with `npm ci` before starting."
  );
  process.exit(1);
}

const child = spawn(process.execPath, [nextBin, "start", "-p", port, "-H", host], {
  stdio: "inherit",
  env: process.env,
});

child.on("error", (error) => {
  console.error("Failed to start Next.js:", error);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
