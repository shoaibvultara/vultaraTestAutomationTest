const projectTriggerSelector = require('../../selectors/projectTriggerSelector.js');
const navBarSelector = require("../../selectors/navBarSelector");
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('Project Trigger Management', () => {
    var projectId;
    var triggerName;
    var triggerDescription;
    var relevantpartie;
    var priorityRationale;

    before(() => {
        cy.viewport(1920, 1080);            //Creating Project
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            triggerName = 'Automated Trigger: ' + $generatedName.substring(20);
            triggerDescription = 'Automated Trigger Description';
            relevantpartie = 'Test Relevant Partie';
            priorityRationale = 'Priority Rationale Test Description';
            cy.createProject(projectName);
        })
        // Get the project ID from local storage
        cy.window().then((win) => {
            const newDesignData = JSON.parse(win.localStorage.getItem('newDesign'));
            expect(newDesignData).to.not.be.null;
            expect(newDesignData.project).to.not.be.undefined;            //Have to change because 
            // Extract the project ID from the nested structure
            projectId = newDesignData.project.id;                         //projectId to be used 
            expect(projectId).to.not.be.undefined;
            cy.log("Project ID is: " + projectId);
            cy.createComponent()
        })
    })

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify that in the Project Triggers tab of Monitoring Page, there shall be a “Generate Trigger” button (MAIN-TC-2395, MAIN-TC-2396, MAIN-TC-2397, MAIN-TC-2398, MAIN-TC-2399, MAIN-TC-3024)', () => {
        cy.generateTrigger();
    })

    it('Verify that when the triggers are finished generating, the page shall automatically refresh back to the Project Triggers tab (MAIN-TC-2400)', () => {
        cy.generateTrigger().then(() => {
            cy.get(projectTriggerSelector.projectTriggerListTab).should('exist')
        })
    })

    it('Verify that when the user clicks on the text area of the trigger, the edit trigger dialogue box is appeared (MAIN-TC-1390)', () => {
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => { //Go to Monitoring Page
            cy.get(projectTriggerSelector.projectTriggerListTab).click();
            cy.get(projectTriggerSelector.triggerNameTextArea).first().click();
            cy.get(projectTriggerSelector.editTriggerTextDialog).contains('Edit Trigger').should('be.visible');
        })
    })

    it('Verify that there are three tabs on Monitoring page Active list, Archived List and Project triggers (MAIN-TC-1380)', () => {
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => { //Go to Monitoring Page
            cy.get(projectTriggerSelector.projectTriggerListTab).should('exist');
            cy.get(projectTriggerSelector.archivedListTab).should('exist');
            cy.get(projectTriggerSelector.activeListTab).should('exist');
        })
    })

    it('Verify that "Delete Trigger Icon" in the Project Trigger is visible and changed successfully from previous UI design (MAIN-TC-2693)', () => {
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => { //Go to Monitoring Page
            cy.get(projectTriggerSelector.projectTriggerListTab).click();
            cy.get(projectTriggerSelector.projectTriggerDropDownActionButton).eq(1).click();
            cy.get(projectTriggerSelector.deleteTriggerButton).should('be.visible');
        })
    })

    it('Verify that Delete trigger button functionality in "Project Trigger" works correctly (MAIN-TC-2694, MAIN-TC-2697)', () => {
        cy.intercept('DELETE', Cypress.env('apiURL') + '/trigger*').as('deleteRequest').then(() => {
            cy.deleteTrigger(2);
            //verify the API call
            cy.get('@deleteRequest').its('response.statusCode').should('eq', 200);
        })
    })

    it('Verify that Cancel button in the Confirmation box to delete trigger is visible and works correctly (MAIN-TC-2695)', () => {
        cy.cancelDeleteTrigger(2);
    })

    it('Verify that automatic project trigger generation for model components (MAIN-TC-2403, MAIN-TC-2404, MAIN-TC-2405, MAIN-TC-2406, MAIN-TC-1183)', () => {
        cy.visit(Cypress.env('baseURL') + '/modeling').then(() => { //Go to Monitoring Page
            cy.get(navBarSelector.loader).should('not.exist');
            const dataTransfer = new DataTransfer();
            //place comm line
            cy.get(modelingViewSelector.componentLibraryCommunicationLine).trigger('dragstart', { dataTransfer, force: true }).then(() => {
                cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 500, clientY: 500 });
            })
            cy.wait(500);
            //place boundary
            cy.get(modelingViewSelector.componentLibraryModuleBoundary).trigger('dragstart', { dataTransfer, force: true }).then(() => {
                cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 300, clientY: 200 });
            })
            cy.wait(500);
            // Connecting the Wire - start point
            cy.get(modelingViewSelector.drawingCanvasLineStartCircle, { scrollBehavior: false })
                .realClick({ scrollBehavior: false })
                .realMouseDown()
                .realMouseMove(-50, 0)
                .get(modelingViewSelector.drawingCanvasMicrocontroller)
                .realMouseUp({ force: true });
            cy.wait(500);
            // Connecting the Wire - end point
            cy.get(modelingViewSelector.drawingCanvasLineEndCircle, { scrollBehavior: false })
                .realClick()
                .realMouseDown()
                .realMouseMove(50, 0)
                .get(modelingViewSelector.drawingCanvasModule)
                .realMouseUp({ force: true });
            cy.wait(500);
            cy.get(modelingViewSelector.modelingViewSaveIcon).click();
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => {
                cy.get(projectTriggerSelector.projectTriggerListTab).click().then(() => {
                    //delete old triggers
                    let triggerCount = Cypress.$(projectTriggerSelector.projectTriggerDropDownActionButton).length;
                    while (triggerCount > 0) {
                        cy.deleteTrigger(triggerCount--);
                    }
                    //generate triggers
                    cy.generateTrigger();
                    //assert each component trigger has been generated
                    cy.get(navBarSelector.loader).should('not.exist');
                    let boundaryFound = false;
                    let lineFound = false;
                    let moduleFound = false;
                    let microcontrollerFound = false;
                    cy.get(projectTriggerSelector.triggerNameTextArea).each((textAreaElement) => {
                        if (textAreaElement.val() == 'Boundary0') {
                            boundaryFound = true;
                        } else if (textAreaElement.val() == 'Line0') {
                            lineFound = true;
                        } else if (textAreaElement.val() == 'Microcontroller0') {
                            microcontrollerFound = true;
                        } else if (textAreaElement.val() == 'Module0') {
                            moduleFound = true;
                        }
                    }).then(() => {
                        expect(boundaryFound).to.be.true;
                        expect(lineFound).to.be.true;
                        expect(microcontrollerFound).to.be.true;
                        expect(moduleFound).to.be.true;
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