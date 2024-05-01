import "@4tw/cypress-drag-drop";
import "cypress-real-events/support";
import "cypress-localstorage-commands";
import "cypress-log-to-output";
import 'cypress-file-upload';
import { recurse } from 'cypress-recurse'
const navBarSelector = require('../selectors/navBarSelector.js')
const projectBomSelector = require('../selectors/projectBomSelector.js')

Cypress.Commands.add("addNewBom", (bom) => {
    cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
        cy.get(projectBomSelector.projectBomAddNewBomButton).should('exist').click();
    }).then(() => {
        recurse(
            () => cy.get(projectBomSelector.addNewBomFormVersionInput).clear().type(bom.version),
            ($inputField) => $inputField.val() === bom.version,
            { delay: 1000 });
    }).then(() => {
        recurse(
            () => cy.get(projectBomSelector.addNewBomDialogProductInput).clear().type(bom.product),
            ($inputField) => $inputField.val() === bom.product,
            { delay: 1000 });
    }).then(() => {
        recurse(
            () => cy.get(projectBomSelector.addNewBomDialogVendorInput).clear().type(bom.vendor),
            ($inputField) => $inputField.val() === bom.vendor,
            { delay: 1000 });
    }).then(() => {
        cy.get(projectBomSelector.addNewBomDialogPartSelect).click();
    }).then(() => {
        cy.get(projectBomSelector.addNewBomDialogPartOption).contains(bom.part).click();
    }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();//confirm bom dialog inputs
        cy.wait(1000);
    })
})

Cypress.Commands.add("deleteBom", (bomRow) => {
    cy.get(projectBomSelector.projectBomMoreActionsButton).eq(bomRow - 1).click();
    cy.get(projectBomSelector.moreActionsButtonDeleteBomButton).click();
    cy.intercept('DELETE', '*').as('deleteRequest');
    cy.get(projectBomSelector.deletionDialogDeleteButton).click();
    cy.get('@deleteRequest').its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add("duplicateBom", (bomRow) => {
    cy.get(projectBomSelector.projectBomMoreActionsButton).eq(bomRow - 1).click();
    cy.intercept('POST', Cypress.env('apiURL') + '/bom*').as('postRequest');
    cy.get(projectBomSelector.moreActionsButtonDuplicateBomButton).click();
    cy.get('@postRequest').its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add("searchBom", (searchKey) => {
    cy.get(projectBomSelector.projectBomSearchAvailableBomInput).click().clear().type(searchKey);
});

Cypress.Commands.add("clearSearchBomInput", () => {
    cy.get(projectBomSelector.projectBomSearchAvailableBomInput).click().clear();
});

Cypress.Commands.add("addBomFromMicroLibrary", (bom, filterOption) => {
    cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
        cy.get(projectBomSelector.projectBomAddFromMicroLibraryButton).should('exist').click();
    }).then(() => {
        cy.wait(1000);
        cy.get(projectBomSelector.addFromMicroLibraryFilterOption).should('exist');
    }).then(() => {
        recurse(() =>
            cy.get(projectBomSelector.addFromMicroLibraryFilterOption).clear().type(filterOption),
            ($inputField) => $inputField.val() === filterOption,
            { delay: 1000 })
            .should('have.value', filterOption);
    }).then(() => {
        cy.wait(1000);
        cy.get(projectBomSelector.addFromMicroLibraryFilterListOption).contains(filterOption).should('be.visible').click();
    }).then(() => {
        cy.get(projectBomSelector.addNewBomFormVersionInput).should('exist');
        recurse(() =>
            cy.get(projectBomSelector.addNewBomFormVersionInput).clear().type(bom.version),
            ($inputField) => $inputField.val() === bom.version,
            { delay: 1000 })
            .should('have.value', bom.version);
    }).then(() => {
        cy.get(projectBomSelector.addNewBomDialogConfirmButton).click();
    })
});

Cypress.Commands.add("importBom", (bom) => {
    cy.get(projectBomSelector.projectBomImportBomButton).click();
    cy.get(projectBomSelector.importBomDialogChooseFileButton).as('fileInput');
    cy.fixture(bom.filePath).then(fileContent => {
        cy.get('@fileInput').attachFile({
            fileContent: fileContent.toString(),
            fileName: bom.fileName
        });
    });
    cy.contains(bom.fileName);
    cy.get(projectBomSelector.importBomDialogNextButton).click();
    cy.get(projectBomSelector.addNewBomFormVersionInput).type(bom.version, { force: true });

    cy.get(projectBomSelector.importBomDialogVultaraFieldSelect).eq(bom.partFieldRow).click();
    cy.get(projectBomSelector.importBomDialogVultaraFieldPartOption).click();

    cy.get(projectBomSelector.importBomDialogVultaraFieldSelect).eq(bom.vendorFieldRow).click();
    cy.get(projectBomSelector.importBomDialogVultaraFieldVendorOption).first().click();//two options, vendor and vendor Id

    cy.get(projectBomSelector.importBomDialogVultaraFieldSelect).eq(bom.productFieldRow).click();
    cy.get(projectBomSelector.importBomDialogVultaraFieldProductOption).first().click();

    cy.intercept('POST', Cypress.env('apiURL') + '/*').as('postRequest');
    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
    cy.get('@postRequest').its('response.statusCode').should('eq', 200);
});