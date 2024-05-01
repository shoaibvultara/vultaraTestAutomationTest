const featureLibrarySelector = require("../selectors/featureLibrarySelector");
const projectLibrarySelector = require("../selectors/projectLibrarySelector");
const navBarSelector = require("../selectors/navBarSelector");
import { recurse } from 'cypress-recurse'

Cypress.Commands.add('createNewFeature', (featureName, assetName, featureType) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
        cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
        cy.wait(2000);
        cy.get(featureLibrarySelector.createNewFeatureButton).click();
    }).then(() => {
        recurse(() =>
            cy.get(featureLibrarySelector.featureNameFieldBox).clear().type(featureName),
            ($inputField) => $inputField.val() === featureName,
            { delay: 1000 })
            .should('have.value', featureName);
    }).then(() => {
        cy.get(featureLibrarySelector.featureTypeFieldButton).click();
        cy.get(featureLibrarySelector.globalDropDownOptionList).contains(featureType).click();
    }).then(() => {
        cy.get(featureLibrarySelector.showAssetLibraryButton).click();
        cy.get(featureLibrarySelector.assetChipDialog).contains(assetName).click();
    }).then(() => {
        cy.get(featureLibrarySelector.addToFeatureButton).should('exist').click();
        cy.get(featureLibrarySelector.featureAssetDialog).should('be.visible').contains(assetName);
    }).then(() => {
        cy.get(featureLibrarySelector.createFeatureButton).should('be.enabled').click();
        cy.wait(2000);
        cy.get(featureLibrarySelector.createNewFeatureSnackBar).should('include.text', 'New feature successfully created!')
    })
})

Cypress.Commands.add('refreshFeatureButton', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page 
        cy.wait(1000);
        cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
    }).then(() => {
        cy.get(featureLibrarySelector.featureLibraryRefreshButton).should('exist').click();
        cy.get(featureLibrarySelector.featureLoaderIcon).should('exist');
    })
})

Cypress.Commands.add('showAllFeatureButton', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page 
        cy.wait(1000);
        cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
    }).then(() => {
        cy.get(featureLibrarySelector.featureLibraryShowAllButton).should('exist').click();
        cy.get(featureLibrarySelector.featureLoaderIcon).should('exist');
    })
})

Cypress.Commands.add('searchFeatureBox', (searchKey) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
        cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();
    }).then(() => {
        recurse(() =>
            cy.get(featureLibrarySelector.featureLibrarySearchBox).clear().type(searchKey),
            ($inputField) => $inputField.val() === searchKey,
            { delay: 1000 }
        ).should('have.value', searchKey);
    })
})

Cypress.Commands.add('deleteFeature', (featureName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page 
        cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
        cy.wait(2000);
    }).then(() => {
        let indexOfRecord = 0;
        cy.get(featureLibrarySelector.featureContentTextArea).each(($element) => {
            if ($element.text() == featureName) {
                cy.get(featureLibrarySelector.editFeatureButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(featureLibrarySelector.deleteFeatureButton).should('exist').click();
            cy.get(featureLibrarySelector.featureLibraryConfirmToDeleteButton).click();
            cy.get(featureLibrarySelector.deleteFeatureSnackBar).should('include.text', 'Feature successfully deleted')
        })
    })
})

Cypress.Commands.add('linkWithModule', (featureName, featureRole, moduleName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page 
        cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();
    }).then(() => {  // Go to Feature tab
        let indexOfRecord = 0;
        cy.get(featureLibrarySelector.featureContentTextArea).each(($element) => {
            if ($element.text() === featureName) {
                cy.get(featureLibrarySelector.editFeatureButton).eq(indexOfRecord).click();
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.wait(2000);
            cy.get(featureLibrarySelector.addApplicationButton).click();
        }).then(() => {
            cy.get(featureLibrarySelector.confirmChangesButton).should('not.be.enabled');
        }).then(() => {
            cy.get(featureLibrarySelector.featureApplicationModuleFieldButton).last().should('exist').click();
            cy.get(featureLibrarySelector.globalDropDownOptionList).contains(moduleName).click();
        }).then(() => {
            cy.get(featureLibrarySelector.featureApplicationFeatureRoleFieldButton).click();
            cy.get(featureLibrarySelector.globalDropDownOptionList).contains(featureRole).click();
        }).then(() => {
            cy.get(featureLibrarySelector.confirmChangesButton).click();
            cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Feature sucessfully updated!');
        })
    })
})