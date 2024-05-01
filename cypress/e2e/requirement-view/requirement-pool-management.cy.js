const navBarSelector = require('../../selectors/navBarSelector.js')
const requirementPoolSelector = require('../../selectors/requirementPoolSelector.js')
import { recurse } from 'cypress-recurse'
var projectName;

describe('Requirement Pool Management', () => {
    var projectId;
    var descriptionName;
    var requirementType;
    var requirementDiscipline;
    var requirementPhase;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            descriptionName = 'Automated Requirement: ' + $generatedName.substring(20);
            requirementType = 'Functional';
            requirementDiscipline = 'Software';
            requirementPhase = 'Development';
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

    it('Verify the "Add" functionality in "requirement" page (MAIN-TC-1093, MAIN-TC-3106)', () => {
        cy.addNewRequirement(descriptionName, requirementType, requirementDiscipline, requirementPhase);
    })

    it('Verify the requirement upload functionality from project to library level (MAIN-TC-1096)', () => {
        cy.addNewRequirementToLibrary(descriptionName);
        cy.requirementDeleteIcon(descriptionName);
    })

    it('Verify the load requirement from library level to project level (MAIN-TC-1094)', () => {
        cy.addNewRequirementFromLibrary(descriptionName);
    })

    it('Verify the "Delete" functionality in "requirement" page (MAIN-TC-1091)', () => {
        cy.intercept('DELETE', Cypress.env('apiURL') + '/requirements*').as('deleteRequest');
        cy.deleteRequirement(descriptionName);
        //verify the API call
        cy.get('@deleteRequest').its('response.statusCode').should('eq', 200);
    })

    it('Verify the user shall not be able to add the unavailable requirements to the page (MAIN-TC-1426)', () => {
        cy.visit(Cypress.env('baseURL') + '/requirements').then(() => { // Go to Requirements Pool Page
            cy.wait(2000);
            cy.get(requirementPoolSelector.requirementPoolAddNewButton).click({force: true});
            cy.get(requirementPoolSelector.addFromLibraryButton).click().then(() => {
                recurse( () => 
                    cy.get(requirementPoolSelector.addRequirementFromLibrarySearchBox).click().clear().type('Unavailable Requirement'),
                    ($inputField) => $inputField.val() === 'Unavailable Requirement',
                    { delay: 1000 })
                    .should('have.value', 'Unavailable Requirement').then(() => {
                        cy.wait(2000);
                        cy.get(requirementPoolSelector.addRequirementFromLibraryConfirmButton).should('not.be.enabled').then(() => {
                            cy.get(requirementPoolSelector.newReqDialogSnackBar).should('include.text','No requirement with such name found');
                        })
                    })
            })
        })
    })

    it('Verify the new "Edit" dialog window of requirement pool (MAIN-TC-1422)', () => {
        cy.visit(Cypress.env('baseURL') + '/requirements').then(() => { // Go to Requirements Pool Page
            cy.wait(1000);
            cy.get(requirementPoolSelector.requirementPoolContentTextArea).first().click().then(() => {
                cy.get(requirementPoolSelector.requirementPoolEditDialog).should('be.visible');
            })
        })
    })

    it('Verify the "Requirements" option shall be available in "Pool" page (MAIN-TC-1092)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => { // Go to Requirements Pool Page
            cy.wait(1000);
            cy.get(navBarSelector.navBarViewButton).should('be.visible').click().then(() => {
                cy.get(navBarSelector.viewListPoolButton).should('be.visible').click();
                cy.get(requirementPoolSelector.requirementPageButton).should('be.visible');
            })
        })
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