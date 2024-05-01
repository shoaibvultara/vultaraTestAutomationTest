const systemConfigSelector = require("../selectors/systemConfigSelector");
import { recurse } from 'cypress-recurse';


Cypress.Commands.add('createCustomField' , (customFieldName, customFieldCategory, customFieldType) => {
    cy.visit(Cypress.env('baseURL') + '/systemConfig').then(() => { // Go to System Config Page
        cy.get(systemConfigSelector.systemConfigSideNavCustomFieldAnchor).click();
        cy.wait(1000);
        cy.get(systemConfigSelector.createCustomFieldButton).click();
    }).then(() => {
        cy.get(systemConfigSelector.addCustomFieldTextDialog).should('be.visible');
        cy.get(systemConfigSelector.addCustomNameField).should('exist');
        recurse(() =>
            cy.get(systemConfigSelector.addCustomNameField).clear().type(customFieldName),
            ($inputField) => $inputField.val() === customFieldName,
            { delay: 1000 })
            .should('have.value', customFieldName);
    }).then(() => {
        cy.get(systemConfigSelector.addCustomCategoryField).click();
        cy.get(systemConfigSelector.globalDropDownListOption).contains(customFieldCategory).click();
    }).then(() => {
        cy.get(systemConfigSelector.addCustomTypeField).click();
        cy.get(systemConfigSelector.globalDropDownListOption).contains(customFieldType).click();
    }).then(() => {
        cy.get(systemConfigSelector.customFieldDialogConfirmButton).click();
        cy.wait(1000);
    })
})

Cypress.Commands.add('deleteCustomField' , () => {
    cy.visit(Cypress.env('baseURL') + '/systemConfig').then(() => { // Go to System Config Page
        cy.get(systemConfigSelector.systemConfigSideNavCustomFieldAnchor).click();
        cy.wait(1000);
    }).then(() => {
        cy.get(systemConfigSelector.systemConfigDeleteIcon).first().click();
    }).then(() => {
        cy.get(systemConfigSelector.confirmToDeleteTextDialog).should('exist');
        cy.get(systemConfigSelector.confirmToDeleteButton).click();
        cy.wait(1000);
    })
})