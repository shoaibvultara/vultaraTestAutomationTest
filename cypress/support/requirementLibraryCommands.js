const requirementPoolSelector = require('../selectors/requirementPoolSelector.js');
const projectLibrarySelector = require('../selectors/projectLibrarySelector.js');
import { recurse } from 'cypress-recurse'


Cypress.Commands.add('createNewRequirement', (descriptionName, requirementType, requirementDiscipline) => {
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
                cy.get(requirementPoolSelector.newReqDialogDescriptionTextArea).should('exist');
                recurse(() => 
                  cy.get(requirementPoolSelector.newReqDialogDescriptionTextArea).clear().type(descriptionName),
                  ($inputField) => $inputField.val() === descriptionName,
                  { delay: 1000 })
                  .should('have.value', descriptionName).then(() => {
                    cy.get(requirementPoolSelector.newReqDialogConfirmButton).click().then(() => {
                      cy.get(requirementPoolSelector.newReqDialogSnackBar).should('include.text','Requirement added successfully');
                    })
                  })
              })
            })
          })
      })
    })
})

Cypress.Commands.add('requirementRefreshButton', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
      cy.wait(1000);
      cy.get(projectLibrarySelector.librarySideNavRequirementAnchor).click();  // Redirects to Requirement Page
      cy.get(requirementPoolSelector.requirementLibraryRefreshButton).should('exist').click().then(() => {
        cy.get(requirementPoolSelector.requirementLibraryRefreshLoader).should('exist');
      })
    })
})

Cypress.Commands.add('requirementShowAllButton', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
      cy.wait(1000);
      cy.get(projectLibrarySelector.librarySideNavRequirementAnchor).click();  // Redirects to Requirement Page
      cy.get(requirementPoolSelector.requirementLibraryShowAllButton).should('exist').click().then(() => {
        cy.get(requirementPoolSelector.requirementLibraryRefreshLoader).should('exist');
      })
  })
})

Cypress.Commands.add('requirementSearchBox', (descriptionName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
      cy.wait(1000);
      cy.get(projectLibrarySelector.librarySideNavRequirementAnchor).click().then(() => {  // Redirects to Requirement Page
        cy.get(requirementPoolSelector.requirementLibrarySearchBox).should('exist');
        recurse(() => 
          cy.get(requirementPoolSelector.requirementLibrarySearchBox).clear().type(descriptionName),
          ($inputField) => $inputField.val() === descriptionName,
          { delay: 1000 })
          .should('have.value', descriptionName)
      })
    })
})

Cypress.Commands.add('requirementDeleteIcon', (descriptionName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
      cy.wait(1000);
      cy.get(projectLibrarySelector.librarySideNavRequirementAnchor).click().then(() => {  // Redirects to Requirement Page
        let indexOfRecord = 0;
        cy.get(requirementPoolSelector.requirementContentTextArea).each(($element) => {
            if ($element.val() === descriptionName) {
                cy.get(requirementPoolSelector.requirementLibraryDeleteIcon).eq(indexOfRecord).click({ force: true });
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
          cy.get(requirementPoolSelector.requirementLibraryConfirmToDeleteButton).click().then(() => {
            cy.get(requirementPoolSelector.newReqDialogSnackBar).should('contain' , 'requirement has been deleted successfully!')
          })
        })
      })
    })
})