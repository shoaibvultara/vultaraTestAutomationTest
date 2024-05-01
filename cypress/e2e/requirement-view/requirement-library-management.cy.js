const navBarSelector = require('../../selectors/navBarSelector.js')
const projectLibrarySelector = require('../../selectors/projectLibrarySelector.js');
const requirementPoolSelector = require('../../selectors/requirementPoolSelector.js');
import { recurse } from 'cypress-recurse'
var projectName;

describe('Requirement Pool Management', () => {
    var projectId;
    var descriptionName;
    var requirementType;
    var requirementDiscipline;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            descriptionName = 'Automated Requirement: ' + $generatedName.substring(20);
            requirementType = 'Functional';
            requirementDiscipline = 'Software';
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

    it('Verify the user shall not be able to add duplicate requirements in the "Requirement Library" (MAIN-TC-1725, MAIN-TC-1099)', () => {
        cy.createNewRequirement(descriptionName, requirementType, requirementDiscipline);
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
            cy.wait(2000);
            cy.get(projectLibrarySelector.librarySideNavRequirementAnchor).click();  // Redirects to Requirement Page
            cy.get(requirementPoolSelector.createNewRequirementLibraryButton).should('exist').click().then(() => {
                cy.get(requirementPoolSelector.newReqDialogDescriptionTypeInput).click();
                cy.get(requirementPoolSelector.newReqDialogNextButton).click().then(() => {
                    cy.get(requirementPoolSelector.newReqDialogTypeFieldButton).click();
                    cy.get(requirementPoolSelector.globalDropDownOptionList).contains(requirementType).click().then(() => {
                        cy.get(requirementPoolSelector.newReqDialogDisciplineFieldButton).click();
                        cy.get(requirementPoolSelector.globalDropDownOptionList).contains(requirementDiscipline).click().then(() => {
                            cy.get(requirementPoolSelector.newReqDialogDescriptionTextArea).should('exist')
                            recurse(() => 
                                cy.get(requirementPoolSelector.newReqDialogDescriptionTextArea).clear().type(descriptionName),
                                ($inputField) => $inputField.val() === descriptionName,
                                { delay: 1000 })
                                .should('have.value', descriptionName).then(() => {
                                    cy.get(requirementPoolSelector.newReqDialogConfirmButton).click().then(() => {
                                        cy.get(requirementPoolSelector.newReqDialogSnackBar).should('include.text','Duplicating requirements is not allowed.');
                                    })
                                })
                        })
                    })
                })
            })
        })
    })

    it('Verify the "Edit" functionality in "requirement Library" (MAIN-TC-1089)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => {
            cy.get(projectLibrarySelector.librarySideNavRequirementAnchor).click().then(() => {
                cy.get(projectLibrarySelector.requirementLibraryDescriptionCell).first().click();
            }).then(() => {
                cy.get(projectLibrarySelector.reqLibraryAddUpdateRequirementDialog).should('be.visible');
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