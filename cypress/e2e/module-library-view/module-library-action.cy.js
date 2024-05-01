const moduleLibrarySelector = require('../../selectors/moduleLibrarySelector.js');
const navBarSelector = require("../../selectors/navBarSelector.js");
import { recurse } from 'cypress-recurse';
var projectName;

describe('Module Library Action', () => {
    var projectId;
    var moduleName;
    var moduleCategory;
    var moduleCategoryName;
    var moduleSearch;
    var featureName;
    var featureRole;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            moduleName = 'Automated Module: ' + $generatedName.substring(20);
            moduleCategory = 'Medical';
            moduleSearch = 'Medical';
            featureName = 'Anti-Slip Regulation';
            featureRole = 'Data Generator';
            moduleCategoryName = 'Automation_Test';
            cy.createProject(projectName);
        })
        cy.window().then((win) => {
            const newDesignData = JSON.parse(win.localStorage.getItem('newDesign'));
            expect(newDesignData).to.not.be.null;
            expect(newDesignData.project).to.not.be.undefined;
            // Extract the project ID from the nested structure
            projectId = newDesignData.project.id;//projectId to be used 
            expect(projectId).to.not.be.undefined;
            cy.log("Project ID is: " + projectId);
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify adding a new module name (MAIN-TC-446, MAIN-TC-445)', () => {
        cy.createNewModule(moduleName, moduleCategory);
    })

    it('Verify the working of "Commit All Modules" (MAIN-TC-453)', () => {
        cy.commitAllModules();
    })

    it('Verify the search operation in Available Modules search box (MAIN-TC-468)', () => {
        cy.searchModuleBox(moduleSearch);
    })

    it('Verify the working "X" button in "Edit/Delete module features" (MAIN-TC-482)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
            cy.wait(2000);
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
                cy.get(moduleLibrarySelector.closeEditModuleFeatureDialogButton).should('exist').click();
            })
        })
    })

    it('Verify the Edit Module Features for the Feature Role (MAIN-TC-480)', () => {
        cy.editModuleFeature(moduleName, featureName, featureRole);
    })

    it('Verify the Commit Module after adding the new module name (MAIN-TC-470)', () => {
        cy.commitModule(moduleName);
    })

    it('Verify the newly added Module Category should show in Category selection of Available Modules (MAIN-TC-456, MAIN-TC-455, MAIN-TC-452, MAIN-TC-457, MAIN-TC-454, MAIN-TC-460)', () => {
        cy.addModuleCategory(moduleCategoryName);
    })

    it('Verify that if User clicked on "Delete Module" button in Module tab in library page a Confirmation box appears (MAIN-TC-2798, MAIN-TC-476, MAIN-TC-477, MAIN-TC-478)', () => {
        cy.deleteModule(moduleName);
    })

    it('Verify the working of "Show All" button and module category is properly updated (MAIN-TC-439, MAIN-TC-461, MAIN-TC-463, MAIN-TC-464)', () => {
        let oldCategoryName = 'Before_' + projectName.substring(20);
        let newCategoryName = 'After_' + projectName.substring(20);
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
            cy.get(moduleLibrarySelector.moduleLibraryShowAllButton).click();
        }).then(() => {
            cy.get(moduleLibrarySelector.refreshModulesLoader).should('not.exist')
        }).then(() => {
            cy.get(navBarSelector.subsequentSnackBarElement)
                .should('be.visible')
                .and('include.text', 'All')
                .and('include.text', 'modules in your component library are shown');
        }).then(() => {
            cy.addModuleCategory(oldCategoryName);
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleNameCancelButton).click({ force: true })
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleArrowDropdownButton).click();
        }).then(() => {
            cy.get(moduleLibrarySelector.editModuleCategoryButton).click();
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleCategoryNameInputField).each(($category) => {
                if ($category.val() === oldCategoryName) {
                    recurse(() =>
                        cy.get($category).clear().type(newCategoryName),
                        ($inputField) => $inputField.val() === newCategoryName,
                        { delay: 1000 })
                    return false;
                }
            }).then(() => {
                cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Category has been updated');
            }).then(() => {
                cy.get(moduleLibrarySelector.moduleLibraryPageCategoryTextArea).first().click();
            }).then(() => {
                cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(newCategoryName).should('exist');
            })
        })
    })
})

describe('CLEANUP: Project Deletion', () => {
    it('Deleting The Project If Created', () => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.deleteProject(projectName);
        })
    })
})