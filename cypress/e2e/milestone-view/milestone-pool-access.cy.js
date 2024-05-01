import { recurse } from 'cypress-recurse'
const navBarSelector = require('../../selectors/navBarSelector.js')
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
var projectName;

describe('Milestone & Cybersecurity Pools Access', () => {
    var projectId;
    var milestoneName;
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
        //setup the milestone data
        milestoneName = 'Automation_Milestone';
        cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
        cy.createMilestone(milestoneName).then(() => {
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone Automation_Milestone is created successfully.');
        });
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Verify the user should not be able to add goals/claims in the loaded milestone (MAIN-TC-631, MAIN-TC-662)', () => {
        milestoneName = 'MAIN-TC-631, MAIN-TC-662'
        cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
        cy.createMilestone(milestoneName).then(() => {
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone MAIN-TC-631, MAIN-TC-662 is created successfully.');
        }).then(() => {
            cy.addGoal('MAIN-TC-631-662-Original-Goal');
        }).then(() => {
            cy.addClaim('MAIN-TC-631-662-Original-Claim');
        }).then(() => {
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(modelingViewSelector.modelingViewMilestoneNameDiv).should('exist');
            })
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
                cy.get(cybersecurityPoolSelector.goalPoolAddNewGoalButton).should('be.disabled');
                cy.get(cybersecurityPoolSelector.goalPoolNoGoalFoundParagraph).should('exist');//recently added goal should not exist
            }).then(() => {
                cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click().then(() => {
                    cy.get(cybersecurityPoolSelector.claimPoolAddNewClaimButton).should('be.disabled');
                    cy.get(cybersecurityPoolSelector.claimPoolNoClaimFoundParagraph).should('exist');//recently added claim should not exist
                })
            })
        })
    })

    it('Verify that user is not allowed to update or create Goal, Claim, and Control in milestone view. (MAIN-TC-1502, MAIN-TC-1610, MAIN-TC-1612, MAIN-TC-2114)', () => {
        cy.visit(Cypress.env('baseURL'));
        cy.wait(1000);
        cy.addControl('MAIN-TC-1502-1610-1612-2114-Original-Control');
        cy.wait(1000);
        cy.addGoal('MAIN-TC-1502-1610-1612-2114-Original-Goal');
        cy.wait(1000);
        cy.addClaim('MAIN-TC-1502-1610-1612-2114-Original-Claim');
        cy.wait(1000);
        milestoneName = 'MAIN-TC-1502, MAIN-TC-1610, MAIN-TC-1612, MAIN-TC-2114';
        cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
        cy.createMilestone(milestoneName).then(() => {
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone MAIN-TC-1502, MAIN-TC-1610, MAIN-TC-1612, MAIN-TC-2114 is created successfully.');
        });
        cy.loadMilestone(milestoneName);
        cy.get(modelingViewSelector.modelingViewMilestoneNameDiv).should('exist');
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal');
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).first().click();
        cy.get(navBarSelector.confirmDialogueConfirmButton).should('be.disabled');
        cy.get(cybersecurityPoolSelector.updateDialogCancelButton).click();
        cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click();
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).first().click();
        cy.get(navBarSelector.confirmDialogueConfirmButton).should('be.disabled');
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-control');
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).first().click();
        cy.get(navBarSelector.confirmDialogueConfirmButton).should('be.disabled');
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