const featureLibrarySelector = require("../../selectors/featureLibrarySelector");
const projectLibrarySelector = require("../../selectors/projectLibrarySelector");
const modelingViewSelector = require("../../selectors/modelingViewSelector");
const navBarSelector = require("../../selectors/navBarSelector");
import { recurse } from 'cypress-recurse'
var projectName;

describe('Feature Library Actions', () => {
    var projectId;
    var featureName;
    var updatedFeatureName;
    var assetName;
    var featureType;
    var moduleName;
    var featureRole;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
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
            featureName = 'FTR>' + $generatedName;
            updatedFeatureName = 'newFTR>' + $generatedName;
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

    it('Verify clicking "Create New Feature" button and search box (MAIN-TC-507, MAIN-TC-553, MAIN-TC-510, MAIN-TC-514, MAIN-TC-523, MAIN-TC-524)', () => {
        cy.createNewFeature(featureName, assetName, featureType).then(() => {
            cy.searchFeatureBox(featureName).then(() => {
                cy.get(featureLibrarySelector.featureContentTextArea).should('have.text', featureName);
            }).then(() => {
                cy.get(featureLibrarySelector.featureLibraryShowAllButton).click();
                cy.get(navBarSelector.subsequentSnackBarElement)
                    .should('be.visible')
                    .and('include.text', 'All')
                    .and('include.text', 'features in your feature library are shown');
            })
        })
    })

    it('Verify updating the Asset Name in Feature Library (MAIN-TC-597, MAIN-TC-534, MAIN-TC-513, MAIN-TC-521, MAIN-TC-533)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
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
                recurse(() =>
                    cy.get(featureLibrarySelector.featureNameFieldBox).clear().type(updatedFeatureName),
                    ($inputField) => $inputField.val() === updatedFeatureName,
                    { delay: 1000 })
                    .should('have.value', updatedFeatureName);
            }).then(() => {
                cy.get(featureLibrarySelector.confirmChangesButton).click();
                cy.get(featureLibrarySelector.confirmChangesSnackbar).should('include.text', 'Feature sucessfully updated!');
                cy.get(featureLibrarySelector.featureContentTextArea).contains(updatedFeatureName).should('be.visible')
            })
        })
    })

    it('Verify the "Add to feature" button adds the asset in Feature Asset bar (MAIN-TC-519)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
            cy.intercept('GET', Cypress.env('apiURL') + '/features/featureassetlib*').as('featureGetRequest');
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait('@featureGetRequest');
            cy.get('@featureGetRequest').then((request)=>{
                expect(request.response.statusCode).to.be.oneOf([200, 304]);
            })
            cy.get(featureLibrarySelector.createNewFeatureButton).click();
        }).then(() => {
            cy.get(featureLibrarySelector.showAssetLibraryButton).should('be.visible').click();
            cy.get(featureLibrarySelector.assetChipDialog).contains(assetName).click();
        }).then(() => {
            cy.get(featureLibrarySelector.addToFeatureButton).should('exist').click();
            cy.get(featureLibrarySelector.featureAssetDialog).should('be.visible').contains(assetName);
        })
    })

    it('Verify the working of "Show more assets" button (MAIN-TC-548, MAIN-TC-550)', () => {
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
            cy.intercept('GET', Cypress.env('apiURL') + '/features/featureassetlib*').as('featureGetRequest');
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait('@featureGetRequest');
            cy.get('@featureGetRequest').then((request)=>{
                expect(request.response.statusCode).to.be.oneOf([200, 304]);
            })
            cy.get(featureLibrarySelector.createNewFeatureButton).click();
        }).then(() => {
            cy.get(featureLibrarySelector.showAssetLibraryButton).should('be.visible').click();
        }).then(() => {
            cy.get(featureLibrarySelector.assetChipDialog).each(($assetChipDialog) => {
                cy.wrap($assetChipDialog).should('be.visible'); // Assert that each asset chip in assets dialog are visible
            })
        })
    })

    it('Verify the working of "Delete feature" (MAIN-TC-530)', () => {
        cy.deleteFeature(updatedFeatureName);
    })

    it('Verify that User is able to chain the features through memory chips (MAIN-TC-913)', () => {
        let featureName = 'FTR_TC_913'+ projectName.substring(20);
        cy.createNewFeature(featureName, assetName, featureType).then(() => {
            cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
                const dataTransfer = new DataTransfer();
                cy.get(modelingViewSelector.componentLibraryMicrocontroller).trigger('dragstart', { dataTransfer, force: true });
                cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
            }).then(() => {
                cy.wait(2000);
                cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick()
                cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click();
                cy.get(modelingViewSelector.componentSpecFeatureSettingTestOption).click();
            }).then(() => {
                cy.get(modelingViewSelector.componentSpecFeaturesSettingsFeaturesSelect).click()
                cy.get(modelingViewSelector.componentSpecFeaturesSettingsFeaturesDropdownList).contains(featureName).click();
            }).then(() => {
                cy.get(modelingViewSelector.addFeatureRoleFieldButton).click();
                cy.get(modelingViewSelector.addFeatureRoleDropdownList).first().click();
            }).then(() => {
                cy.get(modelingViewSelector.addFeatureConfirmButton).last().click();
                cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click()
            }).then(() => {
                cy.deleteFeature(featureName);
            })
        })
    })

    it('Verify to assign the feature role to Module using the Feature Applications (MAIN-TC-512, MAIN-TC-613, MAIN-TC-511, MAIN-TC-518, MAIN-TC-582, MAIN-TC-583)', () => {
        let featureName = 'TC_512_FTR>' + projectName;
        cy.createNewFeature(featureName, assetName, featureType).then(() => {
            cy.linkWithModule(featureName, featureRole, moduleName);
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
                if ($element.text() == featureName) {
                    cy.get(featureLibrarySelector.editFeatureButton).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.wait(2000);
                cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', moduleName);
                cy.get(featureLibrarySelector.featureApplicationGlobalButton).should('contain', featureRole);
                cy.get(navBarSelector.dialogCloseIcon).click();
            }).then(() => {
                cy.deleteFeature(featureName);
            })
        })
    })

    it('Verify the updated module name in feature library under its associated feature (MAIN-TC-555, MAIN-TC-522, MAIN-TC-557)', () => {
        let moduleName = 'Module_' + projectName.substring(20);
        let moduleCategory = 'Medical';
        let moduleNewName = 'New_' + moduleName;
        cy.createNewModule(moduleName, moduleCategory).then(() => {
            cy.updateModuleName(moduleName, moduleNewName);
        }).then(() => {
            cy.intercept('GET', Cypress.env('apiURL') + '/features/featureassetlib*').as('featureGetRequest');
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait('@featureGetRequest');
            cy.get('@featureGetRequest').then((request)=>{
                expect(request.response.statusCode).to.be.oneOf([200, 304]);
            })
            cy.get(featureLibrarySelector.createNewFeatureButton).click();
        }).then(() => {
            cy.wait(2000);
            cy.get(featureLibrarySelector.addApplicationButton).click();
        }).then(() => {
            cy.get(featureLibrarySelector.createFeatureButton).should('not.be.enabled');
        }).then(() => {
            cy.get(featureLibrarySelector.featureApplicationModuleFieldButton).last().should('exist').click();
            cy.get(featureLibrarySelector.globalDropDownOptionList).contains(moduleNewName).should('be.visible').click();
            cy.get(navBarSelector.dialogCloseIcon).click();
        }).then(() => {
            cy.deleteModule(moduleNewName)
        })
    })

    it('Verify user is notified with snack bar message for duplicates roles (MAIN-TC-382)', () => {
        let featureName = 'TC_382_FTR>' + projectName;
        cy.createNewFeature(featureName, assetName, featureType).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
                cy.intercept('GET', Cypress.env('apiURL') + '/features/featureassetlib*').as('featureGetRequest');
                cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
                cy.wait('@featureGetRequest');
                cy.get('@featureGetRequest').then((request)=>{
                    expect(request.response.statusCode).to.be.oneOf([200, 304]);
                })
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
                cy.wait(1000);
                cy.get(featureLibrarySelector.createNewFeatureSnackBar).should('include.text', 'Duplicating Feature names is not allowed');
                cy.get(navBarSelector.dialogCloseIcon).click();
            }).then(() => {
                cy.deleteFeature(featureName);
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