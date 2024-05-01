const navBarSelector = require('../../selectors/navBarSelector.js');
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('Creating Model', () => {
  var projectId;  //to store the project Id which is used in next test case to draw a diagram and delete the project

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login();
    cy.loadProject(projectId);
  });

  before('Creating a New Project (MAIN-TC-756)', () => {
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
      expect(newDesignData.project).to.not.be.undefined;
      // Extract the project ID from the nested structure
      projectId = newDesignData.project.id;                         //projectId to be used 
      expect(projectId).to.not.be.undefined;
      cy.log("Project ID is: " + projectId);
    })
  })

  it('1. Modeling Page Cases: Deleting the Components(MAIN-TC-787, MAIN-TC-788, MAIN-TC-789, MAIN-TC-786)', () => {
    const dataTransfer = new DataTransfer();
    cy.visit(Cypress.env("baseURL")).then(() => {
      cy.get(navBarSelector.navBarLeftSeparator).should('exist');
    }).then(() => {
      cy.get(navBarSelector.navBarEditButton).click(); //Click Edit in navigation bar to open it
    }).then(() => {
      cy.get(navBarSelector.editListRestoreThreatButton).should('not.be.enabled');
    }).then(() => {
      cy.get(navBarSelector.navBarEditButton).click({ force: true });//Click Edit in navigation bar to close it
    }).then(() => {
      // Open Modeling Page
      cy.visit(Cypress.env("baseURL") + "/modeling").url().should('contain', '/modeling');
    }).then(() => {
      cy.get(modelingViewSelector.componentLibraryMicrocontroller)
        .trigger('dragstart', { dataTransfer, force: true });
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewCanvas)
        .trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
    }).then(() => {
      cy.get(modelingViewSelector.componentLibraryModule)
        .trigger('dragstart', { dataTransfer, force: true });
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewCanvas)
        .trigger('drop', { dataTransfer, force: true, clientX: 800, clientY: 400 });
    }).then(() => {
      cy.get(modelingViewSelector.componentLibraryCommunicationLine)
        .trigger('dragstart', { dataTransfer, force: true });
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewCanvas)
        .trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 400 });
    }).then(() => {
      // Deleting Micro controller 
      cy.wait(2000);
      cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick().wait(500);
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecRemoveMicroButton).click({ force: true });
      cy.get(navBarSelector.confirmToDeleteDialogue).should('include.text', 'CONFIRM TO DELETE');
      cy.get(navBarSelector.confirmDialogueCancelButton).click();
    }).then(() => {
      // Deleting the Module
      cy.get(modelingViewSelector.drawingCanvasModule).rightclick().wait(500);
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecRemoveModuleButton).click({ force: true });
      cy.get(navBarSelector.confirmToDeleteDialogue).should('include.text', 'CONFIRM TO DELETE');
      cy.get(navBarSelector.confirmDialogueCancelButton).click();
    }).then(() => {
      // Deleting the communication line
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true }).wait(500);
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecRemoveLineButton).click({ force: true });
      cy.get(navBarSelector.confirmToDeleteDialogue).should('include.text', 'CONFIRM TO DELETE');
      cy.get(navBarSelector.confirmDialogueCancelButton).click();
    })
  })

  it('2. Model Creation: Verifying Project Name and Save Button on canvas(MAIN-TC-2045, MAIN-TC-1184, MAIN-TC-1185, MAIN-TC-1186)', () => {
    const dataTransfer = new DataTransfer();
    // Open Modeling Page
    cy.visit(Cypress.env("baseURL") + "/modeling");
    cy.url().should('contain', '/modeling').then(() => { // Assertion to check if modeling page is opened
      // Working on Drag and Drop
      cy.get(modelingViewSelector.componentLibraryMicrocontroller)
        .trigger('dragstart', { dataTransfer, force: true });
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewCanvas)
        .trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });
    }).then(() => {
      cy.get(modelingViewSelector.componentLibraryModule)
        .trigger('dragstart', { dataTransfer, force: true });
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewCanvas)
        .trigger('drop', { dataTransfer, force: true, clientX: 800, clientY: 400 });
    }).then(() => {
      cy.get(modelingViewSelector.componentLibraryCommunicationLine)
        .trigger('dragstart', { dataTransfer, force: true });
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewCanvas)
        .trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 400 });
    }).then(() => {
      // Connecting the Wire with Actor and Module
      cy.get(modelingViewSelector.drawingCanvasLineStartCircle).realClick().realMouseDown().realMouseMove(-250, 0).get(modelingViewSelector.drawingCanvasMicrocontroller).realMouseUp();
      cy.get(modelingViewSelector.drawingCanvasLineEndCircle).realClick().realMouseDown().realMouseMove(50, 0).get(modelingViewSelector.drawingCanvasModule).eq(0).realMouseUp();
    }).then(() => {
      // Asserting the project name is being shown on canvas
      cy.get(modelingViewSelector.modelingViewSaveIcon).should('exist').click(); // Assertion Save button and saving project
      cy.wait(2000);
    })
  })


  it('3. Logical Line in Transmission Media drop-down (MAIN-TC-2497, MAIN-TC-2498, MAIN-TC-2501)', () => {
    // Open Modeling Page
    cy.visit(Cypress.env("baseURL") + "/modeling");
    cy.url().should('contain', '/modeling').then(() => { // Assertion to check if modeling page is opened
      cy.wait(2000);  
      cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
    }).then(() => {
      cy.wait(500);
      cy.get(modelingViewSelector.componentSpecComponentNameInput).clear().type('Automation Test Micro');
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click()
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTestOption).click(); // Selecting from Drop Down
      cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click();
    }).then(() => {
      // Adding features to Module
      cy.get(modelingViewSelector.drawingCanvasModule).rightclick();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click();
      cy.get(modelingViewSelector.moduleSelectBatteryOption).click();
      cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click({ force: true });
    }).then(() => {
      // Comm Line
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true });
    }).then(() => {
      cy.get(modelingViewSelector.communicationLineSpecNameInput).clear().type("Communication Line 1")
      cy.get(modelingViewSelector.communicationLineSpecTransmissionSelect).click()
      cy.get(modelingViewSelector.transmissionMediaLogicalLineOption).click();
      cy.wait(1000);
    }).then(() => {
      cy.get(modelingViewSelector.communicationLineSpecBaseProtocolSelect).click()
      cy.get(modelingViewSelector.baseProtocolLogicalLineOption).should('contain', 'Logical Line');
      cy.wait(500);
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true });
    }).then(() => {
      cy.get(navBarSelector.navBarEditButton).click();
    }).then(() => {
      cy.get(navBarSelector.editListRunTheModelButton).first().click();
    }).then(() => {
      cy.wait(1000);
      cy.get(modelingViewSelector.modelingViewSnackBar).invoke('text').should('include', 'Error: No threat is found');
    })
  })

  it('Verify that when user right-click on sensor input, features that do NOT have any “process” type of asset should be disabled (MAIN-TC-868, MAIN-TC-2623, MAIN-TC-2624, MAIN-TC-2638, MAIN-TC-2639, MAIN-TC-2640, MAIN-TC-2642, MAIN-TC-2643)', () => {
    let initialTopPosition;
    let initialLeftPosition;
    const dataTransfer = new DataTransfer();
    cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
      cy.wait(2000);
      //delete micro controller
      cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecRemoveMicroButton).click();
    }).then(() => {
      cy.get(navBarSelector.confirmDialogueDeleteButton).click();
    }).then(() => {
      //delete comm line
      cy.wait(1000);
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true });
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecRemoveLineButton).click();
    }).then(() => {
      cy.get(navBarSelector.confirmDialogueDeleteButton).click();
    }).then(() => {
      //place sensor input
      cy.get(modelingViewSelector.componentLibrarySensorInput).trigger('dragstart', { dataTransfer, force: true });
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 100 });
    }).then(() => {
      cy.wait(500);
      //connect sensor with module
      cy.get(modelingViewSelector.drawingCanvasLineEndCircle)
        .realClick({ scrollBehavior: false })
        .realMouseDown()
        .realMouseMove(50, 0)
        .get(modelingViewSelector.drawingCanvasModule)
        .realMouseUp({ force: true });
    }).then(() => {
      cy.wait(500);
      //select module features using pre-defined module 'front facing camera' in library
      cy.get(modelingViewSelector.drawingCanvasModule).rightclick();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingFrontFacingCameraOption).click();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click();
    }).then(() => {
      cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Features confirmed. Security assets updated!');
    }).then(() => {
      //loading finished after submitting features
      cy.get(navBarSelector.loader).should('not.exist');
      //assert sensor feature labels are disabled
      cy.get(modelingViewSelector.drawingCanvasSensorInput).rightclick();
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewComponentSettingsTab).should('be.visible');
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureDropDownArrow).first().click();
    }).then(() => {
      cy.get(modelingViewSelector.communicationLineLaneDepartureAlertMessageLabel).should('have.css', 'pointer-events', "none"); // not clickable
      cy.get(modelingViewSelector.communicationLineLaneDepartureAlertSwCodeLabel).should('have.css', 'pointer-events', "none"); // not clickable
      cy.get(modelingViewSelector.communicationLineSoftwareUpdateLabel).should('not.have.css', 'pointer-events', "none");
      cy.get(modelingViewSelector.communicationLineLaneDepartureAlertSwProcessLabel).should('not.have.css', 'pointer-events', "none");
    }).then(() => {
      //display sensor input protocol text
      cy.get(modelingViewSelector.componentSpecSensorInputMediaLabel).click({ force: true });
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecSensorInputMediaShortRange).click();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecSensorInputTypeLabel).click({ force: true });
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecSensorInputTypeOCHV).click();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecSensorDisplayProtocolLabel).click({ force: true });
    }).then(() => {
      //store the initial position
      cy.get(modelingViewSelector.drawingCanvasSensorInputProtocolTextOCHV).scrollIntoView().then(($text) => {
        initialTopPosition = $text.position().top;
        initialLeftPosition = $text.position().left;
        cy.log(initialTopPosition);
      });
    }).then(() => {
      //move the text
      cy.get(modelingViewSelector.drawingCanvasSensorInputProtocolTextOCHV).move({ deltaX: 100, deltaY: 100 });
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecSensorDisplayProtocolLabel).click({ force: true });
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecSensorDisplayProtocolLabel).click({ force: true });
    }).then(() => {
      //assert the position is reverted
      cy.get(modelingViewSelector.drawingCanvasSensorInputProtocolTextOCHV).scrollIntoView().should(($text) => {
        expect($text.position().top).to.equal(initialTopPosition);
        expect($text.position().left).to.equal(initialLeftPosition);
      });
    })
  })

  it('Verify that if features not confirmed, a snack bar message shows that they are not confirmed yet and a new design could be created(MAIN-TC-2560, MAIN-TC-956, MAIN-TC-1791)', () => {
    let assetName = 'CAN';
    const dataTransfer = new DataTransfer();
    // Visit another page if needed.
    cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
      //place module
      cy.get(modelingViewSelector.componentLibraryModule).trigger('dragstart', { dataTransfer, force: true })
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 800 });
    }).then(() => {
      cy.wait(500);
      //select asset
      cy.get(modelingViewSelector.drawingCanvasModule).last().rightclick();
    }).then(() => {
      cy.get(modelingViewSelector.securitySettingTab).click();
    }).then(() => {
      recurse(
        () => cy.get(modelingViewSelector.assetComponentSearchBox).clear().type(assetName),
        ($inputField) => $inputField.val() === assetName,
        { delay: 1000 })
    }).then(() => {
      cy.get(modelingViewSelector.assetComponentDropdownList).contains(assetName).should('be.visible').click();
    }).then(() => {
      //assert it is not stuck and the snack bar msg exists
      cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Confirm Features to commit security assets');
    }).then(() => {
      cy.get(navBarSelector.navBarEditButton).click();
    }).then(() => {
      cy.get(navBarSelector.editListNewDesignButton).click();
    }).then(() => {
      recurse(
        () => cy.get(navBarSelector.confirmDialogTypeConfirmInput).clear().type('confirm'),
        ($inputField) => $inputField.val() === 'confirm',
        { delay: 1000 })
    }).then(() => {
      cy.intercept('DELETE', '*').as('deleteRequest');
      cy.get(navBarSelector.confirmDialogueConfirmButton).last().click();
    }).then(() => {
      cy.wait(5000);
      cy.get('@deleteRequest').its('response.statusCode').should('eq', 200);
    }).then(() => {
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).should('not.exist');
      cy.get(modelingViewSelector.drawingCanvasMicrocontroller).should('not.exist');
      cy.get(modelingViewSelector.drawingCanvasModule).should('not.exist');
    })
  })

  it('Verify that running the model without confirming a feature - no error is displayed (MAIN-TC-1799)', () => {
    cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
      recurse(
        () => cy.wrap(Cypress.$(navBarSelector.loader).length),
        ($loaderExist) => $loaderExist == false,//length === 0
        { delay: 1000 })
    }).then(() => {
      cy.dragAndDropModel();
    }).then(() => {
      cy.wait(2000);
      cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
      cy.wait(2000);
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingTestOption).click();
    }).then(() => {
      recurse(
        () => cy.wrap(Cypress.$(navBarSelector.loader).length),
        ($loaderExist) => $loaderExist == false,
        { delay: 1000 })
    }).then(() => { // Assertion for running the model without confirming the MicroController feature will not cause error
      cy.get(modelingViewSelector.drawingCanvasModule).rightclick();
      cy.wait(2000);
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingTestOption).click();
    }).then(() => {
      recurse(
        () => cy.wrap(Cypress.$(navBarSelector.loader).length),
        ($loaderExist) => $loaderExist == false,
        { delay: 1000 });
    }).then(() => { // Assertion for running the model without confirming the Module feature will not cause error
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true }); 
      cy.wait(2000);
    }).then(() => {
      cy.get(modelingViewSelector.communicationLineSpecTransmissionSelect).click();
    }).then(() => {
      cy.get(modelingViewSelector.transmissionMediaShortRangeWirelessOption).click();
      cy.get(modelingViewSelector.communicationLineSpecBaseProtocolSelect).click();
    }).then(() => {
      cy.get(modelingViewSelector.baseProtocolBluetoothOption).click();
    }).then(() => {
      cy.get(modelingViewSelector.baseProtocolBluetoothOption).should('not.exist');
      cy.get(modelingViewSelector.communicationLineRemoteDiagnosticsLabel).first().click({ force: true });
      cy.get(modelingViewSelector.communicationLineEthernetCommunicationLabel).first().click({ force: true });
    }).then(() => {
      cy.get(navBarSelector.navBarEditButton).click();
    }).then(() => {
      cy.get(navBarSelector.editListRunTheModelButton).first().click();
    }).then(() => {
      cy.get(navBarSelector.loader).should('be.visible'); //assertion to check if the loader is being shown
      cy.wait(5000);
    }).then(() => {
      cy.url().should('contain', '/threats');
    }).then(() => {
      cy.visit(Cypress.env("baseURL") + "/modeling");
      cy.wait(1000);
      cy.get(modelingViewSelector.drawingCanvasMicrocontroller).rightclick();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecRemoveMicroButton).click();
      cy.get(navBarSelector.confirmDialogueDeleteButton).click();
      cy.wait(1000);
    }).then(() => {
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true });
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecRemoveLineButton).click();
      cy.get(navBarSelector.confirmDialogueDeleteButton).click();
      cy.wait(1000);
    }).then(() => {
      cy.get(modelingViewSelector.drawingCanvasModule).rightclick();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecRemoveModuleButton).click();
      cy.get(navBarSelector.confirmDialogueDeleteButton).click();
      cy.wait(1000);
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewSaveIcon).click();
    })
  })

  it('Verify in Modeling Results, only ten threats will be displayed per page(MAIN-TC-1651)', () => {
    cy.createModel().then(() => {
      cy.visit(Cypress.env("baseURL") + "/modeling");
    }).then(() => {
      cy.get(modelingViewSelector.drawingCanvasModule).rightclick();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea).click();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingFrontFacingCameraOption).click();
    }).then(() => {
      cy.get(modelingViewSelector.componentSpecFeatureSettingsSubmitButton).click();
    }).then(() => {
      cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Features confirmed. Security assets updated!');
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true });
    }).then(() => {
      cy.get(modelingViewSelector.communicationLineAutoEmergencyBrakeLabel).click({ force: true });
      cy.get(modelingViewSelector.communicationLineSoftwareUpdateLabel).click({ force: true });
      cy.get(modelingViewSelector.communicationLineAntiSlipRegulationLabel).click({ force: true });
    }).then(() => {
      cy.get(modelingViewSelector.modelingViewSaveIcon).click();
    }).then(() => {
      cy.get(navBarSelector.navBarEditButton).click();
    }).then(() => {
      cy.get(navBarSelector.editListRunTheModelButton).first().click();
    }).then(() => {
      cy.url().should('contain', 'threats');
      cy.visit(Cypress.env("baseURL") + "/modeling");
    }).then(() => {
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).rightclick({ force: true });
    }).then(() => {
      cy.get(modelingViewSelector.propertyPanelModelingResultTab).click();
    }).then(() => {
      cy.get(modelingViewSelector.propertyPanelModelingResultTabTableRow).should('have.length', 10);
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