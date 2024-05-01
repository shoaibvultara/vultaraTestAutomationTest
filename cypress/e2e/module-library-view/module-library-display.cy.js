const moduleLibrarySelector = require('../../selectors/moduleLibrarySelector.js');
const navBarSelector = require("../../selectors/navBarSelector.js");
const featureLibrarySelector = require("../../selectors/featureLibrarySelector");
import { recurse } from 'cypress-recurse'
var projectName;

describe('Module Library Display', () => {
    var projectId;
    var moduleName;
    var moduleCategory;
    var featureName;
    var featureRole;
    var updatedModuleName;
    var safetyImpact;
    var financialImpact;
    var operationalImpact;
    var privacyImpact;
    var damageScenario;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            moduleName = 'Automated_Module_' + $generatedName.substring(20);
            moduleCategory = 'Medical';
            featureName = 'Anti-Slip Regulation';
            featureRole = 'Data Generator';
            updatedModuleName = 'Updated_Name_' + $generatedName.substring(20);
            safetyImpact = 'Moderate';
            financialImpact = 'Negligible';
            operationalImpact = 'Negligible';
            privacyImpact = 'Moderate';
            damageScenario = 'Automated Damage Scenario Test Description';
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

    it('Verify the updated impacts are displayed correctly in module library tab (MAIN-TC-485, MAIN-TC-447, MAIN-TC-451)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
            cy.createNewModule(moduleName, moduleCategory);
            cy.wait(2000);
            cy.editModuleFeature(moduleName, featureName, featureRole);
        }).then(() => {
            cy.get(moduleLibrarySelector.closeEditModuleFeatureDialogButton).click();
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
                cy.get(moduleLibrarySelector.expandMoreButton).click();
            }).then(() => {
                cy.get(moduleLibrarySelector.safetyImpactFieldBox).click();
                cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(safetyImpact).click();
                recurse(() =>
                    cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(0).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(moduleLibrarySelector.financialImpactFieldBox).click();
                cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(financialImpact).click();
                recurse(() =>
                    cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(1).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(moduleLibrarySelector.operationalImpactFieldBox).click();
                cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(operationalImpact).click();
                recurse(() =>
                    cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(2).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(moduleLibrarySelector.privacyImpactFieldBox).click();
                cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(privacyImpact).click();
                recurse(() =>
                    cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(3).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(moduleLibrarySelector.moduleFeatureMoreOptionsButton).click({ force: true });
                cy.get(moduleLibrarySelector.updateFeatureButton).click();
                cy.get(moduleLibrarySelector.updateFeatureSnackBar).should('include.text', 'Feature updated successfully');
            })
        })
    })

    it('Verify modules are fetched from DB & the updated module name should reflect properly in Module library (MAIN-TC-472, MAIN-TC-26)', () => {
        let tempModuleName = 'TC472' + moduleName.substring(9);
        cy.createNewModule(tempModuleName, moduleCategory).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page (It redirects to Module page by default)
            cy.wait(2000);
        }).then(() => { 
            let indexOfRecord = 0;
            cy.get(moduleLibrarySelector.moduleNameContentTextArea).each(($element) => {
                if ($element.val() === tempModuleName) {
                    recurse(() =>
                        cy.get(moduleLibrarySelector.moduleNameContentTextArea).eq(indexOfRecord).clear().type(updatedModuleName),
                        ($inputField) => $inputField.val() === updatedModuleName,
                        { delay: 1000 }
                    )
                    cy.get(moduleLibrarySelector.moduleMoreOptionsButton).eq(indexOfRecord).click({ force: true });
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.get(moduleLibrarySelector.commitModuleButton).should('exist').click();
                cy.get(moduleLibrarySelector.commitModuleSnackBar).should('include.text', ' Module database updated!');
            }).then(() => {
                cy.deleteModule(updatedModuleName);
            })
        })
    })

    it('Verify user should not be able Commit the empty Module name (MAIN-TC-471)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
            cy.wait(2000);
            let indexOfRecord = 0;
            cy.get(moduleLibrarySelector.moduleNameContentTextArea).each(($element) => {
                if ($element.val() === moduleName) {
                    cy.get(moduleLibrarySelector.moduleNameContentTextArea).eq(indexOfRecord).click().clear();
                    cy.get(moduleLibrarySelector.moduleMoreOptionsButton).eq(indexOfRecord).click({ force: true });
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.get(moduleLibrarySelector.commitModuleButton).should('exist').click();
                cy.get(moduleLibrarySelector.commitModuleSnackBar).should('include.text', "Module name can't be empty!");
            })
        })
    })

    it('Verify the module name cannot be added without the Category selection and the loading spinners exist(MAIN-TC-448, MAIN-TC-434, MAIN-TC-440)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
            cy.get(moduleLibrarySelector.createNewModuleButton).should('exist').click();
            cy.wait(1000);
            cy.get(moduleLibrarySelector.moduleNameDialogText).should('be.visible');
        }).then(() => {
            recurse(() =>
                cy.get(moduleLibrarySelector.moduleNameTextAreaField).should('exist').click().clear().type(moduleName),
                ($inputField) => $inputField.val() === moduleName,
                { delay: 1000 })
                .should('have.value', moduleName);
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleNameDisabledConfirmButton).should('be.disabled');
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleNameCancelButton).click();
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleNameDialogText).should('not.exist');
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleLibraryRefreshButton).click();
            cy.get(moduleLibrarySelector.refreshModulesLoader).should('exist');
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleLibraryShowAllButton).click();
            cy.get(moduleLibrarySelector.refreshModulesLoader).should('exist');
        }).then(() => {
            cy.deleteModule(moduleName);
        })
    })

    it('Verify in Module Name creation dialog, The Module name should not be an empty name (MAIN-TC-449, MAIN-TC-459, MAIN-TC-1167)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
            cy.get(moduleLibrarySelector.createNewModuleButton).should('exist').click();
            cy.wait(1000);
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleNameDialogText).should('be.visible');
            cy.get(moduleLibrarySelector.moduleNameTextAreaField).should('exist')
                .should('have.attr', 'maxlength', '65').click();
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleNameDialogText).click();
        }).then(() => {
            cy.get(moduleLibrarySelector.moduleNameErrorMessage).should('be.visible');
            cy.get(moduleLibrarySelector.moduleNameDisabledConfirmButton).should('be.disabled');
        })
    })

    it('Verify the updated "Damage scenario" is displayed in module library tab (MAIN-TC-489)', () => {
        let moduleName = 'TC-489: ' + projectName.substring(20);
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
            cy.createNewModule(moduleName, moduleCategory);
            cy.wait(2000);
            cy.editModuleFeature(moduleName, featureName, featureRole);
        }).then(() => {
            cy.get(moduleLibrarySelector.closeEditModuleFeatureDialogButton).click();
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
                cy.get(moduleLibrarySelector.expandMoreButton).click();
            }).then(() => {
                cy.get(moduleLibrarySelector.safetyImpactFieldBox).click();
                cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(safetyImpact).click();
                recurse(() =>
                    cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(0).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(moduleLibrarySelector.financialImpactFieldBox).click();
                cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(financialImpact).click();
                recurse(() =>
                    cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(1).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(moduleLibrarySelector.operationalImpactFieldBox).click();
                cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(operationalImpact).click();
                recurse(() =>
                    cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(2).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(moduleLibrarySelector.privacyImpactFieldBox).click();
                cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(privacyImpact).click();
                recurse(() =>
                    cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(3).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(moduleLibrarySelector.moduleFeatureMoreOptionsButton).click({ force: true });
                cy.get(moduleLibrarySelector.updateFeatureButton).click();
                cy.get(moduleLibrarySelector.updateFeatureSnackBar).should('include.text', 'Feature updated successfully');
            }).then(() => {
                cy.get(moduleLibrarySelector.closeEditModuleFeatureDialogButton).click();
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
                    cy.get(moduleLibrarySelector.expandMoreButton).click();
                }).then(() => {
                    cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', safetyImpact);
                    cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', financialImpact);
                    cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', operationalImpact);
                    cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', privacyImpact);
                    cy.get(moduleLibrarySelector.damageScenarioTextDescription).each(($damageScenarioTextDescription) => {
                        cy.wrap($damageScenarioTextDescription).should('have.value', damageScenario);
                    });
                }).then(() => {
                    cy.get(moduleLibrarySelector.closeEditModuleFeatureDialogButton).click();
                    cy.wait(2000);
                }).then(() => {
                    cy.deleteModule(moduleName);
                })
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
