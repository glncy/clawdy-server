/**
 * Checks if a value matches the start of any string in an array
 * @param {string} value - The value to check
 * @param {string[]} allowedValues - Array of allowed values
 * @returns {boolean} - True if the value starts with any allowed value
 */
export const isMatched = (value, allowedValues) => {
  if (!value || !allowedValues || !Array.isArray(allowedValues)) {
    return false; // Invalid input
  }
  return allowedValues.some((allowedValue) =>
    value.startsWith(`${allowedValue}`)
  );
};

// Get the current Git branch from Vercel environment variables
export const currentGitBranch = process.env.VERCEL_GIT_COMMIT_REF;
