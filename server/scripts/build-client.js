const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const clientDir = path.join(repoRoot, "client");
const clientPackageJson = path.join(clientDir, "package.json");

if (!fs.existsSync(clientPackageJson)) {
    console.log("[build-client] client/package.json not found, skipping client build.");
    process.exit(0);
}

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const run = (args, label) => {
    console.log(`[build-client] ${label}: ${npmCmd} ${args.join(" ")}`);

    const result = spawnSync(npmCmd, args, {
        cwd: clientDir,
        stdio: "inherit",
        shell: false,
    });

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
};

run(["install"], "Installing client dependencies");
run(["run", "build"], "Building client");

