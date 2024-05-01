const navBarSelector = require('../../selectors/navBarSelector.js');
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
const projectBomSelector = require('../../selectors/projectBomSelector.js');
import { recurse } from 'cypress-recurse'
var projectName;

describe('Model Creation and Generating Threats', () => {
      var projectId;

      before('Test Case 1: Creating a new Project(MAIN-TC-1765)', () => {
            cy.viewport(1920, 1080);
            cy.login();
            // Generate a random project name
            cy.generateProjectName().then(($generatedName) => {
                  projectName = $generatedName;
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
            })
      })

      beforeEach('Loging In', () => {
            cy.viewport(1920, 1080);
            cy.login();
            cy.loadProject(projectId);
      })

      it('Test Case 1: Creating a new Model (MAIN-TC-789, MAIN-TC-790, MAIN-TC-792, MAIN-TC-785, MAIN-TC-151)', () => {
            const dataTransfer = new DataTransfer();
            // Opem Modeling Page
            cy.visit(Cypress.env("baseURL") + "/modeling");
            cy.url().should('contain', '/modeling').then(() => {             //Assertion to check if modeiing page is opened
                  //Working on Drag and Drop
                  cy.wait(1000);
                  // Get the source element you want to drag
                  cy.get(modelingViewSelector.componentLibraryMicrocontroller)
                        .trigger('dragstart', { dataTransfer, force: true })
            }).then(() => {
                  cy.get(modelingViewSelector.modelingViewCanvas)
                        .trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
            }).then(() => {
                  // Continue chaining other actions as needed
                  cy.get(modelingViewSelector.componentLibraryModule)
                        .trigger('dragstart', { dataTransfer, force: true });
            }).then(() => {
                  cy.get(modelingViewSelector.modelingViewCanvas)
                        .trigger('drop', { dataTransfer, force: true, clientX: 800, clientY: 400 });
            }).then(() => {
                  cy.get(modelingViewSelector.componentLibraryUserAttacker)
                        .trigger('dragstart', { dataTransfer, force: true });
            }).then(() => {
                  cy.get(modelingViewSelector.modelingViewCanvas)
                        .trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 800 });
            }).then(() => {
                  cy.get(modelingViewSelector.componentLibraryCommunicationLine)
                        .trigger('dragstart', { dataTransfer, force: true });
            }).then(() => {
                  cy.get(modelingViewSelector.modelingViewCanvas)
                        .trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 400 });
            }).then(() => {
                  cy.wait(2000);
                  cy.get(modelingViewSelector.componentLibraryCommunicationLine)
                        .trigger('dragstart', { dataTransfer, force: true });
            }).then(() => {
                  cy.get(modelingViewSelector.modelingViewCanvas)
                        .trigger('drop', { dataTransfer, force: true, clientX: 500, clientY: 600 });
            }).then(() => {
                  // Asserting the Delete dialog box when deleting the Communication Line
                  // Have to delete this line
                  cy.get(modelingViewSelector.componentLibraryCommunicationLine)
                        .trigger('dragstart', { dataTransfer, force: true });
            }).then(() => {
                  cy.get(modelingViewSelector.modelingViewCanvas)
                        .trigger('drop', { dataTransfer, force: true, clientX: 700, clientY: 600 });
            }).then(() => {
                  cy.wait(2000);
                  cy.get(modelingViewSelector.drawingCanvasCommunicationLine).eq(2).rightclick({ force: true });
            }).then(() => {
                  cy.get(modelingViewSelector.componentSpecRemoveLineButton).click({ force: true });
            }).then(() => {
                  cy.get(navBarSelector.confirmDialogueParagraph).should('contain', 'Are you sure you want to delete');
            }).then(() => {
                  cy.get(navBarSelector.confirmDialogueDeleteButton).click({ force: true });
            }).then(() => {
                  // Connecting the Wire with Actor and Module
                  cy.get(modelingViewSelector.drawingCanvasLineStartCircle).eq(0).realClick().realMouseDown().realMouseMove(-250, 0).get(modelingViewSelector.drawingCanvasMicrocontroller).realMouseUp();
                  cy.get(modelingViewSelector.drawingCanvasLineEndCircle).eq(0).realClick().realMouseDown().realMouseMove(50, 0).get(modelingViewSelector.drawingCanvasModule).eq(0).realMouseUp();
                  cy.get(modelingViewSelector.drawingCanvasLineStartCircle).eq(1).realClick().realMouseDown().realMouseMove(-20, -250).get(modelingViewSelector.drawingCanvasMicrocontroller).realMouseUp();
                  cy.get(modelingViewSelector.drawingCanvasLineEndCircle).eq(1).realClick().realMouseDown().realMouseMove(20, -250).get(modelingViewSelector.drawingCanvasModule).eq(1).realMouseUp();
                  cy.wait(1000);
            }).then(() => {
                  cy.get(modelingViewSelector.modelingViewSaveIcon).click();// save
                  return cy.wait(1000);
            })
      })

      it('Test Case 2: Add Project BOM (MAIN-TC-1839, MAIN-TC-907)', () => {
            cy.visit(Cypress.env('baseURL')).then(() => {
                  cy.wait(2000);
                  cy.get(navBarSelector.navBarViewButton).click();
            }).then(() => {
                  cy.get(navBarSelector.viewListProjectBomButton).click();
                  cy.wait(1000);
            }).then(() => {
                  cy.get(projectBomSelector.projectBomAddNewBomButton).should('not.be.disabled').click();
                  recurse(() =>
                        cy.get(projectBomSelector.addNewBomFormVersionInput).clear().type('Automation ID 1'),
                        ($inputField) => $inputField.val() === 'Automation ID 1',
                        { delay: 1000 })
                        .should('have.value', 'Automation ID 1');
            }).then(() => {
                  recurse(() =>
                        cy.get(projectBomSelector.addNewBomDialogProductInput).clear().type('Product ID 1'),
                        ($inputField) => $inputField.val() === 'Product ID 1',
                        { delay: 1000 })
                        .should('have.value', 'Product ID 1');
            }).then(() => {
                  recurse(() =>
                        cy.get(projectBomSelector.addNewBomDialogVendorInput).clear().type('Vendor ID 1'),
                        ($inputField) => $inputField.val() === 'Vendor ID 1',
                        { delay: 1000 })
                        .should('have.value', 'Vendor ID 1');
            }).then(() => {
                  cy.get(projectBomSelector.addNewBomDialogPartSelect).click();
                  cy.get(projectBomSelector.addNewBomDialogPartOption).eq(1).click()
            }).then(() => {
                  cy.get(projectBomSelector.addNewBomDialogConfirmButton).should('exist').click();
                  cy.wait(3000);
            }).then(() => {
                  cy.get(projectBomSelector.projectBomAddFromMicroLibraryButton).should('not.be.disabled').click({ force: true }); // Add BOM from Micro Library
                  cy.get(projectBomSelector.addFromMicroLibraryFilterListOption).eq(2).click();
                  recurse(() =>
                        cy.get(projectBomSelector.addNewBomFormVersionInput).clear().type('Version1'),
                        ($inputField) => $inputField.val() === 'Version1',
                        { delay: 1000 })
                        .should('have.value', 'Version1');
            }).then(() => {
                  cy.get(navBarSelector.confirmDialogueConfirmButton).should('exist').click();
            }).then(() => {
                  cy.visit(Cypress.env("baseURL") + "/modeling");
            }).then(() => {
                  cy.wait(2000);
                  cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
            }).then(() => {
                  cy.get(modelingViewSelector.componentSpecSoftwareBomLabel).click({ force: true });
            }).then(() => {
                  cy.get(navBarSelector.dropDownOption).contains('Product ID 1').click({ force: true });
            }).then(() => {
                  cy.get(modelingViewSelector.componentSpecSoftwareBomChipDialog)
                        .should('include.text', 'Product ID 1')
                        .and('include.text', 'Vendor ID 1');
            })
      })

      it("Test Case 3: Adding Features to Project & Generating Threats (MAIN-TC-152, MAIN-TC-1674, MAIN-TC-906)", () => {
            cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
                  cy.wait(2000);
                  //Adding project Features 
                  cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
            }).then(() => {
                  cy.wait(500);
                  recurse(() =>
                        cy.get(modelingViewSelector.componentSpecComponentNameInput).clear().type('Automation Test Micro'),
                        ($inputField) => $inputField.val() === 'Automation Test Micro',
                        { delay: 1000 })
                        .should('have.value', 'Automation Test Micro');
            }).then(() => {
                  //component model
                  cy.get(modelingViewSelector.componentSpecComponentModelInput).click();
            }).then(() => {
                  //Feature Setting
                  cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click();
            }).then(() => {
                  cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTestOption).click()
            }).then(() => {
                  //Selecting Tested 
                  cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click();
            }).then(() => {
                  //software BOM
                  cy.wait(1000);
                  //Adding Feature to Communication Line
                  //Line 1
                  cy.get(modelingViewSelector.drawingCanvasCommunicationLine).eq(0).rightclick({ force: true });
            }).then(() => {
                  cy.wait(1000);
                  recurse(() =>
                        cy.get(modelingViewSelector.communicationLineSpecNameInput).clear().type("Communication Line 1"),
                        ($inputField) => $inputField.val() === 'Communication Line 1',
                        { delay: 1000 })
                        .should('have.value', 'Communication Line 1');
            }).then(() => {
                  cy.get(modelingViewSelector.communicationLineSpecTransmissionSelect).click()
                  cy.get(modelingViewSelector.transmissionMediaShortRangeWirelessOption).click();
            }).then(() => {
                  cy.wait(1000);
                  cy.get(modelingViewSelector.communicationLineSpecBaseProtocolSelect).click()
                  cy.get(modelingViewSelector.baseProtocolBluetoothOption).click();
            }).then(() => {
                  cy.wait(500);
                  //Line 2
                  cy.get(modelingViewSelector.drawingCanvasCommunicationLine).eq(1).rightclick({ force: true });
            }).then(() => {
                  cy.wait(500);
                  recurse(() =>
                        cy.get(modelingViewSelector.communicationLineSpecNameInput).clear().type("Communication Line 2"),
                        ($inputField) => $inputField.val() === 'Communication Line 2',
                        { delay: 1000 })
                        .should('have.value', 'Communication Line 2');
            }).then(() => {
                  cy.get(modelingViewSelector.communicationLineSpecTransmissionSelect).click();
                  cy.get(modelingViewSelector.transmissionMediaShortRangeWirelessOption).click();
            }).then(() => {
                  cy.wait(500);
                  cy.get(modelingViewSelector.communicationLineSpecBaseProtocolSelect).click()
                  cy.get(modelingViewSelector.baseProtocolBluetoothOption).click();
            }).then(() => {
                  cy.wait(1000);
                  //Generating Threats
                  cy.get(navBarSelector.navBarEditButton).click();
            }).then(() => {
                  cy.get(navBarSelector.editListRunTheModelButton).first().click();
            }).then(() => {
                  cy.get(navBarSelector.loader).should('be.visible'); //assertion to check if the loader is being shown
                  cy.wait(10000).then(() => {
                        cy.url().should('contain', '/threats');
                  })
            })
      })
})

describe('CLEANUP: Project Deletion', () => {
      it('Deleting The Project If Created', () => {
            cy.viewport(1920, 1080);
            cy.login().then(() => {
                  cy.visit(Cypress.env('baseURL') + '/dashboard').then(() => {
                        cy.wait(1000);
                        cy.get(navBarSelector.navBarProjectButton).should('be.visible').then(() => {
                              cy.get(navBarSelector.navBarProjectButton).click();
                        }).then(() => {
                              cy.get(navBarSelector.projectListDeleteProjectButton).click();
                        }).then(() => {
                              cy.wait(1000);
                              cy.contains(projectName).then(($element) => {
                                    if ($element.length) {//project exists
                                          cy.deleteProject(projectName);
                                    }
                              });
                        })
                  })
            })
      })
})