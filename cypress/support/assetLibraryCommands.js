const assetLibrarySelector = require('../selectors/assetLibrarySelector.js');
const projectLibrarySelector = require("../selectors/projectLibrarySelector");
import { recurse } from 'cypress-recurse'

Cypress.Commands.add('createNewAsset', (assetName, assetType, subType, tagName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
        cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
        cy.wait(2000);
        cy.get(assetLibrarySelector.createNewAssetButton).click();
    }).then(() => {
        recurse(() =>
            cy.get(assetLibrarySelector.assetNameFieldBox).click().clear().type(assetName),
            ($inputField) => $inputField.val() === assetName,
            { delay: 1000 })
            .should('have.value', assetName);
    }).then(() => {
        cy.get(assetLibrarySelector.assetTypeFieldButton).click();
        cy.get(assetLibrarySelector.globalDropDownOption).contains(assetType).click();
    }).then(() => {
        recurse(() =>
            cy.get(assetLibrarySelector.tagsFieldBox).last().clear().type(tagName),
            ($inputField) => $inputField.val() === tagName,
            { delay: 1000 })
            .should('have.value', tagName);
    }).then(() => {
        cy.get(assetLibrarySelector.newAssetDialogConfirmButton).click();
    }).then(() => {
        cy.get(assetLibrarySelector.snackBarMessage).should('include.text' , 'New asset created!');
    })
})

Cypress.Commands.add('refreshAssetButton', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page 
        cy.wait(2000);
        cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
    }).then(() => {
        cy.get(assetLibrarySelector.assetLibraryRefreshButton).should('exist').click();
        cy.get(assetLibrarySelector.assetLoaderIcon).should('exist');
    })
})

Cypress.Commands.add('showAllAssetButton', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page 
        cy.wait(2000);
        cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
    }).then(() => {
        cy.get(assetLibrarySelector.assetLibraryLoadMoreButton).should('exist').click();
        cy.get(assetLibrarySelector.assetLoaderIcon).should('exist');
    })
})

Cypress.Commands.add('searchAssetBox', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {  // Go to Library Page 
        cy.wait(2000);
        cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
    }).then(() => {
        recurse(() =>
            cy.get(assetLibrarySelector.assetLibrarySearchBox).clear().type('Test'),
            ($inputField) => $inputField.val() === 'Test',
            { delay: 1000 })
            .should('have.value', 'Test');
    })
})

Cypress.Commands.add('deleteAsset', (assetName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {  // Go to Library Page 
        cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click({ force: true });  // Go to Asset tab
        cy.wait(2000);
    }).then(() => { 
        let indexOfRecord = 0;
        cy.get(assetLibrarySelector.assetNameContentTextArea).each(($element) => {
            if ($element.val() === assetName) {
                cy.get(assetLibrarySelector.globalDeleteButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(assetLibrarySelector.globalDeleteButton).should('exist').last().click();
            cy.wait(2000);
        }).then(() => {
            cy.get(assetLibrarySelector.snackBarMessage).should('include.text' , 'Asset successfully deleted!')
        })
    })
})
