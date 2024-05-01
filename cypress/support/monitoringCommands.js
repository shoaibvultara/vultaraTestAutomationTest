import "@4tw/cypress-drag-drop";
import "cypress-real-events/support";
import "cypress-localstorage-commands";
import "cypress-log-to-output";
const navBarSelector = require('../selectors/navBarSelector.js');
const monitoringPageSelector = require('../selectors/monitoringPageSelector.js');
const projectTriggerSelector = require('../selectors/projectTriggerSelector.js');
import { recurse } from 'cypress-recurse';

Cypress.Commands.add("addNewInformation", (contentSummary) => {
    cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => {
        cy.get(projectTriggerSelector.activeListTab).click();
    }).then(() => {
        cy.get(monitoringPageSelector.monitoringAddNewInfoButton).click();
        cy.wait(1000);
    }).then(() => {
        recurse(() =>
            cy.get(monitoringPageSelector.addNewInfoDialogContentTextArea).click({ force: true }).clear().type(contentSummary),
            ($inputField) => $inputField.val() === contentSummary,
            { delay: 1000 })
            .should('have.value', contentSummary);
    }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
    })
})