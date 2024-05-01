const eventSelector = require("../selectors/eventSelector");
import { recurse } from 'cypress-recurse'

  Cypress.Commands.add('addNewEventWhenEventStatusNotStarted', (event, eventDetail) => {
    cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
      cy.wait(1000);
      cy.get(eventSelector.addNewEventButton).click();
    }).then(() => {
      cy.get(eventSelector.addNewEventDialogText).should('be.visible');
      cy.get(eventSelector.triggerNameFieldButton).click();
      cy.get(eventSelector.eventDropDownListOption).contains(event.triggerName).click();
    }).then(() => {
      cy.get(eventSelector.priorityFieldButton).click();
      cy.get(eventSelector.eventDropDownListOption).contains(event.priority).click();
    }).then(() => {
      cy.get(eventSelector.eventStatusFieldButton).click();
      cy.get(eventSelector.eventDropDownListOption).contains('Not Started').click();
    }).then(() => {
      cy.get(eventSelector.eventResponsibleFieldButton).should('be.visible').and('contain', 'Not Assigned').click({ force: true });
      cy.get(eventSelector.eventDropDownListOption).contains(event.responsibleUser).click();
    }).then(() => {
      recurse(() =>
        cy.get(eventSelector.eventDetailFieldBox).clear().type(eventDetail),
        ($inputField) => $inputField.val() === eventDetail,
        { delay: 1000 })
        .should('have.value', eventDetail);
    }).then(() => {
      cy.get(eventSelector.evaluationNoteFieldBox).should('not.exist');
      cy.get(eventSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(eventSelector.snackBarMessage).should('include.text','Event added successfully');
    })
  })

  Cypress.Commands.add('addNewEventWhenEventStatusInProgress', (event, eventDetail, evaluationNote) => {
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
      cy.get(eventSelector.eventDropDownListOption).contains('In Progress').click();
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
      cy.get(eventSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(eventSelector.snackBarMessage).should('include.text','Event added successfully');
    })
  })

  Cypress.Commands.add('addNewEventWhenEventStatusCompleted', (event, eventDetail, evaluationNote) => {
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
    })
  })

  Cypress.Commands.add('searchForEvent', () => {
    cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
      cy.wait(1000);
      recurse(() =>
        cy.get(eventSelector.searchEventBox).clear().type('Event Details Test Description'),
        ($inputField) => $inputField.val() === 'Event Details Test Description',
        { delay: 1000 })
        .should('have.value', 'Event Details Test Description');
    })
  })

  Cypress.Commands.add('deleteEvent' , () => {
    cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Pag
      cy.wait(1000);
      cy.get(eventSelector.eventDropDownActionButton).eq(0).click({ force: true });
    }).then(() => {
      cy.get(eventSelector.deleteEventButton).click();
      cy.get(eventSelector.confirmDialogDeleteEventButton).last().click();
    }).then(() => {
      cy.get(eventSelector.snackBarMessage).should('include.text','Cybersecurity Event has been deleted successfully');
    })
  })

  Cypress.Commands.add('linkWeaknessWithEvent' , () => {
    cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Pag
      cy.wait(1000);
      cy.get(eventSelector.eventDropDownActionButton).eq(0).click({force: true});
    }).then(() => {
      cy.get(eventSelector.weaknessLinkingButton).click();
      cy.get(eventSelector.weaknessLinkingDialogCheckBox).eq(1).check().should('be.checked');
    }).then(() => {
      cy.get(eventSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(eventSelector.snackBarMessage).should('include.text','Changes saved successfully');
    })
  })