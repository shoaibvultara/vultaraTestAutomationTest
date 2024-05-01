const systemConfigSelector = require("../../selectors/systemConfigSelector");
const navBarSelector = require("../../selectors/navBarSelector");
import { recurse } from 'cypress-recurse';
var projectName;

describe('Custom Fields Management', () => {
    var projectId;
    var customFieldName;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            customFieldName = 'Custom Test: ' + $generatedName.substring(20);
            cy.createProject(projectName);
        })
        cy.window().then((win) => {
            const newDesignData = JSON.parse(win.localStorage.getItem('newDesign'));
            expect(newDesignData).to.not.be.null;
            expect(newDesignData.project).to.not.be.undefined;
            // Extract the project ID from the nested structure
            projectId = newDesignData.project.id;//projectId to be used 
            expect(projectId).to.not.be.undefined;
            cy.log("Project ID is: " + projectId);
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify the Add New Custom field button in the custom field page (MAIN-TC-2476, MAIN-TC-2478, MAIN-TC-2475)', () => {
        cy.visit(Cypress.env('baseURL') + '/systemConfig').then(() => { // Go to System Config Page
            cy.get(systemConfigSelector.systemConfigSideNavCustomFieldAnchor).should('be.visible').click();
            cy.wait(1000);
            cy.get(systemConfigSelector.customFieldPageText).should('be.visible');
        }).then(() => {
            let customFieldCategory = 'Vulnerability';
            let customFieldType = 'String';
            cy.createCustomField(customFieldName, customFieldCategory, customFieldType);
        })
    })

    it('Verify the delete button for every custom field row (MAIN-TC-2584, MAIN-TC-2540, MAIN-TC-2880)', () => {
        cy.deleteCustomField(customFieldName);
    })
})

describe('CLEANUP: Project Deletion', () => {
    it('Deleting The Project If Created', () => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.deleteProject(projectName);
        })
    })
})