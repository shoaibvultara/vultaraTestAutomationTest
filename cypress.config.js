const { defineConfig } = require("cypress");
const { registerAIOTestsPlugin } = require('cypress-aiotests-reporter/src') // Import the necessary plugin if not already imported
const fs = require("fs");

module.exports = defineConfig({
  projectId: 'tkumcu',
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  requestTimeout: 120000,
  responseTimeout: 120000,
  pageLoadTimeout: 120000,
  reporter: "cypress-mochawesome-reporter",
  retries: 1,
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: true,
    html: false,
    json: true,
    timestamp: true,
    reportTitle: "Vultara Automation Test",
    showPassed: true,
    showFailed: true,
    showPending: true,
    showSkipped: false,
    browser: "all",
    quiet: true,
  },
  video: false,
  env: {
    baseURL: "http://localhost:4200",
    apiURL: "http://localhost:4201/api",
    authURL: "http://localhost:4321/auth",
    username: "vultara_automation_test",
    password: "tJVJhiHmlIWR",
    aioTests: {
      enableReporting: true,
      cloud: {
        apiKey: process.env.AIO_API_KEY
      },
      jiraProjectId: "MAIN",
      cycleDetails: {
        createNewCycle: true,
        cycleName: "Automation Run " + new Date().toISOString(),
        //cycleKey: "MAIN-CY-123",
      },
      addNewRun: true,
      addAttachmentToFailedCases: true,
      createNewRunForRetries: true,
    },
  },
  //projectId: "6ca4i2",
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        isFileExist( filePath ) {
          return new Promise((resolve, reject) => {
            try {
              let isExists = fs.existsSync(filePath)
              resolve(isExists);
            } catch (e) {
              reject(e);
            }
          });
        }
      });
      on('task', {
        // Define the removeDirectory task handler
        removeDirectory(directoryPath) {
          // Implement the logic to remove the directory
          return new Promise((resolve, reject) => {
            fs.rmdir(directoryPath, { recursive: true }, (err) => {
              if (err) {
                // Failed to remove directory
                reject(err);
              } else {
                // Directory removed successfully
                resolve(null);
              }
            });
          });
        },
      });
      registerAIOTestsPlugin(on, config);
      // implement node event listeners here
    },
  },
});
