const requirementPoolSelector = require('../selectors/requirementPoolSelector.js');
import { recurse } from 'cypress-recurse'
require('@4tw/cypress-drag-drop')


Cypress.Commands.add('addNewRequirement', (descriptionName, requirementType, requirementDiscipline, requirementPhase) => {
    cy.visit(Cypress.env('baseURL') + '/requirements').then(() => { // Go to Requirements Pool Page
        cy.wait(2000);
        cy.get(requirementPoolSelector.requirementPoolAddNewButton).click({force: true}).then(() => { 
            cy.get(requirementPoolSelector.newReqDialogDescriptionTypeInput).click();
            cy.get(requirementPoolSelector.newReqDialogNextButton).click().then(() => {
                cy.get(requirementPoolSelector.newReqDialogTypeFieldButton).click();
                cy.get(requirementPoolSelector.globalDropDownOptionList).contains(requirementType).click().then(() => {
                    cy.get(requirementPoolSelector.newReqDialogDisciplineFieldButton).click();
                    cy.get(requirementPoolSelector.globalDropDownOptionList).contains(requirementDiscipline).click().then(() => {
                        cy.get(requirementPoolSelector.newReqDialogPhaseFieldButton).click();
                        cy.get(requirementPoolSelector.globalDropDownOptionList).contains(requirementPhase).click();
                        cy.get(requirementPoolSelector.newReqDialogStyleFieldButton).should('exist').then(() => {
                            cy.get(requirementPoolSelector.newReqDialogDescriptionTextArea).should('exist')
                            recurse(() => 
                                cy.get(requirementPoolSelector.newReqDialogDescriptionTextArea).clear().type(descriptionName),
                                ($inputField) => $inputField.val() === descriptionName,
                                { delay: 1000 })
                                .should('have.value', descriptionName).then(() => {
                                    cy.get(requirementPoolSelector.newReqDialogConfirmButton).click();
                                    cy.wait(1000);
                                })
                        })
                    })
                })
            })
        })
    })
})

Cypress.Commands.add('addNewRequirementFromLibrary', () => {
    cy.visit(Cypress.env('baseURL') + '/requirements').then(() => { // Go to Requirements Pool Page
        cy.wait(2000);
        cy.get(requirementPoolSelector.requirementPoolAddNewButton).click({force: true});
        cy.get(requirementPoolSelector.addFromLibraryButton).click().then(() => {
            recurse( () => 
                cy.get(requirementPoolSelector.addRequirementFromLibrarySearchBox).click().clear().type('Test'),
                ($inputField) => $inputField.val() === 'Test',
                { delay: 1000 })
                .should('have.value', 'Test').then(() => {
                    cy.wait(2000);
                    cy.get(requirementPoolSelector.globalDropDownOptionList).first().should('be.visible').click();
                    cy.get(requirementPoolSelector.addRequirementFromLibraryConfirmButton).click().then(() => {
                        cy.get(requirementPoolSelector.newReqDialogSnackBar).should('include.text','Requirement added successfully');
                    })
                })
        })
    })
})

Cypress.Commands.add('addNewRequirementToLibrary', (descriptionName) => {
    cy.visit(Cypress.env('baseURL') + '/requirements').then(() => { // Go to Requirements Pool Page
        cy.wait(2000);
        let indexOfRecord = 0;
        cy.get(requirementPoolSelector.requirementContentTextArea).each(($element) => {
            if ($element.val() === descriptionName) {
                cy.get(requirementPoolSelector.requirementPoolMoreOptionsButton).eq(indexOfRecord).click({ force: true });
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(requirementPoolSelector.addRequirementToLibraryButton).click();
            cy.get(requirementPoolSelector.addRequirementToLibraryConfirmButton).click().then(() => {
                cy.get(requirementPoolSelector.newReqDialogSnackBar).should('include.text','Requirement added to the library successfully');
            })
        })
    })
})

Cypress.Commands.add('deleteRequirement', (descriptionName) => {
    cy.visit(Cypress.env('baseURL') + '/requirements').then(() => { // Go to Requirements Pool Page
        cy.wait(2000);
        let indexOfRecord = 0;
        cy.get(requirementPoolSelector.requirementContentTextArea).each(($element) => {
            if ($element.val() === descriptionName) {
                cy.get(requirementPoolSelector.requirementPoolMoreOptionsButton).eq(indexOfRecord).click({ force: true });
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(requirementPoolSelector.deleteRequirementButton).click();
            cy.get(requirementPoolSelector.deleteRequirementConfirmToDeleteButton).click().then(() => {
                cy.get(requirementPoolSelector.deleteRequirementSnackBar).should('include.text','Requirement has been deleted successfully!');
            })
        })
    })
})