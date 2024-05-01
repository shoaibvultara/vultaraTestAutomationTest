const navBarSelector = require('../../selectors/navBarSelector.js')
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
const projectLibrarySelector = require('../../selectors/projectLibrarySelector.js');
const cybersecurityGoalSelector = require('../../selectors/cybersecurityGoalSelector.js');
import { recurse } from 'cypress-recurse'
var projectName;

describe('Cybersecurity Control Pool', () => {
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
        cy.login();
        cy.loadProject(projectId);
    })

    it('Verify that if a user adds a control from the library to a project, if that control contains any requirements, these requirements should be added to the project (MAIN-TC-3080, MAIN-TC-3076)', () => {
        cy.generateProjectName().then(($generatedName) => {
            let requirementName = 'REQ>' + $generatedName;
            let controlName = 'CTRL>' + $generatedName;
            //create new requirement
            cy.addRequirementToLibrary(requirementName);
            cy.wait(1000);
            //create new control
            cy.addControlToLibrary(controlName);
            cy.wait(1000);
            //link control and requirement
            cy.linkRequirementToControl(controlName, requirementName)
            cy.wait(1000);
            //import control from library
            cy.ImportControlFromLibrary(controlName);
            cy.wait(1000);
            //assert the requirement has been added to the project
            cy.visit(Cypress.env('baseURL') + '/requirements').then(() => {
                cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('have.value', requirementName);
            }).then(() => {
                cy.deleteControlFromLibrary(controlName);
                cy.deleteRequirementFromLibrary(requirementName);
            })
        })
    })

    it('Verify that user can add control/goal from library in the project control/goal page (MAIN-TC-3077, MAIN-TC-3078)', () => {
        cy.generateProjectName().then(($generatedName) => {
            let goalName = 'GL>' + $generatedName;
            let controlName = 'CTRL>' + $generatedName;
            //add control to library and import it to project
            cy.addControlToLibrary(controlName);
            cy.wait(1000);
            cy.ImportControlFromLibrary(controlName);
            cy.wait(1000);
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('have.value', controlName);
            //add goal to library and import it to project
            cy.createGoalInLibrary(goalName);
            cy.wait(1000);
            cy.ImportGoalFromLibrary(goalName);
            cy.wait(1000);
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('have.value', goalName).then(() => {
                cy.deleteControlFromLibrary(controlName);
                cy.deleteGoalFromLibrary(goalName);
            })
        })
    })

    it('Verify that if a user add a goal from the library to a project, if that goal contains controls, these controls should also be added to the project (MAIN-TC-3079, MAIN-TC-3074)', () => {
        cy.generateProjectName().then(($generatedName) => {
            let goalName = 'GL>' + $generatedName;
            let controlName = 'CTRL>' + $generatedName;
            let controlExist = false;
            //add control to library
            cy.addControlToLibrary(controlName);
            cy.wait(1000);
            //add goal to library
            cy.createGoalInLibrary(goalName);
            cy.wait(1000);
            //link control and goal
            cy.linkControlToGoal(goalName, controlName)
            cy.wait(1000);
            //import the goal to project
            cy.ImportGoalFromLibrary(goalName);
            cy.wait(1000);
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('have.value', goalName);
            //check linked controls exist
            cy.visit(Cypress.env('baseURL') + '/cybersecurity-control').then(() => {
                cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($record) => {
                    if ($record.val() === controlName) {
                        controlExist = true;
                    }
                })
            }).then(() => {
                cy.deleteControlFromLibrary(controlName);
                cy.deleteGoalFromLibrary(goalName);
                expect(controlExist).to.be.true;
            })
        })
    })

    it('Verify that user can link requirement with control and control with goal, in project pool pages (MAIN-TC-3073, MAIN-TC-3075)', () => {
        cy.generateProjectName().then(($generatedName) => {
            let requirementName = 'REQ>' + $generatedName;
            let controlName = 'CTRL>' + $generatedName;
            let goalName = 'GL>' + $generatedName;
            //add req to project pool
            cy.addRequirement(requirementName);
            cy.wait(1000);
            //add control to project pool
            cy.addControl(controlName);
            cy.wait(1000);
            //add goal to project pool
            cy.addGoal(goalName);
            cy.wait(1000);
            //link req with control in project pool
            cy.visit(Cypress.env('baseURL') + '/cybersecurity-control');
            cy.wait(1000);
            cy.get(projectLibrarySelector.libraryMoreOptionsButton).first().click();
            cy.get(projectLibrarySelector.moreOptionsLinkedRequirementsButton).click();
            cy.get(projectLibrarySelector.linkingDialogShowAllButton).click();
            cy.get(projectLibrarySelector.linkingDialogCheckboxInput).first().check();
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
            cy.wait(1000);
            //assert linked req exist
            cy.get(projectLibrarySelector.libraryMoreOptionsButton).first().click();
            cy.get(projectLibrarySelector.moreOptionsLinkedRequirementsButton).click();
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).last().should('have.value', requirementName);
            //link control with goal in project pool
            cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal');
            cy.get(projectLibrarySelector.libraryMoreOptionsButton).first().click();
            cy.get(projectLibrarySelector.moreOptionsLinkedControlsButton).click();
            cy.get(cybersecurityGoalSelector.searchControlBox).click();
            recurse(() =>
                cy.get(cybersecurityGoalSelector.searchControlBox).clear().type(controlName),
                ($inputField) => $inputField.val() === controlName,
                { delay: 1000 })
                .should('have.value', controlName).then(() => {
                    cy.wait(1000);
                    cy.get(cybersecurityGoalSelector.globalDropDownList).contains(controlName).click();
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                    cy.wait(1000);
                    //assert linked control exist
                    let indexOfRecord = 0;
                    cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
                        if ($element.val() === goalName) {
                            cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                            return false;// to exist from the .each() loop
                        }
                        indexOfRecord++;
                    }).then(() => {
                        cy.get(projectLibrarySelector.moreOptionsLinkedControlsButton).click().then(() => {
                            cy.get(navBarSelector.loader).should('not.exist');
                            let controlChipName = controlName.substring(0, 20);
                            cy.get(cybersecurityGoalSelector.linkedControlChip).should('include.text', controlChipName);
                        })
                    })
                })
        })
    })

    it('Verify the functionality of delete claim/goal button(MAIN-TC-375, MAIN-TC-745)', () => {
        cy.generateProjectName().then(($generatedName) => {
            const claimName = 'CL>' + $generatedName;
            const goalName = 'GL>' + $generatedName;
            //add claim to project
            cy.addClaim(claimName);
            cy.wait(1000);
            //delete claim and check API call
            cy.intercept('DELETE', '*').as('deleteRequest');
            cy.deleteClaim(claimName);
            cy.get('@deleteRequest').its('response.statusCode').should('eq', 200);
            //add goal to project
            cy.addGoal(goalName);
            cy.wait(1000);
            //delete goal and check API call 
            cy.intercept('DELETE', '*').as('deleteRequest');
            cy.deleteGoal(goalName);
            cy.get('@deleteRequest').its('response.statusCode').should('eq', 200);
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