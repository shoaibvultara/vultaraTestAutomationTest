const assetLibrarySelector = require("../../selectors/assetLibrarySelector");
const projectLibrarySelector = require("../../selectors/projectLibrarySelector");
const modelingViewSelector = require("../../selectors/modelingViewSelector");
const featureLibrarySelector = require("../../selectors/featureLibrarySelector");
const navBarSelector = require("../../selectors/navBarSelector");
import { recurse } from 'cypress-recurse'
var projectName;

describe('Asset Library Management', () => {
    var projectId;
    var assetName;
    var assetType;
    var subType;
    var tagName;

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
            assetName = 'ASET>' + $generatedName;
            assetType = 'Computing Resource';
            subType = 'General Data';
            tagName = 'Automation_Test';
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify to add the new asset and verify Assets for a micro component (MAIN-TC-596, MAIN-TC-595, MAIN-TC-2559, MAIN-TC-912, MAIN-TC-1205)', () => {
        let componentSpecFeature = 'test linking';
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env("baseURL") + "/modeling");
        }).then(() => {
            const dataTransfer = new DataTransfer();
            cy.get(modelingViewSelector.componentLibraryMicrocontroller).trigger('dragstart', { dataTransfer, force: true });
            cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
        }).then(() => {
            cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
        }).then(() => {
            cy.wait(2000);
            cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click();
            cy.get(modelingViewSelector.componentSpecFeatureSettingTestOption).click();
        }).then(() => {
            cy.get(modelingViewSelector.componentSpecFeaturesSettingsFeaturesSelect).click();
            cy.get(modelingViewSelector.componentSpecFeaturesSettingsFeaturesDropdownList).contains(componentSpecFeature).click();
        }).then(() => {
            cy.get(modelingViewSelector.addFeatureRoleFieldButton).click();
            cy.get(modelingViewSelector.addFeatureRoleDropdownList).first().click();
        }).then(() => {
            cy.get(modelingViewSelector.addFeatureConfirmButton).last().click();
            cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click();
        }).then(() => {
            cy.get(modelingViewSelector.securitySettingTab).click();
        }).then(() => {
            recurse(() =>
                cy.get(modelingViewSelector.assetComponentSearchBox).clear().type(assetName),
                ($inputField) => $inputField.val() === assetName,
                { delay: 1000 })
                .should('have.value', assetName);
        }).then(() => {
            cy.get(modelingViewSelector.assetComponentDropdownList).contains(assetName).should('be.visible').click();
            cy.get(modelingViewSelector.assetPropertiesFeatureButtonField).click();
            cy.wait(2000);
        }).then(() => {
            cy.get(modelingViewSelector.assetPropertiesFeatureDropdownList).first().click();
            cy.get(modelingViewSelector.assetPropertiesConfirmButton).last().click();
        }).then(() => {
            cy.get(modelingViewSelector.assetComponentSpinner).should('not.exist');
            cy.get(modelingViewSelector.assetComponentContentTextArea).contains(assetName).should('be.visible');
        }).then(() => {
            cy.deleteAsset(assetName);
        })
    })

    it('Verify that if User clicked on "Delete" button in Confirmation to delete box of Asset tab in library page the asset is deleted successfully (MAIN-TC-2779, MAIN-TC-607, MAIN-TC-599, MAIN-TC-1722, MAIN-TC-1724)', () => {
        let assetName = 'TC-2779_ASET>' + projectName;
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.deleteAsset(assetName);
        })
    })

    it('Verify the user shall select the sub-Type for "Data At Rest" and "Data-In Transit" assets in order to update them (MAIN-TC-965)', () => {
        let assetName = 'TC-965_ASET>' + projectName;
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page 
        }).then(() => {
            cy.wait(2000);
            cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
        }).then(() => {
            recurse(
                () => cy.wrap(Cypress.$(assetLibrarySelector.assetLoaderIcon).length),
                ($loaderExist) => $loaderExist == false,//length === 0
                { delay: 1000 }
            )
        }).then(() => {
            let indexOfRecord = 0;
            let assetType = 'Data In Transit';
            cy.get(assetLibrarySelector.assetNameContentTextArea).each(($element) => {
                if ($element.val() === assetName) {
                    cy.get(assetLibrarySelector.assetTypeContentArea).eq(indexOfRecord).click({ force: true }).then(() => {
                        cy.get(assetLibrarySelector.globalDropDownOption).contains(assetType).click();
                        cy.get(assetLibrarySelector.updateAssetButton).eq(indexOfRecord).should('not.be.enabled');
                    }).then(() => { })
                        cy.get(assetLibrarySelector.subTypeContentArea).eq(indexOfRecord).click({ force: true }).then(() => {
                            cy.get(assetLibrarySelector.globalDropDownOption).contains(subType).click();
                            cy.get(assetLibrarySelector.updateAssetButton).eq(indexOfRecord).click();
                        }).then(() => {
                            cy.get(assetLibrarySelector.snackBarMessage).should('include.text', 'Asset successfully updated')
                        })
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.deleteAsset(assetName);
            })
        })
    })

    it('Verify Asset Retention After Searching Another asset Keyword Before Adding to Feature (MAIN-TC-3211)', () => {
        let assetName = 'TC-3211_ASET>' + projectName;
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
        }).then(() => {
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait(2000);
        }).then(() => {
            cy.get(featureLibrarySelector.createNewFeatureButton).click();
            cy.get(featureLibrarySelector.showAssetLibraryButton).click();
        }).then(() => {
            cy.get(featureLibrarySelector.assetChipDialog).contains('CAN message').click();
        }).then(() => {
            recurse(() =>
                cy.get(featureLibrarySelector.searchAvailableAssetFieldBox).click({ force: true }).clear().type(assetName),
                ($inputField) => $inputField.val() === assetName,
                { delay: 1000 })
                .should('have.value', assetName);
        }).then(() => {
            cy.get(featureLibrarySelector.assetChipDialog).contains(assetName).click();
            cy.get(featureLibrarySelector.addToFeatureButton).should('exist').click();
        }).then(() => {
            cy.get(featureLibrarySelector.featureAssetDialog).last().should('contain', assetName).and('contain', 'CAN message');
            cy.get(navBarSelector.dialogCloseIcon).click();
        }).then(() => {
            cy.deleteAsset(assetName);
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