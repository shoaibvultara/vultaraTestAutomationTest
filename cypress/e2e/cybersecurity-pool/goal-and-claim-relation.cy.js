const navBarSelector = require('../../selectors/navBarSelector.js')
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
const projectLibrarySelector = require('../../selectors/projectLibrarySelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
import { recurse } from 'cypress-recurse'
var projectName;

describe('Goal & Claim Cybersecurity Pool', () => {
    var projectId;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        //Generate a random project name
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
        }).then(() => {
            cy.createModel().then(() => {
                cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandThreatIcon).should('be.visible');
                })
            })
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Verify the updated goals are visible in "Cybersecurity Goal & Claim" window (MAIN-TC-628)', () => {
        let threatRow = 1;
        let goalContent = 'GL>' + projectName.substring(20);
        let goalDescription = 'Automated Goal: ' + projectName.substring(20);
        let updatedGoalDescription = 'New Automated Goal Description' + projectName.substring(20);
        cy.addGoal(goalContent).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
        }).then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAddNewGoalFromPool).click();
            cy.get(threatListViewSelector.globalDropDownList).contains(goalContent).click();
        }).then(() => {
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                ($inputField) => $inputField.val() === goalDescription,
                { delay: 1000 });
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).click();
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(updatedGoalDescription),
                ($inputField) => $inputField.val() === updatedGoalDescription,
                { delay: 1000 });
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewSnackbar).should('include.text', 'Cybersecurity goal updated successfully!');
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).should('contain', updatedGoalDescription);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
            cy.get(threatListViewSelector.threatListShowFilterButton).click();
            cy.get(threatListViewSelector.filterByGoalAndClaimButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.cybersecurityFilterContent).should('contain', updatedGoalDescription);
        }).then(() => {
            cy.foldThreat(threatRow);
        })
    })

    it('Verify the updated claims are visible in "Cybersecurity Goal & Claim" window (MAIN-TC-629)', () => {
        let threatRow = 2;
        let claimContent = 'CLM>' + projectName.substring(20);
        let claimDescription = 'Automated Claim: ' + projectName.substring(20);
        let updatedClaimDescription = 'New Automated Claim Description' + projectName.substring(20);
        cy.addClaim(claimContent).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
        }).then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'retain');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 1).last().click({ force: true });//1st add goal, 2nd add control
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAddNewClaimFromPool).click();
            cy.get(threatListViewSelector.globalDropDownList).contains(claimContent).click();
        }).then(() => {
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddClaimDialogDescription).clear().type(claimDescription),
                ($inputField) => $inputField.val() === claimDescription,
                { delay: 1000 });
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).last().click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimDescription).click();
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(updatedClaimDescription),
                ($inputField) => $inputField.val() === updatedClaimDescription,
                { delay: 1000 });
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewSnackbar).should('include.text', 'Cybersecurity claim updated successfully!');
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).should('contain', updatedClaimDescription);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
            cy.get(threatListViewSelector.threatListShowFilterButton).click();
            cy.get(threatListViewSelector.filterByGoalAndClaimButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.cybersecurityFilterContent).should('contain', updatedClaimDescription);
        }).then(() => {
            cy.foldThreat(threatRow);
        })
    })

    it('Verify the user shall not be able to add duplicate goals/claims in goal library (MAIN-TC-1712)', () => {
        let goalName = 'GL>' + projectName.substring(20);
        let claimName = 'CLM>' + projectName.substring(20);
        cy.createGoalInLibrary(goalName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library');
        }).then(() => {
            cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click();
        }).then(() => {
            cy.wait(2000);
            cy.get(projectLibrarySelector.projectLibraryCreateNewButton).click();
        }).then(() => {
            recurse(
                () => cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).last().clear().type(goalName),
                ($inputField) => $inputField.val() === goalName,
                { delay: 1000 });
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
            cy.get(navBarSelector.notificationSnackBar).should('include.text', 'Duplicating goals is not allowed.');
            cy.get(navBarSelector.confirmDialogueCancelButton).click();
        }).then(() => {
            cy.addClaimToLibrary(claimName);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library');
        }).then(() => {
            cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click();
        }).then(() => {
            cy.get(projectLibrarySelector.cybersecurityClaimTab).click();
            cy.wait(2000);
        }).then(() => {
            cy.get(projectLibrarySelector.projectLibraryCreateNewButton).click();
        }).then(() => {
            recurse(
                () => cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).last().clear().type(claimName),
                ($inputField) => $inputField.val() === claimName,
                { delay: 1000 });
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
            cy.get(navBarSelector.notificationSnackBar).should('include.text', 'Duplicating claims is not allowed.');
            cy.get(navBarSelector.confirmDialogueCancelButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.deleteGoalFromLibrary(goalName);
        }).then(() => {
            cy.wait(1000);
            cy.deleteClaimFromLibrary(claimName);
        })
    })

    it('Verify user cannot add empty claims in Cybersecurity claim tab (MAIN-TC-336, MAIN-TC-123)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            cy.get(navBarSelector.loader).should('not.exist');
            cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click();
        }).then(() => {
            cy.get(cybersecurityPoolSelector.claimPoolAddNewClaimButton).click();
        }).then(() => {
            cy.get(cybersecurityPoolSelector.addNewDialogContentTextArea).clear();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).should('not.be.enabled');
        }).then(() => {
            cy.get(cybersecurityPoolSelector.cybersecurityPoolAddFromLibraryParagraph).click();
        }).then(() => {
            cy.get(cybersecurityPoolSelector.claimPoolAddClaimSearchInput).clear();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).should('not.be.enabled');
        })
    })

    it('Verify the deleted claims are not visible in "Cybersecurity Goal & Claim" filter window (MAIN-TC-617)', () => {
        let claimName = 'CLM>' + projectName.substring(20);
        cy.addClaim(claimName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
            cy.get(threatListViewSelector.threatListShowFilterButton).click();
            cy.get(threatListViewSelector.filterByGoalAndClaimButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.cybersecurityFilterContent).should('contain', claimName);
        }).then(() => {
            cy.deleteClaim(claimName);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
            cy.get(threatListViewSelector.threatListShowFilterButton).click();
            cy.get(threatListViewSelector.filterByGoalAndClaimButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.cybersecurityFilterContent).should('not.contain', claimName);
        })
    })

    it('Verify the deleted goals are not visible in "Cybersecurity Goal & Claim" filter window (MAIN-TC-625)', () => {
        let goalName = 'GL>' + projectName.substring(20);
        cy.addGoal(goalName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
            cy.wait(2000);
        }).then(() => {
            cy.get(threatListViewSelector.threatListShowFilterButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.filterByGoalAndClaimButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.cybersecurityFilterContent).should('contain', goalName);
        }).then(() => {
            cy.deleteGoal(goalName);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
            cy.get(threatListViewSelector.threatListShowFilterButton).click();
            cy.get(threatListViewSelector.filterByGoalAndClaimButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.cybersecurityFilterContent).should('not.contain', goalName);
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