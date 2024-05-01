const navBarSelector = require('../../selectors/navBarSelector.js');
const loginSelector = require('../../selectors/loginSelector.js');
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
const assumptionPageSelector = require('../../selectors/assumptionPageSelector.js');
const eventSelector = require('../../selectors/eventSelector.js');
const projectLibrarySelector = require('../../selectors/projectLibrarySelector.js');
const controlLibrarySelector = require('../../selectors/controlLibrarySelector.js');
const assetLibrarySelector = require('../../selectors/assetLibrarySelector.js');
const projectBomSelector = require('../../selectors/projectBomSelector.js');
const vulnerabilityListViewSelector = require('../../selectors/vulnerabilityListViewSelector.js');
const weaknessSelector = require('../../selectors/weaknessSelector.js');


import { recurse } from 'cypress-recurse'
var projectName;
var projectId;

describe('Customer Environment Testting', () => {
    before(() => {              //Creating Project
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
            expect(newDesignData.project).to.not.be.undefined;            //Have to change because 
            // Extract the project ID from the nested structure
            projectId = newDesignData.project.id;                         //projectId to be used 
            expect(projectId).to.not.be.undefined;
            cy.log("Project ID is: " + projectId);
        })
    })

    beforeEach(() => {// Logging In and Loading Project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Create Model & Generate Threats', () => {
        cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
            recurse(
                () => cy.wrap(Cypress.$(navBarSelector.loader).length),
                ($loaderExist) => $loaderExist == false,//length === 0
                { delay: 1000 }
            ).then(() => {
                cy.dragAndDropModel();
            })
        }).then(() => {
            recurse(//retry dragging the components until they are connected
                // the commands to repeat, and they yield the input element
                () => cy.RemoveThenDragAndDropModel(),
                // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
                ($length) => $length == 2, //length of connected components is two, i.e. both components are connected
                { delay: 1000 }
            ).then(() => {
                cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick().then(() => {
                    //cy.get('mat-card-title:contains(Communication Line Spec)').should('not.exist').then(() => {
                    cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click().then(() => {
                        cy.get("mat-option:contains(Cloud)").click();
                    }).then(() => {
                        cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click();
                    })
                    //})
                })
            }).then(() => {
                recurse(
                    // the commands to repeat, and they yield the input element
                    () => cy.wrap(Cypress.$(navBarSelector.loader).length),
                    // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
                    ($loaderExist) => $loaderExist == false,//length === 0
                    { delay: 1000 }
                ).then(() => {
                    cy.get(modelingViewSelector.drawingCanvasModule).rightclick().then(() => {
                        cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click().then(() => {
                            cy.get("mat-option:contains(Cloud)").click();
                        }).then(() => {
                            cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click();
                        })
                    })
                })
            }).then(() => {
                recurse(
                    // the commands to repeat, and they yield the input element
                    () => cy.wrap(Cypress.$(navBarSelector.loader).length),
                    // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
                    ($loaderExist) => $loaderExist == false,//length === 0
                    { delay: 1000 }
                ).then(() => {
                    cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true }).then(() => {
                        cy.get(modelingViewSelector.communicationLineSpecTransmissionSelect).click().then(() => {
                            cy.get("mat-option:contains(Short-Range Wireless)").click();
                        })
                        cy.get(modelingViewSelector.communicationLineSpecBaseProtocolSelect).click().then(() => {
                            cy.get("mat-option:contains(802.11p )").click();
                        })
                    })
                })
            })
        }).then(() => {
            cy.get(navBarSelector.navBarEditButton).click().then(() => {
                cy.get(navBarSelector.editListRunTheModelButton).first().click();
                cy.get(navBarSelector.loader).should('be.visible').then(() => { //assertion to check if the loader is being shown
                    cy.url().should('include', '/threats');
                    cy.get(threatListViewSelector.threatListRow).should('have.length.at.least', 1) //assertion to check that threat list page is shown and contains at least one row
                })
            })
        })
    })

    it('Cybesecurity Pool : Adding new Control, Goal, Damage Scenario', () => {
        //Adding cybersecurity control
        cy.addControl("Automation Cybersecurity Control");
    })
    it('Project : Add New Assumption, Event', () => {
        cy.visit(Cypress.env('baseURL') + '/assumptions');
        cy.wait(1000);
        cy.get(assumptionPageSelector.assumptionAddNewAssumptionButton).click();
        cy.get(assumptionPageSelector.addNewAssumptionDialogContentTextArea).clear().type("Automation Test").then(() => {
        });
        cy.get(navBarSelector.confirmDialogueConfirmButton).click().then(() => {
            cy.get('textarea[rows="1"]').invoke('val').should('contain', 'Automation Test');
        });
        //Add Event
        cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
            cy.wait(1000);
            cy.get(eventSelector.addNewEventButton).click();
        }).then(() => {
            cy.get(eventSelector.addNewEventDialogText).should('be.visible');
            cy.get(eventSelector.triggerNameFieldButton).click();
        }).then(() => {
            recurse(() =>
                cy.get(eventSelector.eventDetailFieldBox).clear().type("Automation Event"),
                ($inputField) => $inputField.val() === "Automation Event",
                { delay: 1000 })
                .should('have.value', "Automation Event");
        }).then(() => {
            cy.get(eventSelector.evaluationNoteFieldBox).should('not.exist');
            cy.get(eventSelector.globalConfirmButton).click();
        }).then(() => {
            cy.get(eventSelector.snackBarMessage).should('include.text', 'Event added successfully');
        })
    })

    it('Project: Adding BOM', () => {
        cy.visit(Cypress.env('baseURL') + '/project-bom').then(() => {
            cy.get(projectBomSelector.projectBomAddNewBomButton).should('exist').click();
        }).then(() => {
            recurse(
                () => cy.get(projectBomSelector.addNewBomFormVersionInput).type("Automation BOM"),
                ($inputField) => $inputField.val() === "Automation BOM",
                { delay: 1000 });
        }).then(() => {
            cy.get('input[formcontrolname="product"]').type("bom product")
        }).then(() => {
            cy.get('input[formcontrolname="vendor"]').type("bom vendor")
        }).then(() => {
            cy.get('mat-select[formcontrolname="part"]').click();
        }).then(() => {
            cy.get(projectBomSelector.addNewBomDialogPartOption).contains("Operating System").click();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();//confirm bom dialog inputs
            cy.wait(1000);
            cy.get('div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]').should('include.text', 'BOM added successfully')
        })
    })

    it("Adding New Threat, vulnerability, Weakness", () => {
        var vulnerability = {
            description: 'Automation',
            component: 'Microcontroller0',
            attackVector: '(AV:N)',
            attackComplexity: '(AC:H)',
            privilegesRequired: '(PR:L)',
            userInteraction: '(UI:R)',
            scope: '(S:U)',
            confidentialityImpact: '(C:N)',
            integerityImpact: '(I:L)',
            availabilityImpact: '(A:H)',
            descriptionAttribute: 'ng-reflect-model',
        };
        //Adding Threat
        cy.addNewThreat().then(() => {
            //Adding Vulnerability
            cy.visit(Cypress.env('baseURL') + '/vulnerabilities').then(() => {
                cy.get(vulnerabilityListViewSelector.vulnerabilityListViewAddNewButton).should('exist').then(() => {
                    cy.get(vulnerabilityListViewSelector.vulnerabilityListViewAddNewButton).click();
                })
                cy.get(vulnerabilityListViewSelector.addNewVulnerabilityBaseScoreMetricsPanel).click();
                cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.attackVector).click();
                cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.attackComplexity).click();
                cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.privilegesRequired).click();
                cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.userInteraction).click();
                cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.scope).click();
                cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.confidentialityImpact).click();
                cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.integerityImpact).click();
                cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.availabilityImpact).click();
                cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                cy.wait(2000)
            })
        })
        //Adding New Weakness
        cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
            cy.get(weaknessSelector.addNewWeaknessButton).click();
            cy.wait(2000);
        }).then(() => {
            recurse(() =>
                cy.get(weaknessSelector.weaknessDescriptionFieldBox).clear().type("Automation Weakness"),
                ($inputField) => $inputField.val() === "Automation Weakness",
                { delay: 1000 })
                .should('have.value', "Automation Weakness");
        }).then(() => {
            cy.get(weaknessSelector.globalConfirmButton).click();
            cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Weakness added successfully.');
        })
    })

    it('Library : Add/Delete Control and Feature', () => {
        //Add Control
        cy.addControlToLibrary("Automation Control")
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
            cy.get(projectLibrarySelector.librarySideNavControlAnchor).click({ force: true }).then(() => {
                cy.wait(2000); // Added wait statement to ensure that Control is added successfully
                cy.get('textarea[rows="1"]').invoke('val').should('contain', 'Automation Control');
            })
        })
        //Delete Control
        cy.visit(Cypress.env('baseURL') + '/library'); // Go to Library Page
        cy.wait(1000);
        cy.get(projectLibrarySelector.librarySideNavControlAnchor).click();  // Redirects to Control Page
        cy.wait(1000);
        cy.get(controlLibrarySelector.controlLibraryMoreOptionsButton).eq(0).click({ force: true }).then(() => {
            cy.get(controlLibrarySelector.moreOptionsDeleteControlButton).click();
        });
        cy.get(controlLibrarySelector.controlLibraryConfirmToDeleteButton).click();
        cy.wait(2000); // Added wait statement to ensure that Control is deleted successfully
        //Create New Feature
        cy.createNewFeature("Automation Feature", "CAN message", "Control").then(() => {
            cy.deleteFeature("Automation Feature");
        })
    })

    it('Library : Add/Delete Asset and Goal', () => {
        //Add Asset
        cy.visit(Cypress.env('baseURL') + '/library').then(() => { // Go to Library Page
            cy.get(projectLibrarySelector.librarySideNavAssetAnchor).click();  // Go to Asset tab
            cy.wait(2000);
            cy.get(assetLibrarySelector.createNewAssetButton).click();
        }).then(() => {
            recurse(() =>
                cy.get(assetLibrarySelector.assetNameFieldBox).click().clear().type("Automation Asset"),
                ($inputField) => $inputField.val() === "Automation Asset",
                { delay: 1000 })
                .should('have.value', "Automation Asset");
        }).then(() => {
            cy.get('mat-select[name="assetSubType"]').click();
            cy.get('mat-option').eq(0).click().then(() => {
                cy.get(assetLibrarySelector.newAssetDialogConfirmButton).click();
            }).then(() => {
                cy.get(assetLibrarySelector.snackBarMessage).should('include.text', 'New asset created!');
            })
        }).then(() => {
            //Delete Asset
            cy.deleteAsset("Automation Asset");
        })
        //Add Goal
        cy.createGoalInLibrary("Automation Goal").then(() => {
            //Delete Goal
            cy.visit(Cypress.env('baseURL') + '/library').then(() => {
                cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click({ force: true }).then(() => {
                    cy.get(projectLibrarySelector.cybersecurityGoalTab).click();
                    cy.wait(2000);
                    cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(0).click({ force: true });
                }).then(() => {
                    cy.get(projectLibrarySelector.moreOptionsDeleteGoalButton).click().then(() => {
                        cy.get(navBarSelector.confirmDialogueDeleteButton).last().click({ force: true });
                        cy.get(navBarSelector.notificationSnackBar).should('include.text', 'This goal has been deleted from the library successfully');
                        cy.wait(1000);
                    })
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