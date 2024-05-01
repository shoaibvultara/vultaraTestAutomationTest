import '@4tw/cypress-drag-drop';
import "cypress-real-events/support";
import "cypress-localstorage-commands";
import 'cypress-log-to-output';
const navBarSelector = require('../selectors/navBarSelector.js');
const threatListViewSelector = require('../selectors/threatListViewSelector.js');

Cypress.Commands.add('deleteThreat', (deletionType, threatRow) => {
    cy.visit(Cypress.env('baseURL') + '/threats'); // Go to Threats Page
    cy.wait(1000);
    cy.get(threatListViewSelector.threatListViewThreatActionsButton).eq(threatRow - 1).click({ force: true });//the row of the targeted threat(0 based)
    cy.get(threatListViewSelector.dropDownActionsDeleteButton).click({ force: true });
    switch (deletionType) {
        case "permanent":
            cy.get(threatListViewSelector.confirmDialogDeletePermanentlyButton).click();
            cy.wait(1000);
            cy.get(threatListViewSelector.threatListViewSnackbar).should('include.text', 'deleted permanently');
            break;
        case "temporary":
            cy.get(threatListViewSelector.confirmDialogDeleteTemporarilyButton).click();
            cy.wait(1000);
            cy.get(threatListViewSelector.threatListViewSnackbar).should('include.text', 'deleted temporarily');
            break;
    }
})

Cypress.Commands.add('addNewThreat', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => { // Go to Threats Page
        cy.get(threatListViewSelector.threatListViewThreatActionsButton).first().scrollIntoView().should('be.visible').click().then(() => {
            cy.get(threatListViewSelector.dropDownActionsAddNewThreatButton).click().then(() => {
                cy.get(threatListViewSelector.threatListViewSnackbar).should('include.text', 'added successfully');
            })
        })
    })
})

Cypress.Commands.add('saveAsNewThreat', (threatRow) => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => { // Go to Threats Page
        cy.get(threatListViewSelector.threatListViewThreatActionsButton).eq(threatRow - 1).click().then(() => {//the row of the targeted threat(0 based)
            cy.get(threatListViewSelector.dropDownActionsSaveAsNewThreatButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewSnackbar).should('include.text', 'added successfully');
        })
    })
})

Cypress.Commands.add('highlightThreat', (threatRow) => {
    cy.visit(Cypress.env('baseURL') + '/threats'); // Go to Threats Page
    cy.wait(1000);
    cy.get(threatListViewSelector.threatListViewThreatActionsButton).eq(threatRow - 1).click();//the row of the targeted threat(0 based)
    cy.get(threatListViewSelector.dropDownActionsHighlightThreatButton).click();
    cy.get(threatListViewSelector.threatListViewThreatActionsButton).eq(threatRow - 1)
        .parent().should('have.css', 'background-color').and('eq', 'rgba(255, 99, 71, 0.2)');//color of parent td, ie. outer cell
})

Cypress.Commands.add('threatHistory', (threatRow) => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {// Go to Threats Page
        cy.get(threatListViewSelector.threatListViewThreatActionsButton).should('exist');
        cy.get(threatListViewSelector.threatListViewThreatActionsButton).eq(threatRow - 1).click();//the row of the targeted threat(0 based)
        cy.get(threatListViewSelector.dropDownActionsThreatHistoryButton).click().then(() => {
            cy.get(threatListViewSelector.threatHistoryDialog).should('exist');
        })
    })
})

Cypress.Commands.add('editThreatScenario', (threatRow, newScenario) => {
    cy.visit(Cypress.env('baseURL') + '/threats'); // Go to Threats Page
    cy.wait(1000);
    //the row of the targeted threat(0 based)
    cy.get(threatListViewSelector.threatListViewThreatScenarioTextArea).eq(threatRow - 1).click().clear().type(newScenario);//clear old, write new
    cy.intercept('PATCH', Cypress.env('apiURL') + '/projects/threatsDb*').as('patchRequest');
    cy.get(threatListViewSelector.threatScenarioCheckCircleIcon).click();
    cy.get('@patchRequest').its('response.statusCode').should('eq', 200);
})

Cypress.Commands.add('changeFeasibilityMethod', (feasibilityMethod) => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => { // Go to Threats Page
        cy.get(navBarSelector.navBarProfileButton).click().then(() => {
            cy.get(navBarSelector.profileListProjectButton).click()
        }).then(() => {
            cy.get(navBarSelector.circleProgressSpinner).should('exist').then(() => {//wait for spinner to appear
                cy.get(navBarSelector.circleProgressSpinner).should('not.exist')//wait for spinner to finish loading
                cy.get(threatListViewSelector.threatListViewFeasibilityMethodSelect).click().then(() => {
                    switch (feasibilityMethod) {
                        case 'potential':
                            cy.get(threatListViewSelector.feasibilityMethodAttackPotentialOption).click();
                            break;
                        case 'vector':
                            cy.get(threatListViewSelector.feasibilityMethodAttackVectorOption).click();
                            break;
                    }
                })
            })
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click().then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Project information is successfully updated.')
            })
        })
    })
})

Cypress.Commands.add('reviewThreat', (threatRow) => {
    cy.visit(Cypress.env('baseURL') + '/threats'); // Go to Threats Page
    cy.wait(1000);
    //every row has 3 checkboxes and review is the second, plus one checkbox above the table, 0 based counting
    var positionOfCheckbox = (threatRow) * 2 + (threatRow - 1);
    cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(positionOfCheckbox).check();//become ready
    cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(positionOfCheckbox)
        .parent().next().should('include.text', 'Ready');//get label of the checkbox input element by parent div
    cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(positionOfCheckbox).check();//become yes
    cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(positionOfCheckbox)
        .parent().next().should('include.text', 'Yes');//get label of the checkbox input element by parent div
})

Cypress.Commands.add('validateThreat', (threatRow) => {
    cy.visit(Cypress.env('baseURL') + '/threats'); // Go to Threats Page
    cy.wait(1000);
    //every row has 3 checkboxes and review is the third, 0 based counting
    var positionOfCheckbox = (threatRow) * 3;
    cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(positionOfCheckbox).check();//become yes
    cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(positionOfCheckbox)
        .parent().next().should('include.text', 'Yes');//get label of the checkbox input element by parent div
})

Cypress.Commands.add('changeThreatTreatment', (threatRow, treatment) => {// Go to Threats Page
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
        cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).eq(threatRow - 1).click();//row of targeted threat, 0 based
    }).then(() => {
        switch (treatment) {
            case "reduce":
                cy.get(threatListViewSelector.threatTreatmentReduceOption).click();
                break;
            case "retain":
                cy.get(threatListViewSelector.threatTreatmentRetainOption).click();
                break;
            case "avoid":
                cy.get(threatListViewSelector.threatTreatmentAvoidOption).click();
                break;
            case "share":
                cy.get(threatListViewSelector.threatTreatmentShareOption).click();
                break;
            default:
                cy.get(threatListViewSelector.threatTreatmentNoTreatmentOption).click();
                treatment = 'no treatment';//to assert later
        }
    }).then(() => {
        cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).eq(threatRow - 1).should('include.text', treatment);
    })
})

Cypress.Commands.add('selectThreat', (threatRow) => {
    cy.visit(Cypress.env('baseURL') + '/threats'); // Go to Threats Page
    cy.wait(1000);
    //every row has 3 checkboxes and review is the first, 0 based counting
    var positionOfCheckbox = (threatRow) * 2 + (threatRow - 2);
    cy.get(threatListViewSelector.threatListViewThreatCheckBoxInput).eq(positionOfCheckbox).check();
    cy.get(threatListViewSelector.threatListViewSelectedNotiationSpan).should('exist');
})

Cypress.Commands.add('expandThreat', (threatRow) => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => { // Go to Threats Page
        cy.get(threatListViewSelector.threatListViewExpandThreatIcon).eq(threatRow - 1).click({ force: true });//row of targeted threat, 0 based
    }).then(() => {
        cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).scrollIntoView().should('be.visible');
    })
})

Cypress.Commands.add('foldThreat', (threatRow) => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => { // Go to Threats Page
        cy.get(threatListViewSelector.threatListViewExpandThreatIcon).eq(threatRow - 1).click({ force: true });//row of targeted threat, 0 based
    }).then(() => {
        cy.get(threatListViewSelector.threatListViewExpandedThreatDiv).should('not.exist');
    })
})

Cypress.Commands.add('mapThreatListToWP29', (option) => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => { // Go to Threats Page
        cy.get(navBarSelector.loader).should('not.exist')
        cy.get(navBarSelector.navBarEditButton).click();
    }).then(() => {
        cy.get(navBarSelector.editListMapThreatListToWP29Button).click().then(() => {
            for (let index = 0; index < 4; index++) {
                cy.get(threatListViewSelector.mapThreatToWP29DialogYesButton).click();
                cy.wait(100);
            }
            cy.get(threatListViewSelector.mapThreatToWP29DialogNextButton).click();
            for (let index = 0; index < 5; index++) {
                cy.get(threatListViewSelector.mapThreatToWP29DialogYesButton).click();
                cy.wait(100);
            }
            cy.get(threatListViewSelector.mapThreatToWP29DialogDoneButton).click();
            for (let index = 0; index < 2; index++) {
                cy.get(threatListViewSelector.mapThreatToWP29DialogYesButton).click();
                cy.wait(100);
            }
            cy.get(threatListViewSelector.mapThreatToWP29DialogDoneButton).click();
            cy.get(threatListViewSelector.mapThreatToWP29DialogAcknowledgeButton).click();
        })
    })
})

Cypress.Commands.add('deleteHighlightedThreat', (option) => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => { // Go to Threats Page
        const threatCount = Cypress.$(threatListViewSelector.threatListViewThreatActionsButton).length;
        for (let index = 0; index < threatCount; index++) {
            cy.get(threatListViewSelector.threatListViewThreatActionsButton).eq(index).click().then(() => {
                if (Cypress.$(threatListViewSelector.dropDownActionsRemoveHighlightButton).length > 0) {
                    cy.get(threatListViewSelector.dropDownActionsDeleteButton).click().then(() => {
                        cy.get(threatListViewSelector.confirmDialogDeletePermanentlyButton).click().then(() => {
                            cy.get(threatListViewSelector.threatListViewSnackbar).should('include.text', 'deleted permanently');
                        })
                    })
                }
                else {
                    cy.get(threatListViewSelector.threatListViewThreatActionsButton).eq(index).click({ force: true });
                }
            })
        }
    })
})