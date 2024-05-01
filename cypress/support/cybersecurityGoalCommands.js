import "@4tw/cypress-drag-drop";
import "cypress-real-events/support";
import "cypress-localstorage-commands";
import "cypress-log-to-output";
import { recurse } from 'cypress-recurse'

const navBarSelector = require('../selectors/navBarSelector.js');
const cybersecurityPoolSelector = require('../selectors/cybersecurityPoolSelector.js');
const projectLibrarySelector = require('../selectors/projectLibrarySelector.js');
const cybersecurityGoalSelector = require('../selectors/cybersecurityGoalSelector.js');

Cypress.Commands.add("addGoal", (goalContent) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
        cy.get(cybersecurityPoolSelector.goalPoolGoalPoolTabDiv).click().then(() => {
            cy.get(cybersecurityPoolSelector.goalPoolAddNewGoalButton).click().then(() => {
                recurse(
                    () => cy.get(cybersecurityPoolSelector.addNewDialogContentTextArea).clear().type(goalContent),
                    ($inputField) => $inputField.val() === goalContent,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                    cy.wait(1000);
                })
            })
        })
    })
});

Cypress.Commands.add("deleteGoal", (goalContent) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
        cy.get(cybersecurityPoolSelector.goalPoolGoalPoolTabDiv).click().then(() => {
            cy.wait(2000);
            let indexOfRecord = 0;
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
                if ($element.val() === goalContent) {
                    cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.wait(1000);
                cy.get(cybersecurityPoolSelector.goalPoolDeleteGoalButton).click();
            }).then(() => {
                cy.get(navBarSelector.confirmDialogueDeleteButton).last().click();
            }).then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'goal deleted successfully.');
                cy.wait(1000);
            })
        })
    })
});

Cypress.Commands.add("createGoalInLibrary", (goalName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click().then(() => {
            cy.get(projectLibrarySelector.projectLibraryCreateNewButton).click().then(() => {
                recurse(
                    () => cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).last().clear().type(goalName),
                    ($inputField) => $inputField.val() === goalName,
                    { delay: 1000 }
                )
            })
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
            cy.wait(1000);
        })
    })
});

Cypress.Commands.add("ImportGoalFromLibrary", (controlName) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
        cy.get(cybersecurityPoolSelector.goalPoolAddNewGoalButton).click().then(() => {
            cy.get(cybersecurityPoolSelector.cybersecurityPoolAddFromLibraryParagraph).click();
            recurse(
                () => cy.get(cybersecurityPoolSelector.goalPoolAddGoalSearchInput).clear().type(controlName),
                ($inputField) => $inputField.val() === controlName,
                { delay: 1000 }
            ).then(() => {
                cy.get(cybersecurityPoolSelector.cybersecurityPoolListOption).should('have.length', 1).then(() => {
                    cy.get(cybersecurityPoolSelector.cybersecurityPoolListOption).should('include.text', controlName).click();
                });
            })
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        })
    })
});

Cypress.Commands.add("deleteGoalFromLibrary", (goalName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click({ force: true }).then(() => {
            cy.get(projectLibrarySelector.cybersecurityGoalTab).click();
            cy.wait(2000);
            let indexOfRecord = 0;
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
                if ($element.val() === goalName) {
                    cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.get(projectLibrarySelector.moreOptionsDeleteGoalButton).click().then(() => {
                    cy.get(navBarSelector.confirmDialogueDeleteButton).last().click({ force: true });
                    cy.get(navBarSelector.notificationSnackBar).should('include.text', 'This goal has been deleted from the library successfully');
                    cy.wait(1000);
                })
            })
        })
    })
})

Cypress.Commands.add("updateGoal", (goal) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
        cy.get(navBarSelector.loader).should('not.exist');
        cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).eq(goal.row).click().then(() => {
            recurse(
                () => cy.get(cybersecurityPoolSelector.addNewDialogContentTextArea).clear().type(goal.newGoalContent),
                ($inputField) => $inputField.val() === goal.newGoalContent,
                { delay: 1000 }
            ).then(() => {
                cy.get(navBarSelector.confirmDialogueConfirmButton).click().then(() => {
                    cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'goal has been updated successfully');
                })
            })
        })
    })
})

Cypress.Commands.add("addGoalToLibrary", (goalName) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
        cy.get(navBarSelector.loader).should('not.exist');
        let indexOfRecord = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
            if ($element.val() === goalName) {
                cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.intercept('POST', Cypress.env('apiURL') + '/projects/cybersecurityGoalsLibrary*').as('postRequest');
            cy.get(cybersecurityGoalSelector.goalDropDownAddGoalToLibraryOption).click();
            cy.get(navBarSelector.subsequentSnackBarElement).should('exist').then((snackbar) => {
                cy.get(snackbar).should('include.text', 'goal has been updated successfully');
                cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            })
        })
    })
})