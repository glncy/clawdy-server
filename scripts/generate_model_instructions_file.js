/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

// Define the source directory and output file
const instructionsDir = path.join(__dirname, "../src/utils/llms/instructions");
const outputFile = path.join(__dirname, "../src/utils/llms/instructions.ts");

// Function to convert filename to variable name (replacing . with _)
function fileNameToVarName(fileName) {
  // Replace the dot with underscore to create filename_extension format
  return fileName.replace(".", "_");
}

// Main function to generate the instructions file
async function generateInstructionsFile() {
  try {
    // Check if the directory exists
    if (!fs.existsSync(instructionsDir)) {
      console.error(`Directory not found: ${instructionsDir}`);
      process.exit(1);
    }

    // Read all files from the instructions directory
    const files = fs.readdirSync(instructionsDir);

    // If no files found, exit
    if (files.length === 0) {
      console.log("No instruction files found.");
      process.exit(0);
    }

    // Start building the output content
    let outputContent =
      "// Auto-generated file from instruction markdown files\n\n";

    // Process each file
    for (const file of files) {
      const filePath = path.join(instructionsDir, file);

      // Skip directories
      if (fs.statSync(filePath).isDirectory()) continue;

      // Read file content
      const content = fs.readFileSync(filePath, "utf8");

      // Convert filename to variable name
      const varName = fileNameToVarName(file);

      // Add to output content
      outputContent += `export const ${varName} = String.raw\`${content}\`;\n\n`;
    }

    // Write the output file
    fs.writeFileSync(outputFile, outputContent);

    console.log(
      `Successfully generated ${outputFile} with ${files.length} instruction templates.`
    );
  } catch (error) {
    console.error("Error generating instructions file:", error);
    process.exit(1);
  }
}

// Run the main function
generateInstructionsFile();
