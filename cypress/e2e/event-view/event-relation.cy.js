const eventSelector = require('../../selectors/eventSelector.js');
const navBarSelector = require("../../selectors/navBarSelector");
import { recurse } from 'cypress-recurse';
var projectName;

describe('Event Relation', () => {
    var projectId;
    var eventDetail;
    var evaluationNote;
    var event;
    var weakness;
    var weaknessDescription;

    before(() => {
        cy.viewport(1920, 1080);            //Creating Project
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            eventDetail = 'Event Details Test Description' + ': ' + $generatedName;
            evaluationNote = 'Evaluation Notes Test Description' + ': ' + $generatedName;
            weaknessDescription = 'Weakness is being Automated' + ': ' + $generatedName;
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
            cy.log("Project ID is: " + projectId).then(() => {
                cy.createComponent().then(() => {
                    cy.wait(1000);
                    cy.generateTrigger();
                })
            })
        })
        //setup Weakness objects
        event = {
            triggerName: 'Microcontroller0',
            priority: 'High',
            responsibleUser: 'Automation Test User',
        };
        weakness = {
            responsibleUser: 'Automation Test User',
            identificationMethod: 'Identification Method',
            sourceNotes: 'Source Notes',
            sourceNotesLink: 'Source Notes Link',
            component: 'Microcontroller0',
            attackSurface: 'Attack Surface',
            asset: 'Asset',
            cweID: '2',
            cweWeaknessType: 'Software Development',
            cweWeaknessCategory: 'Cryptographic Issues',
        };
    })

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify that for the event having Evaluation Status as “Weakness Identified”. On weakness linking page The "Link to Event" column shall work the same as the Weakness Linking dialog, but linking Weaknesses and Events instead  (MAIN-TC-2215, MAIN-TC-2213, MAIN-TC-2211, MAIN-TC-2214, MAIN-TC-2206, MAIN-TC-2207)', () => {
        cy.addNewWeakness(weakness, weaknessDescription).then(() => {
            cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
                cy.wait(1000);
                cy.get(eventSelector.addNewEventButton).click();
            }).then(() => {
                cy.get(eventSelector.addNewEventDialogText).should('contain', 'Add New Event');
                cy.get(eventSelector.triggerNameFieldButton).click();
                cy.get(eventSelector.eventDropDownListOption).contains(event.triggerName).click();
            }).then(() => {
                cy.get(eventSelector.priorityFieldButton).click();
                cy.get(eventSelector.eventDropDownListOption).contains(event.priority).click();
            }).then(() => {
                cy.get(eventSelector.eventStatusFieldButton).click();
                cy.get(eventSelector.eventDropDownListOption).contains('Completed').click();
            }).then(() => {
                cy.get(eventSelector.eventResponsibleFieldButton).should('be.visible').click({ force: true });
                cy.get(eventSelector.eventDropDownListOption).contains(event.responsibleUser).click();
            }).then(() => {
                recurse(() =>
                    cy.get(eventSelector.eventDetailFieldBox).clear().type(eventDetail),
                    ($inputField) => $inputField.val() === eventDetail,
                    { delay: 1000 })
                    .should('have.value', eventDetail);
            }).then(() => {
                cy.get(eventSelector.evaluationNoteFieldBox).should('be.visible');
                recurse(() =>
                    cy.get(eventSelector.evaluationNoteFieldBox).clear().type(evaluationNote),
                    ($inputField) => $inputField.val() === evaluationNote,
                    { delay: 1000 })
                    .should('have.value', evaluationNote);
            }).then(() => {
                cy.get(eventSelector.evaluationStatusFieldButton).should('be.visible').click();
                cy.get(eventSelector.evaluationStatusLabel).should('have.class', eventSelector.requiredSymbol);
                cy.get(eventSelector.eventDropDownListOption).eq(1).click();
                cy.get(eventSelector.globalConfirmButton).click();
            }).then(() => {
                cy.wait(1000);
                cy.get(eventSelector.weaknessLinkingTextDialog).should('contain' , 'Weakness linking - Event ID');
                cy.get(eventSelector.weaknessLinkingDialogCheckBox).first().click();
            }).then(() => {
                cy.get(eventSelector.globalConfirmButton).click();
            }).then(() => {
                cy.get(eventSelector.snackBarMessage).should('include.text', 'Changes saved successfully');
            })
        })
    })

    it('Verify that for the event having Evaluation Status as “Weakness Identified”. On weakness linking page If user Click "Generate Weakness from this Event" Few Fields(Description) should be automatically filled (MAIN-TC-2216, MAIN-TC-2447)', () => {
        cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
            cy.wait(1000);
            cy.get(eventSelector.addNewEventButton).click();
        }).then(() => {
            cy.get(eventSelector.addNewEventDialogText).should('contain', 'Add New Event');
            cy.get(eventSelector.triggerNameFieldButton).click();
            cy.get(eventSelector.eventDropDownListOption).contains(event.triggerName).click();
        }).then(() => {
            cy.get(eventSelector.priorityFieldButton).click();
            cy.get(eventSelector.eventDropDownListOption).contains(event.priority).click();
        }).then(() => {
            cy.get(eventSelector.eventStatusFieldButton).click();
            cy.get(eventSelector.eventDropDownListOption).contains('Completed').click();
        }).then(() => {
            cy.get(eventSelector.eventResponsibleFieldButton).should('be.visible').click({ force: true });
            cy.get(eventSelector.eventDropDownListOption).contains(event.responsibleUser).click();
        }).then(() => {
            recurse(() =>
            cy.get(eventSelector.eventDetailFieldBox).clear().type(eventDetail),
            ($inputField) => $inputField.val() === eventDetail,
            { delay: 1000 })
            .should('have.value', eventDetail);
        }).then(() => {
            cy.get(eventSelector.evaluationNoteFieldBox).should('be.visible');
            recurse(() =>
            cy.get(eventSelector.evaluationNoteFieldBox).clear().type(evaluationNote),
            ($inputField) => $inputField.val() === evaluationNote,
            { delay: 1000 })
            .should('have.value', evaluationNote);
        }).then(() => {
            cy.get(eventSelector.evaluationStatusFieldButton).should('be.visible').click();
            cy.get(eventSelector.eventDropDownListOption).eq(1).click();
            cy.get(eventSelector.globalConfirmButton).click();
        }).then(() => {
            cy.get(eventSelector.weaknessLinkingTextDialog).should('contain' , 'Weakness linking - Event ID')
            cy.get(eventSelector.generateWeaknessFromThisEventButton).click();
        }).then(() => {
            cy.get(eventSelector.generateWeaknessFromThisEventButton).should('not.be.enabled');
            cy.get(eventSelector.weaknessLinkingDialogCheckBox).first().should('not.be.enabled');
        }).then(() => {
            cy.get(eventSelector.globalConfirmButton).click();
        }).then(() => {
            cy.get(eventSelector.snackBarMessage).should('include.text','Changes saved successfully');
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