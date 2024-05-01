const navBarSelector = require('../../selectors/navBarSelector.js')
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
const projectLibrarySelector = require('../../selectors/projectLibrarySelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
import { recurse } from 'cypress-recurse'
var projectName;

describe('Cybersecurity Pools Display In Threat List View', () => {
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

    it('Verify goal dialog box in threat list should be empty initially (MAIN-TC-373, MAIN-TC-1719)', () => {
        let threatRow = 1;
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.saveAsNewThreat(threatRow);
        }).then(() => {
            threatRow += 2;
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon).should('have.length', 2);//1st add goal, 2nd add control
            cy.get(threatListViewSelector.threatListViewExpandedRecordId).should('not.exist');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('contain','Notes:');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('contain','Cybersecurity Goal:');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('contain','Cybersecurity Control:');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('contain','Others:');
        }).then(() => {
            cy.foldThreat(threatRow);
        })
    })

    it('Verify when risk treatment value is "retain" or "share" the expanded row shall have "Notes" , "Cybersecurity Claim" and "Others" containers (MAIN-TC-1720)', () => {
        let threatRow = 1;
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.changeThreatTreatment(threatRow, 'retain');
        }).then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('contain','Notes:');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('contain','Cybersecurity Claim:');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('contain','Others:');
        }).then(() => {
            cy.foldThreat(threatRow);
        })
    })

    it('Verify when risk treatment value is "no treatment" or "avoid" the expanded row shall have "Notes" and "Others" (MAIN-TC-1718)', () => {
        let threatRow = 3;
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.changeThreatTreatment(threatRow, 'avoid');
        }).then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('contain','Notes:');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('contain','Others:');
        }).then(() => {
            cy.foldThreat(threatRow);
        })
    })

    it('Verify when you click on "Filter by goal and claim" of filter in Threat list view, a dialogue box is opened containing all the claims and goals (MAIN-TC-718, MAIN-TC-719)', () => {
        let goalName = 'GL>' + projectName.substring(20);
        let claimName = 'CLM>' + projectName.substring(20);
        cy.addGoal(goalName).then(() => {
            cy.addClaim(claimName);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
        }).then(() => {
            cy.get(threatListViewSelector.threatListShowFilterButton).click();
            cy.get(threatListViewSelector.filterByGoalAndClaimButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.cybersecurityFilterContent).should('contain', goalName).and('contain', claimName); 
        })
    })

    it('Verify when the reviewed check box is checked, the threat row is highlighted in yellow (MAIN-TC-1555)', () => {
        let threatRow = 4;
        var positionOfCheckbox = (threatRow) * 2 + (threatRow - 1);
        cy.reviewThreat(threatRow).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
        }).then(() => {
            cy.wait(1000);
            cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(positionOfCheckbox).parents('tr').should('have.css', 'background-color', 'rgba(252, 244, 214, 0.5)');
        })
    })

    it('Verify when the user press show all button while using the search filter then it should not mix up the list of the goals/claims (MAIN-TC-815)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => {
            cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click();
            cy.get(projectLibrarySelector.cybersecurityGoalTab).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(cybersecurityPoolSelector.searchForGoalLibraryBox).click()
        }).then(() => {
            recurse(
                () => cy.get(cybersecurityPoolSelector.searchForGoalLibraryBox).clear().type('test'),
                ($inputField) => $inputField.val() === 'test',
                { delay: 1000 })
                .should('have.value', 'test');
        }).then(() => {
            cy.wait(1000);
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).its('length').then((length) => {
                let goalRowCount = length;
                cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('have.length', goalRowCount);
            }).then(() => {
                cy.get(cybersecurityPoolSelector.cybersecurityShowAllButton).click();
            }).then(() => {
                cy.wait(2000);
                cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).its('length').then((length) => {
                    let allGoalRowCount = length;
                    cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('have.length', allGoalRowCount)
                }).then(() => {
                    cy.visit(Cypress.env('baseURL') + '/library');
                }).then(() => {
                    cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click();
                }).then(() => {
                    cy.get(projectLibrarySelector.cybersecurityClaimTab).click();
                    cy.wait(1000);
                    cy.get(cybersecurityPoolSelector.searchForClaimLibraryBox).click();
                }).then(() => {
                    recurse(
                    () => cy.get(cybersecurityPoolSelector.searchForClaimLibraryBox).clear().type('claim'),
                    ($inputField) => $inputField.val() === 'claim',
                    { delay: 1000 })
                    .should('have.value', 'claim')
                }).then(() => {
                    cy.wait(1000);
                    cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).its('length').then((length) => {
                        let claimRowCount = length;
                        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('have.length', claimRowCount)
                    }).then(() => {
                        cy.get(cybersecurityPoolSelector.cybersecurityShowAllButton).click();
                    }).then(() => {       
                        cy.wait(2000);
                        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).its('length').then((length) => {
                            let allClaimRowCount = length;
                            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('have.length', allClaimRowCount);
                        })
                    })
                })
            })
        })
    })

    it('Duplicate goals (MAIN-TC-225)', () => {
        let threatRow = 2;
        let goalName = 'TC-225: ' + projectName;
        cy.createGoalInLibrary(goalName).then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.wait(1000);
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon).first().click({ force: true });
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAddClaimDialogSelectField).last().click();
            cy.get(threatListViewSelector.globalDropDownList).contains('Search in library').click();
        }).then(() => {
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddNewGoalSearchInput).clear().type(goalName),
                ($inputField) => $inputField.val() === goalName,
                { delay: 1000 })
                .should('have.value', goalName);
        }).then(() => {
            cy.wait(1000);
            cy.get(threatListViewSelector.globalDropDownList).first().click();
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalName).should('be.visible');
        }).then(() => {
            cy.wait(1000);
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon).first().click({ force: true });
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAddClaimDialogSelectField).last().click();
            cy.get(threatListViewSelector.globalDropDownList).contains('Search in library').click();
        }).then(() => {
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddNewGoalSearchInput).clear().type(goalName),
                ($inputField) => $inputField.val() === goalName,
                { delay: 1000 })
                .should('have.value', goalName);
        }).then(() => {
            cy.wait(1000);
            cy.get(threatListViewSelector.globalDropDownList).first().click();
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Duplicating goals is not allowed.');
            cy.get(navBarSelector.dialogCloseIcon).click();
        }).then(() => {
            cy.foldThreat(threatRow);
        }).then(() => {
            cy.deleteGoalFromLibrary(goalName);
        })
    })

    it('Verify the "search in library" button functionality (MAIN-TC-370)', () => {
        let threatRow = 1;
        let claimName = 'MAIN-TC-370';
        cy.addClaimToLibrary(claimName).then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.wait(1000);
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon).first().click({ force: true });
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAddClaimDialogSelectField).last().click();
            cy.get(threatListViewSelector.globalDropDownList).contains('Search in library').click();
        }).then(() => {
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddNewGoalSearchInput).clear().type(claimName),
                ($inputField) => $inputField.val() === claimName,
                { delay: 1000 })
                .should('have.value', claimName);
        }).then(() => {
            cy.wait(1000);
            cy.get(threatListViewSelector.globalDropDownList).should('include.text', claimName);
            cy.get(navBarSelector.dialogCloseIcon).click();
        }).then(() => {
            cy.foldThreat(threatRow);
        }).then(() => {
            cy.deleteClaimFromLibrary(claimName);
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