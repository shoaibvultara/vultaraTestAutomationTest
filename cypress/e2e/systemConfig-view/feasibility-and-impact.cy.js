const systemConfigSelector = require("../../selectors/systemConfigSelector");
import { recurse } from 'cypress-recurse';
import navBarSelector from '../../selectors/navBarSelector';
var projectName;

describe('Feasibility and Impact System Configurations', () => {
    var projectId;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
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

    it('Verify that in Feasibility and Impact tab, impact name and damage scenario should not exceed maximum characters(MAIN-TC-2658)', () => {
        cy.visit(Cypress.env('baseURL') + '/systemConfig').then(() => { // Go to System Config Page
            cy.get(systemConfigSelector.systemConfigSideNavImpactRatingAnchor).click().then(() => {
                cy.get(systemConfigSelector.pageContentTable).first().should('be.visible');// wait until content is loaded
                cy.get(systemConfigSelector.impactRatingAddOrEditImpactButton).click().then(() => {
                    cy.get(systemConfigSelector.addNewImpactDialogLevelNameInput).should('have.attr', 'maxlength', "50");
                    cy.get(systemConfigSelector.addNewImpactDialogDamageScenarioTextarea).each(($damageScenarioField) => {
                        cy.get($damageScenarioField).should('have.attr', 'maxlength', "1000");
                    })
                })
            })
        })
    })

    it('Verify that when user deletes an impact, there should be a warning message and a space to enter "Confirm" to delete(MAIN-TC-2655)', () => {
        cy.visit(Cypress.env('baseURL') + '/systemConfig').then(() => { // Go to System Config Page
            cy.get(systemConfigSelector.systemConfigSideNavImpactRatingAnchor).click().then(() => {
                cy.get(systemConfigSelector.pageContentTable).first().should('be.visible');// wait until content is loaded
                cy.get(systemConfigSelector.systemConfigDeleteIcon).first().click().then(() => {
                    cy.get(systemConfigSelector.SystemConfigConfirmationInput).should('be.visible');
                    cy.get(systemConfigSelector.SystemConfigConfirmationInput).should('be.visible');
                })
            })
        })
    })

    it('Verify that "Attack feasibility" name is changed to "Feasibility and Impact" with 3 additional fields in Feasibility and Impact page(MAIN-TC-2654)', () => {
        cy.visit(Cypress.env('baseURL') + '/systemConfig').then(() => { // Go to System Config Page
            cy.get(systemConfigSelector.systemConfigSideNavImpactRatingAnchor).click().then(() => {
                cy.get(systemConfigSelector.pageContentTable).first().should('be.visible').then(() => {// wait until content is loaded
                    cy.get(systemConfigSelector.impactRatingSafetyTitleHeader).should('be.visible');
                    cy.get(systemConfigSelector.impactRatingFinancialTitleHeader).should('be.visible');
                    cy.get(systemConfigSelector.impactRatingPrivacyTitleHeader).should('be.visible');
                    cy.get(systemConfigSelector.impactRatingOperationalTitleHeader).should('be.visible');
                })
            })
        })
    })

    it('Verify that user can use the number instead of String in the Impact field (MAIN-TC-2657)', () => {
        cy.visit(Cypress.env('baseURL') + '/systemConfig').then(() => { // Go to System Config Page
            cy.get(systemConfigSelector.systemConfigSideNavImpactRatingAnchor).click().then(() => {
                cy.get(systemConfigSelector.pageContentTable).first().should('be.visible');// wait until content is loaded
                cy.get(systemConfigSelector.impactRatingAddOrEditImpactButton).click().then(() => {
                    recurse(() =>
                        cy.get(systemConfigSelector.addNewImpactDialogLevelNameInput).clear().type('4'),
                        ($inputField) => $inputField.val() === '4',
                        { delay: 1000 }
                    ).then(() => {
                        cy.get(systemConfigSelector.addNewImpactDialogLevelNameInput).should('have.attr', 'aria-invalid', 'false');//assert the input value is valid
                    })
                })
            })
        })
    })

    it('Verify that the user can edit the impact rating name, impact color, and damage scenario in the Feasibility and Impact tab of the System page(MAIN-TC-2596)', () => {
        cy.visit(Cypress.env('baseURL') + '/systemConfig').then(() => { // Go to System Config Page
            cy.get(systemConfigSelector.systemConfigSideNavImpactRatingAnchor).click().then(() => {
                cy.get(systemConfigSelector.pageContentTable).first().should('be.visible');// wait until content is loaded
                cy.get(systemConfigSelector.impactRatingDamageScenarioTableRow).first().click().then(() => {
                    recurse(() =>
                        cy.get(systemConfigSelector.addNewImpactDialogLevelNameInput).clear().type('Major'),
                        ($inputField) => $inputField.val() === 'Major',
                        { delay: 1000 }
                    ).then(() => {
                        cy.get(systemConfigSelector.addNewImpactDialogDamageScenarioTextarea).each(($damageScenarioField) => {
                            cy.get($damageScenarioField).should('not.have.attr', 'readonly');
                        })
                    }).then(() => {
                        cy.get(navBarSelector.confirmDialogueConfirmButton).should('be.enabled');
                    })
                })
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