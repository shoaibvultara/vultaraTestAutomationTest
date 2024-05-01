const featureLibrarySelector = require("../../selectors/featureLibrarySelector");
const projectLibrarySelector = require("../../selectors/projectLibrarySelector");
const modelingViewSelector = require("../../selectors/modelingViewSelector");
const navBarSelector = require("../../selectors/navBarSelector");
const moduleLibrarySelector = require("../../selectors/moduleLibrarySelector");
import { recurse } from 'cypress-recurse'
var projectName;

describe('Feature Library Relations', () => {
    var projectId;
    var assetName;
    var featureType;
    var moduleName;
    var featureRole;
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
        // Generate a random feature name
        cy.generateProjectName().then(($generatedName) => {
            assetName = 'Ethernet message';
            featureType = 'Data Transmission';
            moduleName = 'check';
            featureRole = 'Data Redirector';
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify the New module linked with existing feature in module library page (MAIN-TC-614)', () => {
        let moduleName = 'Module_' + projectName.substring(20);
        let moduleCategory = 'Medical';
        let featureRole = 'Generator';
        let moduleNewName = 'New_' + moduleName;
        let featureName = 'TC_614_FTR_' + projectName.substring(20);
        cy.createNewModule(moduleName, moduleCategory).then(() => {
            cy.createNewFeature(featureName, assetName, featureType);
        }).then(() => {
            cy.linkWithModule(featureName, featureRole, moduleName);
        }).then(() => {
            cy.updateModuleName(moduleName, moduleNewName);
        }).then(() => {
            cy.intercept('GET', Cypress.env('apiURL') + '/features/featureassetlib*').as('featureGetRequest');
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait('@featureGetRequest');
            cy.get('@featureGetRequest').then((request)=>{
                expect(request.response.statusCode).to.be.oneOf([200, 304]);
            })
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(featureLibrarySelector.featureContentTextArea).each(($element) => {
                if ($element.text() === featureName) {
                    cy.get(featureLibrarySelector.editFeatureButton).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
            indexOfRecord++;
            }).then(() => {
                cy.wait(2000);
                cy.contains(moduleNewName).should('exist');
                cy.get(navBarSelector.dialogCloseIcon).click();
            }).then(() => {
                cy.deleteModule(moduleNewName);
            }).then(() => {
                cy.deleteFeature(featureName);
            })
        })
    })

    it('Verify the updated impact are displayed correctly in feature library tab in its associated feature (MAIN-TC-570)', () => {
        let featureName = 'TC_570_FTR_' + projectName.substring(20);
        cy.createNewFeature(featureName, assetName, featureType).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
            cy.intercept('GET', Cypress.env('apiURL') + '/features/featureassetlib*').as('featureGetRequest');
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait('@featureGetRequest');
            cy.get('@featureGetRequest').then((request)=>{
                expect(request.response.statusCode).to.be.oneOf([200, 304]);
            })
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(featureLibrarySelector.featureContentTextArea).each(($element) => {
                if ($element.text() == featureName) {
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
                cy.get(featureLibrarySelector.safetyImpactFieldBox).click();
                cy.get(featureLibrarySelector.globalDropDownOptionList).contains(safetyImpact).click();
            }).then(() => {
                recurse(() =>
                    cy.get(featureLibrarySelector.damageScenarioTextDescription).eq(0).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(featureLibrarySelector.financialImpactFieldBox).click();
                cy.get(featureLibrarySelector.globalDropDownOptionList).contains(financialImpact).click();
            }).then(() => {
                recurse(() =>
                    cy.get(featureLibrarySelector.damageScenarioTextDescription).eq(1).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(featureLibrarySelector.operationalImpactFieldBox).click();
                cy.get(featureLibrarySelector.globalDropDownOptionList).contains(operationalImpact).click();
            }).then(() => {
                recurse(() =>
                    cy.get(featureLibrarySelector.damageScenarioTextDescription).eq(2).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(featureLibrarySelector.privacyImpactFieldBox).click();
                cy.get(featureLibrarySelector.globalDropDownOptionList).contains(privacyImpact).click();
            }).then(() => {
                recurse(() =>
                    cy.get(featureLibrarySelector.damageScenarioTextDescription).eq(3).clear().type(damageScenario),
                    ($inputField) => $inputField.val() === damageScenario,
                    { delay: 1000 })
                    .should('have.value', damageScenario);
            }).then(() => {
                cy.get(featureLibrarySelector.confirmChangesButton).click();
                cy.get(featureLibrarySelector.confirmChangesSnackbar).should('include.text', 'Feature sucessfully updated!');
            }).then(() => {
                cy.deleteFeature(featureName);
            })
        })
    })

    it('Verify the updated "Damage scenario" is shown properly in feature library tab (MAIN-TC-572, MAIN-TC-573)', () => {
        let featureName = 'TC_572_FTR_' + projectName.substring(20);
        let moduleName = 'Module_' + projectName.substring(20);
        let moduleCategory = 'Medical';
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page (It redirects to Module page by default)
            cy.createNewFeature(featureName, assetName, featureType).then(() => {
                cy.createNewModule(moduleName, moduleCategory);
            }).then(() => {
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
                }).then(() => {
                    recurse(() =>
                        cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(0).clear().type(damageScenario),
                        ($inputField) => $inputField.val() === damageScenario,
                        { delay: 1000 })
                        .should('have.value', damageScenario);
                }).then(() => {
                    cy.get(moduleLibrarySelector.financialImpactFieldBox).click();
                    cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(financialImpact).click();
                }).then(() => {
                    recurse(() =>
                        cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(1).clear().type(damageScenario),
                        ($inputField) => $inputField.val() === damageScenario,
                        { delay: 1000 })
                        .should('have.value', damageScenario);
                }).then(() => {
                    cy.get(moduleLibrarySelector.operationalImpactFieldBox).click();
                    cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(operationalImpact).click();
                }).then(() => {
                    recurse(() =>
                        cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(2).clear().type(damageScenario),
                        ($inputField) => $inputField.val() === damageScenario,
                        { delay: 1000 })
                        .should('have.value', damageScenario);
                }).then(() => {
                    cy.get(moduleLibrarySelector.privacyImpactFieldBox).click();
                    cy.get(moduleLibrarySelector.globalDropDownOptionList).contains(privacyImpact).click();
                }).then(() => {
                    recurse(() =>
                        cy.get(moduleLibrarySelector.damageScenarioTextDescription).eq(3).clear().type(damageScenario),
                        ($inputField) => $inputField.val() === damageScenario,
                        { delay: 1000 })
                        .should('have.value', damageScenario);
                }).then(() => {
                    cy.get(moduleLibrarySelector.moduleFeatureMoreOptionsButton).click({ force: true });
                    cy.get(moduleLibrarySelector.updateFeatureButton).click();
                    cy.get(moduleLibrarySelector.updateFeatureSnackBar).should('include.text', 'Feature updated successfully');
                    cy.get(navBarSelector.dialogCloseIcon).click();
                }).then(() => {
                    cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
                    cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
                    cy.wait(1000);
                }).then(() => {
                    let indexOfRecord = 0;
                    cy.get(featureLibrarySelector.featureContentTextArea).each(($element) => {
                        if ($element.text() == featureName) {
                            cy.get(featureLibrarySelector.editFeatureButton).eq(indexOfRecord).click();
                            return false;// to exist from the .each() loop
                        }
                        indexOfRecord++;
                    }).then(() => {
                        cy.wait(2000);
                        cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', moduleName);
                        cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', featureRole);
                    }).then(() => {
                        cy.get(featureLibrarySelector.expandMoreButton).last().click({ force: true });
                        cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', safetyImpact);
                        cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', financialImpact);
                        cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', operationalImpact);
                        cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', privacyImpact);
                        cy.get(featureLibrarySelector.damageScenarioTextDescription).each(($damageScenarioTextDescription) => {
                            cy.wrap($damageScenarioTextDescription).should('have.value', damageScenario);
                        });
                        cy.get(navBarSelector.dialogCloseIcon).click();
                    }).then(() => {
                        cy.deleteModule(moduleName);
                    }).then(() => {
                        cy.deleteFeature(featureName);
                    })
                })
            })
        })
    })

    it('Verify that when the Features are not assigned to Microcontroller, the Feature Chain-Beta button will remain disabled (MAIN-TC-381)', () => {
        cy.visit(Cypress.env('baseURL') + '/modeling').then(() => {
            const dataTransfer = new DataTransfer();
            cy.get(modelingViewSelector.componentLibraryMicrocontroller).trigger('dragstart', { dataTransfer, force: true });
            cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
        }).then(() => {
            cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
        }).then(() => {
            cy.wait(2000);
            cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click();
        }).then(() => {
            cy.get(modelingViewSelector.componentSpecFeatureSettingFrontFacingCameraOption).click();
        }).then(() => {
            cy.get(modelingViewSelector.componentSpecFeatureSettingsFeatureChip).first().click();
        }).then(() => {
            cy.get(modelingViewSelector.componentSpecFeatureSettingsFeatureChainButton).should('be.enabled');
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