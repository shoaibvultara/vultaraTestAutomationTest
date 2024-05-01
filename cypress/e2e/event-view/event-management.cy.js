const eventSelector = require('../../selectors/eventSelector.js');
const navBarSelector = require("../../selectors/navBarSelector");
import { recurse } from 'cypress-recurse';
var projectName;

describe('Event Management', () => {
  var projectId;
  let milestoneKey;
  var eventDetail;
  var evaluationNote;
  var event;

  before(() => {
    cy.viewport(1920, 1080);            //Creating Project
    cy.login();
    // Generate a random project name
    cy.generateProjectName().then(($generatedName) => {
      projectName = $generatedName;
      eventDetail = 'Event Details Test Description' + ': ' + $generatedName;
      evaluationNote = 'Evaluation Notes Test Description' + ': ' + $generatedName;
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
  })

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login().then(() => {
      cy.loadProject(projectId);
    })
  })

  it('Verify that when the user clicks on the "Add new event" button, the "Add new event" dialog window appear  (MAIN-TC-2380, MAIN-TC-2421, MAIN-TC-2415)', () => {
    cy.addNewEventWhenEventStatusNotStarted(event, eventDetail);
  })

  it('Verify that the user clicks on the "Delete" icon for any event on the event page  (MAIN-TC-2382)', () => {
    cy.deleteEvent();
  })

  it('Verify that if on Add Event Dialog box, Event Status is Inprogress or Completed a new "Evaluation Box is being Shown"  (MAIN-TC-2204)', () => {
    cy.addNewEventWhenEventStatusInProgress(event, eventDetail, evaluationNote).then(() => {
      cy.addNewEventWhenEventStatusCompleted(event, eventDetail, evaluationNote);
    })
  })

  it('Verify that on Event Page, if any event, have Evaluation status Weakness Identified. The 3 dots button shall contain 1 more option “Weakness Linking: which should open Event Weakness Linking dialog  (MAIN-TC-2212)', () => {
    cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
      cy.wait(1000);
      cy.get(eventSelector.eventDropDownActionButton).first().click({ force: true });
    }).then(() => {
      cy.get(eventSelector.weaknessLinkingButton).should('exist').click();
      cy.get(eventSelector.weaknessLinkingTextDialog).should('contain', 'Weakness linking - Event ID');
    })
  })

  it('Verify that on Add Event Dialog box, if Event Status is Not Started or In Progress. Upon Pressing Confirm Button, It should Store the Event Details  (MAIN-TC-2209)', () => {
    cy.addNewEventWhenEventStatusNotStarted(event, eventDetail).then(() => {
      cy.get(eventSelector.eventDetailsContentArea).eq(0).should('have.value', eventDetail);  // The Value should be same as Event Details Text
    }).then(() => {
      cy.addNewEventWhenEventStatusInProgress(event, eventDetail, evaluationNote);
    }).then(() => {
      cy.get(eventSelector.eventDetailsContentArea).eq(0).should('have.value', eventDetail);  // The Value should be same as Event Details Text
    })
  })

  it('Verify that on Add Event Dialog box, if Event Status is Not Started, Evaluation Box is not being Shown  (MAIN-TC-2208)', () => {
    cy.addNewEventWhenEventStatusNotStarted(event, eventDetail);
  })

  it('Verify that on Add Event Dialog box, if Event Status is Completed and Evaluation status is No Weakness Identified. Upon Pressing Confirm Button, It should Store the Event Details  (MAIN-TC-2210)', () => {
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
      cy.get(eventSelector.eventDropDownListOption).eq(0).click();
    }).then(() => {
      cy.get(eventSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(eventSelector.snackBarMessage).should('include.text', 'Event added successfully');
    })
  })

  it('Verify that the Event page shall show the records in the milestone view  (MAIN-TC-2118)', () => {
    cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
      milestoneKey = 'MAIN-TC-2118';
      cy.createMilestone(milestoneKey);
    }).then(() => {
      cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone MAIN-TC-2118 is created successfully.');
    }).then(() => {
      cy.loadMilestone(milestoneKey);
    }).then(() => {
      cy.visit(Cypress.env('baseURL') + '/event'); //Go to Event Page
    }).then(() => {
      cy.get(eventSelector.eventDetailsContentArea).eq(0).should('have.value', eventDetail);  // The Value should be same as Event Details Text
    })
  })

  it('Verify that the user clicks on the row of the existing event and the update event dialog appears  (MAIN-TC-2381, MAIN-TC-2422)', () => {
    cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
      cy.wait(1000);
      cy.get(eventSelector.eventDetailsContentArea).eq(0).click();
    }).then(() => {
      cy.get(eventSelector.editEventDialogText).should('contain', 'Edit Event ID');
      cy.get(eventSelector.eventResponsibleFieldButton).should('be.visible');
    })
  })

  it('Verify the "Attachments" option under the three dots button of events  (MAIN-TC-3203)', () => {
    cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Pag
      cy.wait(2000);
      cy.get(eventSelector.eventDropDownActionButton).eq(0).click({ force: true });
    }).then(() => {
      cy.get(eventSelector.attachmentButton).should('exist').click();
    }).then(() => {
      cy.get(eventSelector.eventAttachmentTextDialog).should('be.visible');
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