const navBarSelector = require("../selectors/navBarSelector");
require('cypress-delete-downloads-folder').addCustomCommand();

Cypress.Commands.add('generateExcelReport', () => {
    cy.visit(Cypress.env('baseURL') + '/modeling').then(() => { // Go to Library Page 
        cy.wait(2000);
        cy.get(navBarSelector.navBarExportButton).click();  // Go to Feature tab
        cy.get(navBarSelector.exportListGenerateReportButton).should('exist').click();
        cy.get(navBarSelector.generateReportTextDialog).should('exist');
        cy.get(navBarSelector.generateButton).should('not.be.enabled');
        cy.get(navBarSelector.reportTypeFieldButton).click().then(() => {
            cy.get(navBarSelector.reportTypeDropDownOptionList).contains('Microsoft Excel').click();
            cy.get(navBarSelector.generateButton).should('not.be.enabled');
            cy.get(navBarSelector.optionsCheckBox).first().check().then(() => {
                cy.get(navBarSelector.generateButton).should('be.enabled').click().then(() => {
                    cy.get(navBarSelector.notificationSnackBar).should('include.text', ' Report is generated');
                })
            })
        })
    })
})

Cypress.Commands.add('generateWordReport', () => {
    cy.visit(Cypress.env('baseURL') + '/modeling').then(() => { // Go to Library Page 
        cy.wait(2000);
        cy.get(navBarSelector.navBarExportButton).click();  // Go to Feature tab
        cy.get(navBarSelector.exportListGenerateReportButton).should('exist').click();
        cy.get(navBarSelector.generateReportTextDialog).should('exist');
        cy.get(navBarSelector.generateButton).should('not.be.enabled');
        cy.get(navBarSelector.reportTypeFieldButton).click().then(() => {
            cy.get(navBarSelector.reportTypeDropDownOptionList).contains('Microsoft Word').click();
            cy.get(navBarSelector.generateButton).should('not.be.enabled');
            cy.get(navBarSelector.optionsCheckBox).last().check().then(() => {
                cy.get(navBarSelector.generateButton).should('be.enabled').click().then(() => {
                    cy.intercept('GET', Cypress.env('apiURL') + '/allNotifications*').as('notificationRequest');
                    cy.get(navBarSelector.notificationSnackBar).should('include.text', ' Report creation is in progress.');
                    cy.get(navBarSelector.navBarNotificationButton).click().then(() => {
                        cy.get(navBarSelector.notificationMenuOthersTab).click();
                        cy.get('@notificationRequest', { timeout: 60000 }).should('exist').then(() => {
                            cy.get('@notificationRequest').its('response.statusCode').should('eq', 200);
                            cy.get(navBarSelector.downloadReportMessage).click();
                        })
                    })
                })
            })
        })
    })
})
