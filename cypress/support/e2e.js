// Import commands.js using ES2015 syntax:
import './commands'
import './bomCommands'
import './vulnerabilityCommands'
import './eventCommand'
import './cybersecurityPoolCommands'
import './weaknessCommands'
import './projectTriggerCommands'
import './assumptionCommands'
import './monitoringCommands'
import './requirementLibraryCommands'
import './requirementPoolCommands'
import './controlLibraryCommands'
import './moduleLibraryCommands'
import './featureLibraryCommands'
import './assetLibraryCommands'
import './modelCommands';
import './threatCommands';
import './generateReportCommands'
import './cybersecurityGoalCommands'
import './customFieldCommands'
import 'cypress-mochawesome-reporter/register';
require('cypress-xpath')

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})