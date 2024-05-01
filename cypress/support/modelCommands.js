import '@4tw/cypress-drag-drop';
import "cypress-real-events/support";
import "cypress-localstorage-commands";
import 'cypress-log-to-output';
import { recurse } from 'cypress-recurse';

const navBarSelector = require('../selectors/navBarSelector.js');
const modelingViewSelector = require('../selectors/modelingViewSelector.js');
const threatListViewSelector = require('../selectors/threatListViewSelector.js');

Cypress.Commands.add('dragAndDropModel', () => {
    const dataTransfer = new DataTransfer();
    cy.get(modelingViewSelector.componentLibraryMicrocontroller).trigger('dragstart', { dataTransfer, force: true })
        .then(() => {
            cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
        })
    cy.get(modelingViewSelector.componentLibraryModule).trigger('dragstart', { dataTransfer, force: true })
        .then(() => {
            cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 800, clientY: 400 });
        })
    cy.get(modelingViewSelector.componentLibraryCommunicationLine).trigger('dragstart', { dataTransfer, force: true })
        .then(() => {
            cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 400 });
        })
    cy.wait(2000).then(() => {
        // Connecting the Wire - start point
        cy.get(modelingViewSelector.drawingCanvasLineStartCircle)
            .realClick({ scrollBehavior: false })
            .realMouseDown()
            .realMouseMove(-50, 0)
            .get(modelingViewSelector.drawingCanvasMicrocontroller)
            .realMouseUp({ force: true });
        cy.wait(1000);
        // Connecting the Wire - end point
        cy.get(modelingViewSelector.drawingCanvasLineEndCircle)
            .realClick({ scrollBehavior: false })
            .realMouseDown()
            .realMouseMove(50, 0)
            .get(modelingViewSelector.drawingCanvasModule)
            .realMouseUp({ force: true });
        cy.wait(1000);
    }).then(() => {
        cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true }).then(() => {
            cy.get(modelingViewSelector.modelingViewComponentSettingsTab).should('be.visible').then(() => {
                return cy.wrap(Cypress.$(modelingViewSelector.communicationLineAccessibleFeatureComponent).length)
            })
        })
    })
})

Cypress.Commands.add('RemoveThenDragAndDropModel', () => {
    cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick().then(() => {
        cy.get(modelingViewSelector.componentSpecRemoveMicroButton).click().then(() => {
            cy.get(navBarSelector.confirmDialogueDeleteButton).click();
        })
    }).then(() => {
        cy.get(modelingViewSelector.drawingCanvasModule).rightclick().then(() => {
            cy.get(modelingViewSelector.componentSpecRemoveModuleButton).click().then(() => {
                cy.get(navBarSelector.confirmDialogueDeleteButton).click();
            })
        })
    }).then(() => {
        cy.wait(1000);
        cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true }).then(() => {
            cy.get(modelingViewSelector.componentSpecRemoveLineButton).click().then(() => {
                cy.get(navBarSelector.confirmDialogueDeleteButton).click();
            })
        })
    }).then(() => {
        cy.dragAndDropModel();
    }).then(() => {
        cy.get(modelingViewSelector.communicationLineAccessibleFeatureComponent).then(($componentList) => {
            return cy.wrap($componentList.length)
        })
    })
})

Cypress.Commands.add('createModel', () => {
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
                    cy.get(modelingViewSelector.componentSpecFeatureSettingTestOption).click();
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
                        cy.get(modelingViewSelector.componentSpecFeatureSettingTestOption).click();
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
                        cy.get(modelingViewSelector.transmissionMediaShortRangeWirelessOption).click();
                    })
                    cy.get(modelingViewSelector.communicationLineSpecBaseProtocolSelect).click().then(() => {
                        cy.get(modelingViewSelector.baseProtocolBluetoothOption).click();
                    })
                })
            }).then(() => {
                cy.get(modelingViewSelector.baseProtocolBluetoothOption).should('not.exist').then(() => {
                    cy.get(modelingViewSelector.communicationLineRemoteDiagnosticsLabel).first().click({ force: true });
                    cy.get(modelingViewSelector.communicationLineEthernetCommunicationLabel).first().click({ force: true });
                })
            })
        })
    }).then(() => {
        cy.get(navBarSelector.navBarEditButton).click().then(() => {
            cy.get(navBarSelector.editListRunTheModelButton).first().click();
            cy.get(navBarSelector.loader).should('be.visible').then(() => { //assertion to check if the loader is being shown
            cy.get(threatListViewSelector.threatListRow).should('have.length.at.least', 1) //assertion to check that threat list page is shown and contains at least one row
            })
        })
    })
})

Cypress.Commands.add('createComponent', () => {
    cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
        cy.get(navBarSelector.loader).should('not.exist');
        const dataTransfer = new DataTransfer();
        cy.get(modelingViewSelector.componentLibraryMicrocontroller).trigger('dragstart', { dataTransfer, force: true }).then(() => {
            cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
        })
        cy.get(modelingViewSelector.componentLibraryModule).trigger('dragstart', { dataTransfer, force: true }).then(() => {
            cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 400 });
        })
    }).then(() => {
        cy.get(modelingViewSelector.modelingViewSaveIcon).click();
        cy.wait(2000);
    })
})