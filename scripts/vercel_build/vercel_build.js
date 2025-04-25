/**
 * This script controls which Git branches are allowed to build in the Vercel environment.
 * It exits with code 0 to proceed with the build, or 1 to cancel the build.
 */

const buildUtils = require("./build_utils");
const { isMatched, currentGitBranch } = buildUtils;

// List of branches that are allowed to build
const allowedBranches = [
  "main",
  "staging",
];

/**
 * Main function to determine if the build should proceed
 */
const main = () => {
  console.log(`Current Git branch: ${currentGitBranch}`);

  if (isMatched(currentGitBranch, allowedBranches)) {
    // Proceed with the build
    console.log("✅ - Build can proceed");
    process.exit(1); // Exit with success code to proceed with the build
  } else {
    // Don't build
    console.log("🛑 - Build ignored");
    process.exit(0); // Exit with failure code to cancel the build
  }
};

main();
