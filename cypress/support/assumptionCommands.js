import "@4tw/cypress-drag-drop";
import "cypress-real-events/support";
import "cypress-localstorage-commands";
import "cypress-log-to-output";
const navBarSelector = require('../selectors/navBarSelector.js');
const assumptionPageSelector = require('../selectors/assumptionPageSelector.js')

Cypress.Commands.add("addNewAssumption", (content) => {
    cy.visit(Cypress.env('baseURL') + '/assumptions');
    cy.wait(1000);
    cy.get(assumptionPageSelector.assumptionAddNewAssumptionButton).click();
    cy.get(assumptionPageSelector.addNewAssumptionDialogContentTextArea).clear().type(content);
    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
});