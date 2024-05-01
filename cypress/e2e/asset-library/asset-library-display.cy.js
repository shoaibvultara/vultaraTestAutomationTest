const assetLibrarySelector = require("../../selectors/assetLibrarySelector");
const projectLibrarySelector = require("../../selectors/projectLibrarySelector");
const modelingViewSelector = require("../../selectors/modelingViewSelector");
const featureLibrarySelector = require("../../selectors/featureLibrarySelector");
const navBarSelector = require("../../selectors/navBarSelector");
import { recurse } from 'cypress-recurse'
var projectName;

describe('Asset Library Display', () => {
    var projectId;
    var assetName;
    var updatedAssetName;
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
            updatedAssetName = 'new ASET' + $generatedName;
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

    it('Verify the updated asset name is showing correctly in all its associated features (MAIN-TC-606, MAIN-TC-604)', () => {
        let assetName = 'TC-606_ASET>' + projectName;
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library');  // Go to Library Page 
            cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
        }).then(() => {
            cy.wait(2000);
            let indexOfRecord = 0;
            cy.get(assetLibrarySelector.assetNameContentTextArea).each(($element) => {
                if ($element.val() === assetName) {
                    cy.get(assetLibrarySelector.assetNameContentTextArea).eq(indexOfRecord).clear().type(updatedAssetName);
                    cy.get(assetLibrarySelector.updateAssetButton).eq(indexOfRecord).click();
                    cy.get(assetLibrarySelector.snackBarMessage).should('include.text', 'Asset successfully updated')
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
                cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
                cy.wait(2000);
            }).then(() => {
                cy.get(featureLibrarySelector.createNewFeatureButton).click();
                cy.get(featureLibrarySelector.showAssetLibraryButton).click();
            }).then(() => {
                recurse(() =>
                    cy.get(featureLibrarySelector.searchAvailableAssetFieldBox).click({ force: true }).clear().type(updatedAssetName),
                    ($inputField) => $inputField.val() === updatedAssetName,
                    { delay: 1000 })
                    .should('have.value', updatedAssetName);
            }).then(() => {
                cy.get(featureLibrarySelector.assetChipDialog).contains(updatedAssetName).should('exist');
                cy.get(navBarSelector.dialogCloseIcon).click();
            }).then(() => {
                cy.deleteAsset(updatedAssetName);
            })
        })
    })

    it('Verify the newly added asset is shown properly in feature library (MAIN-TC-543, MAIN-TC-544, MAIN-TC-554, MAIN-TC-584, MAIN-TC-590, MAIN-TC-591, MAIN-TC-603)', () => {
        let assetName = 'TC-543_ASET>' + projectName;
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
        }).then(() => {
            cy.get(projectLibrarySelector.librarySideNavFeatureAnchor).click();  // Go to Feature tab
            cy.wait(2000);
        }).then(() => {
            cy.get(featureLibrarySelector.createNewFeatureButton).click();
            cy.get(featureLibrarySelector.showAssetLibraryButton).click();
        }).then(() => {
            recurse(() =>
                cy.get(featureLibrarySelector.searchAvailableAssetFieldBox).click({ force: true }).clear().type(assetName),
                ($inputField) => $inputField.val() === assetName,
                { delay: 1000 })
                .should('have.value', assetName);
        }).then(() => {
            cy.get(featureLibrarySelector.assetChipDialog).contains(assetName).should('exist');
            cy.get(navBarSelector.dialogCloseIcon).click();
        }).then(() => {
            cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();
        }).then(() => {
            recurse(() =>
                cy.get(assetLibrarySelector.assetLibrarySearchBox).clear().type(assetName),
                ($inputField) => $inputField.val() === assetName,
                { delay: 1000 })
                .should('have.value', assetName);
        }).then(() => {
            cy.get(navBarSelector.circleProgressSpinner).should('exist');
            cy.get(assetLibrarySelector.assetNameContentTextArea).should('have.value', assetName);
            cy.get(assetLibrarySelector.assetLibrarySearchBox).clear().then(() => {
                cy.get(assetLibrarySelector.assetNameContentTextArea).should('have.length.greaterThan', 1);
            })
        }).then(() => {
            cy.get(assetLibrarySelector.assetNameContentTextArea).then((assetCountBeforeLoading) => {
                cy.get(assetLibrarySelector.assetLibraryLoadMoreButton).click().then(() => {
                    cy.log(assetCountBeforeLoading);
                    cy.get(assetLibrarySelector.assetNameContentTextArea).should('have.length.greaterThan', assetCountBeforeLoading.length);
                })
            })
        }).then(() => {
            cy.get(assetLibrarySelector.assetLibraryRefreshButton).click();
            cy.get(navBarSelector.circleProgressSpinner).should('exist');
        }).then(() => {
            cy.deleteAsset(assetName);
        })
    })

    it('Verify Updating the Asset Name to empty string in Feature Library (MAIN-TC-598)', () => {
        let assetName = 'TC-598_ASET>' + projectName;
        cy.createNewAsset(assetName, assetType, subType, tagName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page 
        }).then(() => {
            cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
            cy.wait(2000);
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(assetLibrarySelector.assetNameContentTextArea).each(($element) => {
                if ($element.val() === assetName) {
                    cy.get(assetLibrarySelector.assetNameContentTextArea).eq(indexOfRecord).click().clear();
                    cy.get(assetLibrarySelector.updateAssetButton).eq(indexOfRecord).should('not.be.enabled');
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.deleteAsset(assetName);
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