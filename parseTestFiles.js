// Script to parse
const fs = require('fs');
const path = require('path');

// Replace with the path to your test files
const testDir = './cypress/e2e';

function getTestFiles(dir) {
  let testFiles = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      testFiles = testFiles.concat(getTestFiles(filePath));
    } else if (file.endsWith('.cy.js')) {
      testFiles.push(filePath);
    }
  }

  return testFiles;
}

console.log(JSON.stringify(getTestFiles(testDir)));