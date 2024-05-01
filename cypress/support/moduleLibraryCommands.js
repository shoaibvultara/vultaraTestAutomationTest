const moduleLibrarySelector = require('../selectors/moduleLibrarySelector.js')
const projectLibrarySelector = require('../selectors/projectLibrarySelector.js') 
const navBarSelector = require('../selectors/navBarSelector.js')
import { recurse } from 'cypress-recurse'

Cypress.Commands.add('createNewModule', (moduleName, moduleCategory) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.get(projectLibrarySelector.librarySideNavModuleAnchor).click();
        cy.wait(1000);
    }).then(() => {
        cy.get(moduleLibrarySelector.createNewModuleButton).should('exist').click();
        cy.get(moduleLibrarySelector.moduleNameDialogText).should('be.visible');
    }).then(() => {
        cy.get(moduleLibrarySelector.moduleNameDialogCategoryFieldButton).should('exist').click();
        cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(moduleCategory).click();
    }).then(() => {
        recurse(() =>
            cy.get(moduleLibrarySelector.moduleNameTextAreaField).should('exist').click().type(moduleName),
            ($inputField) => $inputField.val() === moduleName,
            { delay: 1000 })
            .should('have.value', moduleName);
    }).then(() => {
        cy.get(moduleLibrarySelector.moduleNameConfirmButton).click();
        cy.get(moduleLibrarySelector.moduleSnackBar).should('include.text', ' New Module successfully created');
    })
})

Cypress.Commands.add('addModuleCategory', (moduleCategoryName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.get(moduleLibrarySelector.moduleArrowDropdownButton).should('exist').click();
        cy.wait(1000);
    }).then(() => {
        cy.get(moduleLibrarySelector.editModuleCategoryButton).should('exist').click();
        cy.get(moduleLibrarySelector.moduleCategoryDialogText).should('be.visible');
    }).then(() => {
        cy.get(moduleLibrarySelector.addNewCategoryButton).first().click();
        cy.get(moduleLibrarySelector.moduleCategoryDisabledConfirmButton).should('be.disabled');
    }).then(() => {
        recurse(() =>
            cy.get(moduleLibrarySelector.moduleCategoryTextArea).eq(1).click().type(moduleCategoryName),
            ($inputField) => $inputField.val() === moduleCategoryName,
            { delay: 1000 })
            .should('have.value', moduleCategoryName);
    }).then(() => {
        cy.get(moduleLibrarySelector.moduleCategoryConfirmButton).click();
        cy.wait(2000);
        cy.get(moduleLibrarySelector.createNewModuleButton).should('exist').click();
    }).then(() => {
        cy.get(moduleLibrarySelector.moduleNameDialogText).should('be.visible');
        cy.get(moduleLibrarySelector.moduleNameDialogCategoryFieldButton).should('exist').click();
        cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(moduleCategoryName);
    })
})

Cypress.Commands.add('deleteModuleCategory', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.get(moduleLibrarySelector.moduleArrowDropdownButton).should('exist').click();
        cy.wait(1000);
    }).then(() => {
        cy.get(moduleLibrarySelector.editModuleCategoryButton).should('exist').click();
    }).then(() => {
        cy.get(moduleLibrarySelector.moduleCategoryDialogText).should('be.visible');
        cy.get(moduleLibrarySelector.deleteCategoryButton).first().click();
    }).then(() => {
        cy.get(moduleLibrarySelector.moduleCategoryConfirmButton).click();
    })
})

Cypress.Commands.add('commitAllModules', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.get(moduleLibrarySelector.moduleArrowDropdownButton).should('exist').click();
        cy.wait(1000);
    }).then(() => {
        cy.get(moduleLibrarySelector.commitAllModulesButton).should('exist').click();
        cy.wait(2000);
    }).then(() => {
        cy.get(moduleLibrarySelector.moduleSnackBar).should('include.text', ' Module database updated! Refresh to see changes.');
    })
})

Cypress.Commands.add('refreshModuleButton', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.wait(2000);
        cy.get(moduleLibrarySelector.moduleLibraryRefreshButton).should('exist').click();
        cy.get(moduleLibrarySelector.refreshModulesLoader).should('exist')
    })
})

Cypress.Commands.add('showAllModuleButton', () => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.wait(2000);
        cy.get(moduleLibrarySelector.moduleLibraryShowAllButton).should('exist').click();
        cy.get(moduleLibrarySelector.refreshModulesLoader).should('exist');
    })
})

Cypress.Commands.add('searchModuleBox', (moduleSearch) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        recurse(() =>
            cy.get(moduleLibrarySelector.moduleLibrarySearchBox).click().clear().type(moduleSearch),
            ($inputField) => $inputField.val() === moduleSearch,
            { delay: 1000 })
            .should('have.value', moduleSearch);
    }).then(() => {
        cy.wait(1000);
    })
})

Cypress.Commands.add('deleteModule', (moduleName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.wait(2000);
        cy.get(projectLibrarySelector.librarySideNavModuleAnchor).click();
    }).then(() => {
        let indexOfRecord = 0;
        cy.get(navBarSelector.circleProgressSpinner).should('not.exist');
        cy.get(moduleLibrarySelector.moduleNameContentTextArea).each(($element) => {
            if ($element.val() === moduleName) {
                cy.get(moduleLibrarySelector.moduleMoreOptionsButton).eq(indexOfRecord).click({ force: true });
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(moduleLibrarySelector.deleteModuleButton).should('exist').click();
            cy.get(moduleLibrarySelector.confirmToDeleteDialogText).should('be.visible');
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleLibraryConfirmToDeleteButton).click();
            cy.get(moduleLibrarySelector.moduleSnackBar).should('include.text', ' Module successfully deleted!');
        })
    })
})

Cypress.Commands.add('editModuleFeature', (moduleName, featureName, featureRole) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.wait(2000);
        cy.get(projectLibrarySelector.librarySideNavModuleAnchor).click();
    }).then(() => {
        let indexOfRecord = 0;
        cy.get(moduleLibrarySelector.moduleNameContentTextArea).each(($element) => {
            if ($element.val() === moduleName) {
                cy.get(moduleLibrarySelector.moduleMoreOptionsButton).eq(indexOfRecord).click({ force: true });
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(moduleLibrarySelector.editModuleFeaturesButton).should('exist').click();
            cy.get(moduleLibrarySelector.applyNewFeatureButton).click();
        }).then(() => {
            cy.get(moduleLibrarySelector.featureNameFieldButton).click();
            cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(featureName).click();
        }).then(() => {
            cy.get(moduleLibrarySelector.featureRoleFieldButton).click();
            cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(featureRole).click();
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleFeatureMoreOptionsButton).should('exist').click({ force: true });
            cy.wait(1000);
            cy.get(moduleLibrarySelector.confirmFeatureButton).click();
            cy.get(moduleLibrarySelector.confirmFeatureSnackBar).should('include.text', ' Feature added successfully.');
        })
    })
})

Cypress.Commands.add('commitModule', (moduleName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.wait(2000);
        let indexOfRecord = 0;
        cy.get(moduleLibrarySelector.moduleNameContentTextArea).each(($element) => {
            if ($element.val() === moduleName) {
                cy.get(moduleLibrarySelector.moduleMoreOptionsButton).eq(indexOfRecord).click({ force: true });
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(moduleLibrarySelector.commitModuleButton).should('exist').click();
            cy.get(moduleLibrarySelector.commitModuleSnackBar).should('include.text', ' Module database updated!');
        })
    })
})

Cypress.Commands.add('updateModuleName', (moduleName, moduleNewName) => {
    cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
        cy.wait(2000);
        cy.get(projectLibrarySelector.librarySideNavModuleAnchor).click();
        let indexOfRecord = 0;
        cy.get(moduleLibrarySelector.moduleNameContentTextArea).each(($element) => {
            if ($element.val() === moduleName) {
                recurse(() =>
                    cy.get(moduleLibrarySelector.moduleNameContentTextArea).eq(indexOfRecord).clear().type(moduleNewName),
                    ($inputField) => $inputField.val() === moduleNewName,
                    { delay: 1000 })
                return false;// to exist from the .each() loop
            }
            indexOfRecord++;
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleMoreOptionsButton).eq(indexOfRecord).click({ force: true });
        }).then(() => {
            cy.get(moduleLibrarySelector.commitModuleButton).should('be.visible').click();
            cy.get(moduleLibrarySelector.commitModuleSnackBar).should('include.text', ' Module database updated!');
        })
    })
})