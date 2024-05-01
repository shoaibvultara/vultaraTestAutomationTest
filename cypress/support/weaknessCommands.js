const weaknessSelector = require("../selectors/weaknessSelector");
const navBarSelector = require('../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse';

  Cypress.Commands.add('addNewWeakness', (weakness, weaknessDescription) => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.get(weaknessSelector.addNewWeaknessButton).click();
      cy.wait(2000);
    }).then(() => {
      cy.get(weaknessSelector.weaknessResponsibleFieldButton).click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).contains(weakness.responsibleUser).click();
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessIdentificationMethodFieldBox).clear().type(weakness.identificationMethod),
        ($inputField) => $inputField.val() === weakness.identificationMethod,
        { delay: 1000 })
        .should('have.value', weakness.identificationMethod);
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessSourceNotesFieldBox).clear().type(weakness.sourceNotes),
        ($inputField) => $inputField.val() === weakness.sourceNotes,
        { delay: 1000 })
        .should('have.value', weakness.sourceNotes);
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessSourceNotesLinkFieldBox).clear().type(weakness.sourceNotesLink),
        ($inputField) => $inputField.val() === weakness.sourceNotesLink,
        { delay: 1000 })
        .should('have.value', weakness.sourceNotesLink);
    }).then(() => {
      cy.get(weaknessSelector.weaknessComponentFieldButton).click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).contains(weakness.component).click();
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessAttackSurfaceFieldBox).clear().type(weakness.attackSurface),
        ($inputField) => $inputField.val() === weakness.attackSurface,
        { delay: 1000 })
        .should('have.value', weakness.attackSurface);
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessAssetFieldBox).clear().type(weakness.asset),
        ($inputField) => $inputField.val() === weakness.asset,
        { delay: 1000 })
        .should('have.value', weakness.asset);
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessDescriptionFieldBox).clear().type(weaknessDescription),
        ($inputField) => $inputField.val() === weaknessDescription,
        { delay: 1000 })
        .should('have.value', weaknessDescription);
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessCweIdFieldBox).clear().type(weakness.cweID),
        ($inputField) => $inputField.val() === weakness.cweID,
        { delay: 1000 })
        .should('have.value', weakness.cweID);
    }).then(() => {
      cy.get(weaknessSelector.weaknessCweWeaknessTypeFieldButton).click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).contains(weakness.cweWeaknessType).click();
    }).then(() => {
      cy.get(weaknessSelector.weaknessCweWeaknessCategoryFieldButton).click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).contains(weakness.cweWeaknessCategory).click();
    }).then(() => {
      cy.get(weaknessSelector.globalConfirmButton).click();
      cy.get(weaknessSelector.snackBarMessage).should('include.text','Weakness added successfully.');
    })
  })

  Cypress.Commands.add('searchForWeaknessInActiveListPage', (weaknessDescription) => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.get(weaknessSelector.weaknessActiveListSearchFieldBox).click();  // Redirects to Weakness Archived List Page
      cy.wait(2000);
    }).then(() => { 
      recurse(() =>
        cy.get(weaknessSelector.weaknessArchivedListSearchFieldBox).clear().type(weaknessDescription),
        ($inputField) => $inputField.val() === weaknessDescription,
        { delay: 1000 })
        .should('have.value', weaknessDescription);
    }).then(() => {
      cy.get(weaknessSelector.weaknessContentTextArea).last().should('include.value', weaknessDescription);
    })
  })

  Cypress.Commands.add('refreshWeaknessActiveListPage', () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.wait(2000);
      cy.get(weaknessSelector.weaknessActiveListRefreshButton).should('exist').click();
    }).then(() => { 
      cy.get(navBarSelector.loader).should('exist');
    })
  })

  Cypress.Commands.add('searchForWeaknessInArchivedListPage', (weaknessDescription) => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.get(weaknessSelector.weaknessArchivedListPageTab).click();  // Redirects to Weakness Archived List Page
      cy.wait(2000);
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessArchivedListSearchFieldBox).clear().type(weaknessDescription),
        ($inputField) => $inputField.val() === weaknessDescription,
        { delay: 1000 })
        .should('have.value', weaknessDescription);
    }).then(() => {
      cy.get(weaknessSelector.weaknessContentTextArea).last().should('include.value', weaknessDescription);
    })
  })

  Cypress.Commands.add('refreshWeaknessArchivedListPage', () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.wait(2000);
      cy.get(weaknessSelector.weaknessArchivedListRefreshButton).should('exist').click();
    }).then(() => {
      cy.get(navBarSelector.loader).should('exist');
    })
  })

  Cypress.Commands.add('deleteWeaknessActiveList' , () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => {  // Go to Weakness Page
      cy.wait(2000);
      cy.get(weaknessSelector.weaknessDropDownActionButton).eq(0).click({ force: true });
    }).then(() => {
      cy.get(weaknessSelector.deleteWeaknessButton).click();
    }).then(() => {
      cy.get(weaknessSelector.confirmToDeleteWeaknessButton).last().click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text','Weakness deleted successfully');
    })
  })

  Cypress.Commands.add('deleteWeaknessArchivedList' , () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.get(weaknessSelector.weaknessArchivedListPageTab).click();  // Redirects to Weakness Archived List Page
      cy.wait(2000);
      cy.get(weaknessSelector.weaknessDropDownActionButton).eq(0).click({ force: true});
    }).then(() => {
      cy.get(weaknessSelector.deleteWeaknessButton).click();
    }).then(() => {
      cy.get(weaknessSelector.confirmToDeleteWeaknessButton).last().click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text','Weakness deleted successfully');
    })
  })

  Cypress.Commands.add('linkWeaknessToEvent' , () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.wait(1000);
      cy.get(weaknessSelector.weaknessDropDownActionButton).eq(0).click({ force: true} );
    }).then(() => {
      cy.get(weaknessSelector.eventLinkingButton).click();
    }).then(() => {
      cy.get(weaknessSelector.globalCheckBox).eq(0).check({ force: true }).should('be.checked');
    }).then(() => {
      cy.get(weaknessSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text','Changes saved successfully');
    })
  }) 

  Cypress.Commands.add('linkWeaknessToVulnerability' , () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.wait(1000);
      cy.get(weaknessSelector.weaknessDropDownActionButton).eq(0).click({ force: true });
    }).then(() => {
      cy.get(weaknessSelector.vulnerabilityLinkingButton).click();
    }).then(() => {
      cy.wait(10000);
      cy.get(weaknessSelector.globalCheckBox).eq(0).check({ force: true }).should('be.checked');
    }).then(() => {
      cy.get(weaknessSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text','Changes saved successfully');
    })
  }) 

  Cypress.Commands.add('highlightWeakness' , () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => {  // Go to Weakness Page
      cy.wait(2000);
      cy.get(weaknessSelector.weaknessDropDownActionButton).eq(0).click({ force: true });
    }).then(() => {
      cy.get(weaknessSelector.highlightWeaknessButton).click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text','Weakness updated successfully');
    })
  }) 