const navBarSelector = require('../../selectors/navBarSelector.js')
const damageScenarioSelector = require("../../selectors/damageScenarioSelector.js");
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('Damage Scenario', () => {
      var projectId;

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

      it('Restore Threat Button in Edit Menu (MAIN-TC-247,MAIN-TC-1204)', () => {
            cy.visit(Cypress.env('baseURL'))
            cy.get(navBarSelector.navBarEditButton).click()
            cy.get(navBarSelector.editListRestoreThreatButton).should('contain', 'Restore Threat');
            cy.visit(Cypress.env('baseURL') + '/threats');
            cy.get(navBarSelector.navBarEditButton).click()
            cy.get(navBarSelector.editListRestoreThreatButton).should('be.enabled');
      })

      it('Damage Scenario Test Cases (MAIN-TC-1731, MAIN-TC-1732, MAIN-TC-1733)', () => {
            cy.visit(Cypress.env('baseURL'));
            cy.get(navBarSelector.navBarViewButton).click()
            // cy.get('.mat-mdc-menu-item').eq(9).should('contain','Damage Scenario Pool');
            cy.visit(`${Cypress.env('baseURL')}/damage-scenario-pool`);
            cy.get(damageScenarioSelector.noDamageScenarioParagraph).should('contain', 'No damage scenario found in the pool')
            cy.get(damageScenarioSelector.damageScenarioAddButton).should('be.enabled');
      })

      it('Creating a New Damage Scenario (MAIN-TC-1734, MAIN-TC-1735, MAIN-TC-1736, MAIN-TC-1737)', () => {
            let damageScenario = 'TC-1734: Adding Damage scenario Testing'
            cy.visit(`${Cypress.env('baseURL')}/damage-scenario-pool`);
            cy.get(damageScenarioSelector.damageScenarioAddButton).click();
            cy.get(damageScenarioSelector.damageScenarioDialogContainer).should('exist');
            cy.get(damageScenarioSelector.damageScenarioDialogHeader).should('contain', 'Add New Damage Scenario');
            cy.get(damageScenarioSelector.damageScenarioDialogConfirmButton).should('be.disabled');
            recurse(() =>
                  cy.get(damageScenarioSelector.damageScenarioDescriptionTextArea).clear().type(damageScenario),
                  ($inputField) => $inputField.val() === damageScenario,
                  { delay: 1000 })
                  .should('have.value', damageScenario)
            cy.get(damageScenarioSelector.damageScenarioDialogConfirmButton).should('be.enabled').click();
            cy.get(damageScenarioSelector.damageScenarioTableIdThead).should('exist').should('contain', 'ID');
            cy.get(damageScenarioSelector.damageScenarioTableDescriptionThead).should('exist').should('contain', 'Description');
      })

      it('Editing the Damage Scenario (MAIN-TC-1739, MAIN-TC-1742)', () => {
            cy.visit(`${Cypress.env('baseURL')}/damage-scenario-pool`);
            cy.reload(true);
            cy.get(damageScenarioSelector.damageScenarioDescriptionTextArea).should('exist').click();
            cy.get(damageScenarioSelector.damageScenarioDialogHeader).should('contain', 'Edit Damage Scenario');
            cy.get(damageScenarioSelector.damageScenarioDialogIdInput).should('be.disabled');
            cy.get(damageScenarioSelector.damageScenarioDialogDescriptionInput).should('be.enabled');
      })

      it('Adding and Deleting the Damage Scenario (MAIN-TC-1741, MAIN-TC-1740, MAIN-TC-2126)', () => {
            let damageScenario = 'TC-1741: Adding another Damage scenario for Testing'
            cy.visit(`${Cypress.env('baseURL')}/damage-scenario-pool`);
            cy.get(damageScenarioSelector.damageScenarioAddButton).click();
            cy.get(damageScenarioSelector.damageScenarioDialogContainer).should('exist');
            cy.get(damageScenarioSelector.damageScenarioDialogHeader).should('contain', 'Add New Damage Scenario');
            recurse(() =>
                  cy.get(damageScenarioSelector.damageScenarioDialogDescriptionInput).clear().type(damageScenario),
                  ($inputField) => $inputField.val() === damageScenario,
                  { delay: 1000 })
                  .should('have.value', damageScenario)
            cy.get(damageScenarioSelector.damageScenarioDialogConfirmButton).should('be.enabled').click();
            cy.wait(2000);
            cy.get(damageScenarioSelector.damageScenarioDescriptionTextArea).should('have.length.at.least', 2);             //Verify the two entries of Damage Scenario
            cy.get(damageScenarioSelector.damageScenarioPagination).should('contain', '2 of 2');
            cy.get(damageScenarioSelector.damageScenarioMoreActionButton).eq(1).click();
            cy.get(damageScenarioSelector.damageScenarioDeleteButton).click() //Deleting the second Damage scenario
            cy.get(navBarSelector.confirmDialogueDeleteButton).last().click();
            cy.get(damageScenarioSelector.damageScenarioDescriptionTextArea).should('have.length.at.most', 1);
      })

      it('Verify that when the pool damage scenario is changed, it is updated everywhere it is used in threats (MAIN-TC-1805)', () => {
            cy.createModel().then(() => {
                  cy.visit(`${Cypress.env('baseURL')}/damage-scenario-pool`).then(() => {
                        let damageScenarioDescription = 'Adding Damage scenario Testing';
                        cy.get(damageScenarioSelector.damageScenarioAddButton).click().then(() => {
                              cy.get(damageScenarioSelector.damageScenarioDialogContainer).should('be.visible');
                              cy.get(damageScenarioSelector.damageScenarioDialogHeader).should('contain', 'Add New Damage Scenario');
                              recurse(() =>
                              cy.get(damageScenarioSelector.damageScenarioDescriptionTextArea).last().type(damageScenarioDescription),
                                    ($inputField) => $inputField.val() === damageScenarioDescription,
                                    { delay: 1000 })
                                    .should('have.value', damageScenarioDescription)
                              cy.get(damageScenarioSelector.damageScenarioDialogConfirmButton).should('be.enabled').click();
                        }).then(() => {
                              cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
                                    cy.wait(2000);
                                    //open DS dialog
                                    cy.get(damageScenarioSelector.damageScenarioDescriptionTextArea).eq(3).click();
                                    //choose prev made DS
                                    cy.get(damageScenarioSelector.damageScenarioReplacementForm).click();
                                    cy.get(damageScenarioSelector.damageScenarioReplacementListOption).contains(damageScenarioDescription).click();
                                    damageScenarioDescription = 'After Update';
                                    //update its desc
                                    cy.get(damageScenarioSelector.damageScenarioDescriptionTextArea).last().clear().type(damageScenarioDescription);
                                    cy.get(navBarSelector.confirmDialogueConfirmButton).should('be.enabled').click();
                              });
                        }).then(() => {
                              //go to DS pool
                              //assert the changes
                              cy.visit(`${Cypress.env('baseURL')}/damage-scenario-pool`).then(() => {
                                    cy.get(damageScenarioSelector.damageScenarioDescriptionTextArea).should('include.value', damageScenarioDescription).should('be.visible');
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