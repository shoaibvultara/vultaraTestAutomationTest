const projectTriggerSelector = require('../selectors/projectTriggerSelector.js')
import { recurse } from 'cypress-recurse';

    Cypress.Commands.add('addNewTrigger', (triggerName, triggerDescription, relevantpartie, priorityRationale) => {
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => { //Go to Monitoring Page
            cy.wait(1000);
            cy.get(projectTriggerSelector.projectTriggerListTab).click();
            cy.get(projectTriggerSelector.addNewTriggerButton).click().then(() => {
                recurse(() =>
                    cy.get(projectTriggerSelector.triggerNameFieldBox).clear().type(triggerName),
                    ($inputField) => $inputField.val() === triggerName,
                    { delay: 1000 })    
                    .should('have.value', triggerName).then(() => {
                        recurse(() =>
                            cy.get(projectTriggerSelector.triggerDescriptionFieldBox).clear().type(triggerDescription), 
                            ($inputField) => $inputField.val() === triggerDescription,
                            { delay: 1000 })
                            .should('have.value', triggerDescription).then(() => {
                                recurse(() =>
                                    cy.get(projectTriggerSelector.relevantPartieFieldBox).clear().type(relevantpartie), 
                                    ($inputField) => $inputField.val() === relevantpartie,
                                    { delay: 1000 })
                                    .should('have.value', relevantpartie).then(() => {
                                        cy.get(projectTriggerSelector.triggerPriorityFieldButton).click();
                                        cy.get(projectTriggerSelector.triggerPriorityDropDownList).contains('High').click().then(() => {
                                            recurse(() =>
                                                cy.get(projectTriggerSelector.priorityRationaleFieldBox).clear().type(priorityRationale),  
                                                ($inputField) => $inputField.val() === priorityRationale,
                                                { delay: 1000 })
                                                .should('have.value', priorityRationale).then(() => {
                                                    cy.get(projectTriggerSelector.statusCheckBox).check();
                                                    cy.get(projectTriggerSelector.newTriggerConfirmButton).click().then(() => {
                                                        cy.get(projectTriggerSelector.addNewTriggerSnackBar).should('include.text',' Trigger added successfully\n');
                                                    })
                                                })
                                        })
                                    })
                            })
                    })
            })
        })
    })

    Cypress.Commands.add('generateTrigger', () => {
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => { //Go to Monitoring Page
            cy.wait(1000);
            cy.get(projectTriggerSelector.projectTriggerListTab).click().then(() => {
                cy.get(projectTriggerSelector.generateTriggerButton).should('exist').click();
                cy.get(projectTriggerSelector.generateTriggerTextDialog).should('be.visible');
                cy.get(projectTriggerSelector.modelingViewText).should('be.visible');
                cy.get(projectTriggerSelector.ProjectBomText).should('be.visible');
                cy.get(projectTriggerSelector.generateTriggerDialogGenerateButton).click().then(() => {
                    cy.get(projectTriggerSelector.addNewTriggerSnackBar).should('include.text',' Triggers have been generated');
                    cy.get(projectTriggerSelector.generateTriggerLoader).should('exist');
                })
            })
        })
    })

    Cypress.Commands.add('searchTrigger', (triggerName) => {
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => { //Go to Monitoring Page
            cy.wait(1000);
            cy.get(projectTriggerSelector.projectTriggerListTab).click().then(() => {
                recurse(() =>
                    cy.get(projectTriggerSelector.searchTriggerBox).click().type(triggerName),  
                    ($inputField) => $inputField.val() === triggerName,
                    { delay: 1000 })
                    .should('have.value', triggerName);
            })
        })
    })

    Cypress.Commands.add('deleteTrigger', (triggerRow) => {
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => { //Go to Monitoring Page
            cy.wait(1000);
            cy.get(projectTriggerSelector.projectTriggerListTab).click().then(() => {
                cy.get(projectTriggerSelector.projectTriggerDropDownActionButton).eq(triggerRow - 1).click();
                cy.get(projectTriggerSelector.deleteTriggerButton).should('be.visible')
                cy.get(projectTriggerSelector.deleteTriggerButton).click().then(() => {
                    cy.get(projectTriggerSelector.confirmToDeleteTriggerButton).should('be.visible')
                    cy.get(projectTriggerSelector.confirmToDeleteTriggerButton).click().then(() => {
                        cy.get(projectTriggerSelector.deleteTriggerSnackBar).should('include.text',' Trigger has been deleted successfully!');
                    })
                })
            })
        })
    })

    Cypress.Commands.add('cancelDeleteTrigger', () => {
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => { //Go to Monitoring Page
            cy.wait(1000);
            cy.get(projectTriggerSelector.projectTriggerListTab).click().then(() => {
                cy.get(projectTriggerSelector.projectTriggerDropDownActionButton).eq(1).click();
                cy.get(projectTriggerSelector.deleteTriggerButton).should('be.visible')
                cy.get(projectTriggerSelector.deleteTriggerButton).click().then(() => {
                    cy.get(projectTriggerSelector.cancelToDeleteTriggerButton).should('be.visible')
                    cy.get(projectTriggerSelector.cancelToDeleteTriggerButton).click();
                })
            })
        })
    })    