import "@4tw/cypress-drag-drop";
import "cypress-real-events/support";
import "cypress-localstorage-commands";
import "cypress-log-to-output";
import { recurse } from 'cypress-recurse'

const navBarSelector = require('../selectors/navBarSelector.js')
const cybersecurityPoolSelector = require('../selectors/cybersecurityPoolSelector.js')
const projectLibrarySelector = require('../selectors/projectLibrarySelector.js');
const requirementPoolSelector = require('../selectors/requirementPoolSelector.js');
const cybersecurityGoalSelector = require('../selectors/cybersecurityGoalSelector.js');

Cypress.Commands.add("addClaim", (claimContent) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
        cy.get(navBarSelector.loader).should('not.exist');
        cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click();
    }).then(() => {
        cy.get(cybersecurityPoolSelector.claimPoolAddNewClaimButton).click();
    }).then(() => {
        recurse(
            () => cy.get(cybersecurityPoolSelector.addNewDialogContentTextArea).clear().type(claimContent),
            ($inputField) => $inputField.val() === claimContent,
            { delay: 1000 })
    }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
    }).then(() => {
        cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Cybersecurity claim saved successfully!');
        cy.wait(1000);
    })
})

Cypress.Commands.add("addClaimToLibrary", (claimName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click();
    }).then(() => {
        cy.get(projectLibrarySelector.cybersecurityClaimTab).click();
        cy.wait(2000);
        cy.get(projectLibrarySelector.projectLibraryCreateNewButton).click();
    }).then(() => {
        recurse(
            () => cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).last().clear().type(claimName),
            ($inputField) => $inputField.val() === claimName,
            { delay: 1000 })
    }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        cy.wait(1000);
    })
})

Cypress.Commands.add("addClaimFromLibrary", (claimName) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
        cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click();
    }).then(() => {
        cy.get(cybersecurityPoolSelector.claimPoolAddNewClaimButton).click();
    }).then(() => {
        cy.get(cybersecurityPoolSelector.cybersecurityPoolAddFromLibraryParagraph).click();
        recurse(
            () => cy.get(cybersecurityPoolSelector.claimPoolAddClaimSearchInput).clear().type(claimName),
            ($inputField) => $inputField.val() === claimName,
            { delay: 1000 });
    }).then(() => {
        cy.get(cybersecurityPoolSelector.cybersecurityPoolListOption).contains(claimName).click();
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
    }).then(() => {
        cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Cybersecurity claim saved successfully!');
        cy.wait(1000);
    })
})

Cypress.Commands.add("deleteClaim", (claimName) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
        cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click();
        cy.wait(2000);
    }).then(() => {
        let indexOfRecord = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
            if ($element.val() === claimName) {
                cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.wait(1000);
            cy.get(cybersecurityPoolSelector.claimPoolDeleteClaimButton).click();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueDeleteButton).last().click();
        }).then(() => {
            cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'claim deleted successfully.');
            cy.wait(1000);
        })
    })
})

Cypress.Commands.add("addControl", (controlContent) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-control').then(() => {
        cy.get(cybersecurityPoolSelector.controlPoolAddNewControlButton).click();
    }).then(() => {
        recurse(
            () => cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).last().clear().type(controlContent),
            ($inputField) => $inputField.val() === controlContent,
            { delay: 1000 })
    }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
    })
})

Cypress.Commands.add("addControlToLibrary", (controlName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavControlAnchor).click({ force: true });
    }).then(() => {
        cy.get(navBarSelector.loader).should('not.exist');
        cy.get(projectLibrarySelector.projectLibraryCreateNewButton).click();
    }).then(() => {
        recurse(
            () => cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).last().clear().type(controlName),
            ($inputField) => $inputField.val() === controlName,
            { delay: 1000 })
    }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
    })
})

Cypress.Commands.add("ImportControlFromLibrary", (controlName) => {
    cy.visit(Cypress.env('baseURL') + '/cybersecurity-control').then(() => {
        cy.get(cybersecurityPoolSelector.controlPoolAddNewControlButton).click({ force: true });
    }).then(() => {
        cy.get(cybersecurityPoolSelector.cybersecurityPoolAddFromLibraryParagraph).click();
    }).then(() => {
        recurse(
            () => cy.get(cybersecurityPoolSelector.controlPoolAddControlSearchInput).clear().type(controlName),
            ($inputField) => $inputField.val() === controlName,
            { delay: 1000 })
    }).then(() => {
        cy.get(cybersecurityPoolSelector.cybersecurityPoolListOption).should('have.length', 1);
    }).then(() => {
        cy.get(cybersecurityPoolSelector.cybersecurityPoolListOption).should('include.text', controlName);
    }).then(() => {
        cy.get(cybersecurityPoolSelector.cybersecurityPoolListOption).click();
    }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
    })
})

Cypress.Commands.add("addRequirementToLibrary", (requirementName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavRequirementAnchor).click({ force: true });
    }).then(() => {
        cy.get(projectLibrarySelector.projectLibraryCreateNewButton).click({ force: true });
    }).then(() => {
        cy.get(requirementPoolSelector.newReqDialogDescriptionTypeInput).click();
    }).then(() => {
        cy.get(requirementPoolSelector.newReqDialogNextButton).click();
        recurse(
            () => cy.get(requirementPoolSelector.newReqDialogDescriptionTextArea).clear().type(requirementName),
            ($inputField) => $inputField.val() === requirementName,
            { delay: 1000 })
    }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        cy.wait(2000);
    })
})

Cypress.Commands.add("addRequirement", (requirementName) => {
    cy.visit(Cypress.env('baseURL') + '/requirements').then(() => {
        cy.get(requirementPoolSelector.requirementPoolAddNewButton).click();
    }).then(() => {
        cy.get(requirementPoolSelector.newReqDialogDescriptionTypeInput).click();
    }).then(() => {
        cy.get(requirementPoolSelector.newReqDialogNextButton).click();
        recurse(
            () => cy.get(requirementPoolSelector.newReqDialogDescriptionTextArea).clear().type(requirementName),
            ($inputField) => $inputField.val() === requirementName,
            { delay: 1000 })
    }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
    })
})

Cypress.Commands.add("linkRequirementToControl", (controlName, requirementName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavControlAnchor).click({ force: true });
    }).then(() => {
        cy.get(navBarSelector.circleProgressSpinner).should('not.exist');
        //loop over controls to get the recently created one using its name
        let indexOfRecord = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
            if ($element.val() === controlName) {
                cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(projectLibrarySelector.moreOptionsLinkedRequirementsButton).click();
        })
        let recordLengthBeforeLinkDialog = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).then(($elementList) => {
            recordLengthBeforeLinkDialog = $elementList.length;
        })
        cy.get(projectLibrarySelector.linkingDialogShowAllButton).click().then(() => {
            //loop over requirements to get the recently created one using its name
            indexOfRecord = 0;
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
                if ($element.val() === requirementName) {
                    indexOfRecord -= recordLengthBeforeLinkDialog;// start counting after removing text areas not in the linking dialog
                    cy.get(projectLibrarySelector.linkingDialogCheckboxInput).eq(indexOfRecord).check();
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.get(navBarSelector.confirmDialogueConfirmButton).click();
            })
        })
    })
})

Cypress.Commands.add("linkControlToGoal", (goalName, controlName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click({ force: true });
    }).then(() => {
        //loop over requirements to get the recently created one using its name
        let indexOfRecord = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
            if ($element.val() === goalName) {
                cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(projectLibrarySelector.moreOptionsLinkedControlsButton).click();
        })
        let recordLengthBeforeLinkDialog = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).then(($elementList) => {
            recordLengthBeforeLinkDialog = $elementList.length;
        })
        cy.get(cybersecurityGoalSelector.searchControlBox).click();
        recurse(() =>
            cy.get(cybersecurityGoalSelector.searchControlBox).clear().type(controlName),
            ($inputField) => $inputField.val() === controlName,
            { delay: 1000 })
            .should('have.value', controlName)
    }).then(() => {
        cy.get(cybersecurityGoalSelector.globalDropDownList).contains(controlName).click();
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        cy.wait(1000);
    }).then(() => {
        //assert linked control exist
        let indexOfRecord = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
            if ($element.val() === goalName) {
                cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(projectLibrarySelector.moreOptionsLinkedControlsButton).click();
            cy.get(navBarSelector.loader).should('not.exist');
        }).then(() => {
            let controlChipName = controlName.substring(0, 20);
            cy.get(cybersecurityGoalSelector.linkedControlChip).should('include.text', controlChipName);
        })
    })
})

Cypress.Commands.add("deleteControlFromLibrary", (controlName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavControlAnchor).click({ force: true });
    }).then(() => {
        let indexOfRecord = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
            if ($element.val() === controlName) {
                cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click({ force: true });
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(projectLibrarySelector.moreOptionsDeleteControlButton).click();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueDeleteButton).last().click({ force: true });
        })
    })
})

Cypress.Commands.add("deleteRequirementFromLibrary", (requirementName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavRequirementAnchor).click({ force: true });
    }).then(() => {
        let indexOfRecord = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
            if ($element.val() === requirementName) {
                cy.get(projectLibrarySelector.requirementLibraryDeleteButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueDeleteButton).click({ force: true });
            cy.get(navBarSelector.notificationSnackBar).should('include.text', 'requirement has been deleted successfully!');
        })
    })
})

Cypress.Commands.add("deleteClaimFromLibrary", (claimName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click({ force: true });
    }).then(() => {
        cy.get(projectLibrarySelector.cybersecurityClaimTab).click();
        cy.wait(2000);
    }).then(() => {
        let indexOfRecord = 0;
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
            if ($element.val() === claimName) {
                cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(projectLibrarySelector.moreOptionsDeleteClaimButton).click();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueDeleteButton).last().click({ force: true });
            cy.wait(1000);
        })
    })
})