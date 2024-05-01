const vulnerabilityListViewSelector = require('../../selectors/vulnerabilityListViewSelector.js')
const weaknessSelector = require('../../selectors/weaknessSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('Weakness Management', () => {
  var projectId;
  var weakness;
  var exploitableRationale;
  var weaknessDescription;
  var preControlRiskValue;
  var riskRationale;

  before(() => {
    cy.viewport(1920, 1080);            //Creating Project
    cy.login();
    // Generate a random project name
    cy.generateProjectName().then(($generatedName) => {
      projectName = $generatedName;
      weaknessDescription = 'Weakness is being Automated: '+ projectName.substring(20);
      exploitableRationale = 'Exploitable Rationale Test Description';
      preControlRiskValue = '1';
      riskRationale = '2';
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
    //setup Weakness objects
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

  it('Verify that Component, Attack Surface, and Asset(s) fields are optional on the Weakness page (MAIN-TC-2160, MAIN-TC-889, MAIN-TC-884)', () => { // Weakness should be added and "Confirm button is Enabled" without the mentioned fields
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.get(weaknessSelector.addNewWeaknessButton).click();
      cy.wait(2000);
    }).then(() => {
      cy.get(weaknessSelector.weaknessResponsibleFieldButton).click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).contains(weakness.responsibleUser).click()
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessIdentificationMethodFieldBox).clear().type(weakness.identificationMethod),
        ($inputField) => $inputField.val() === weakness.identificationMethod,
        { delay: 1000 })
        .should('have.value', weakness.identificationMethod)
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessSourceNotesFieldBox).clear().type(weakness.sourceNotes),
        ($inputField) => $inputField.val() === weakness.sourceNotes,
        { delay: 1000 })
        .should('have.value', weakness.sourceNotes)
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessSourceNotesLinkFieldBox).clear().type(weakness.sourceNotesLink),
        ($inputField) => $inputField.val() === weakness.sourceNotesLink,
        { delay: 1000 })
        .should('have.value', weakness.sourceNotesLink)
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessDescriptionFieldBox).clear().type(weaknessDescription),
        ($inputField) => $inputField.val() === weaknessDescription,
        { delay: 1000 })
        .should('have.value', weaknessDescription)
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessCweIdFieldBox).clear().type(weakness.cweID),
        ($inputField) => $inputField.val() === weakness.cweID,
        { delay: 1000 })
        .should('have.value', weakness.cweID)
    }).then(() => {
      weakness.cweWeaknessType = 'Hardware Design';
      weakness.cweWeaknessCategory = 'Core and Compute Issues';
      cy.get(weaknessSelector.weaknessCweWeaknessTypeFieldButton).click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).contains(weakness.cweWeaknessType).should('be.visible').click();
    }).then(() => {
      cy.get(weaknessSelector.weaknessCweWeaknessCategoryFieldButton).click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).contains(weakness.cweWeaknessCategory).should('be.visible').click();
    }).then(() => {
      cy.get(weaknessSelector.globalConfirmButton).should('be.enabled').click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Weakness added successfully.');
    })
  })

  it('Verify the weakness button opens up the weakness page (MAIN-TC-882, MAIN-TC-887)', () => {
    let weaknessNoHeader = 'Weakness Number';
    let dateIdentifiedHeader = 'Date Identified';
    let identificationMethodHeader = 'Identification Method';
    let sourceNoteHeader = 'Source Notes';
    let componentHeader = 'Component';
    let attackSurfaceHeader = 'Attack Surface';
    let assetHeader = 'Asset';
    let weaknessDescriptionHeader = 'Weakness Description';
    let cweIdHeader = 'CWE ID';
    let cweWeaknessTypeHeader = 'CWE Weakness Type';
    let cweCategoryHeader = 'CWE Weakness Category';
    let vulnerabilityAnalysisHeader = 'Vulnerability Analysis';
    let vulnerabilityLinkedHeader = 'Linked Vulnerabilities';
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => {
      cy.get(weaknessSelector.weaknessContentTextArea).each(($weaknessContentTextArea) => {
        cy.wrap($weaknessContentTextArea).should('be.visible'); // Assert that each feature content textarea are visible
      }).then(() => {
        cy.get(weaknessSelector.headerRow).contains(weaknessNoHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(dateIdentifiedHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(identificationMethodHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(sourceNoteHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(componentHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(attackSurfaceHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(assetHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(weaknessDescriptionHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(cweIdHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(cweWeaknessTypeHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(cweCategoryHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(vulnerabilityAnalysisHeader).should('be.visible');
        cy.get(weaknessSelector.headerRow).contains(vulnerabilityLinkedHeader).should('be.visible');
      })
    })
  })

  it('Verify the user is able to highlight the existing weaknesses (MAIN-TC-885)', () => {
    cy.highlightWeakness();
  })

  it('Verify the CWE weakness type for "Software Development" shall have correct "cwe category" values (MAIN-TC-888)', () => {
    cy.createComponent().then(() => {
      cy.addNewWeakness(weakness, weaknessDescription);
    })
  })

  it('Verify the working of the Weakness page Archived list search field (MAIN-TC-1640و MAIN-TC-1126, MAIN-TC-1549, MAIN-TC-2579)', () => {
    cy.searchForWeaknessInActiveListPage(weaknessDescription).then(() => {
      cy.addNewWeakness(weakness, weaknessDescription);
    }).then(() => {
      cy.wait(1000);
      cy.get(weaknessSelector.vulnerabilityAnalysisButton).first().click({ force: true });  // Open Analyze Weakness Dialog
    }).then(() => {
      cy.get(weaknessSelector.analyzeWeaknessExploitableButton).click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).eq(1).click();
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.analyzeWeaknessExploitableRationaleFieldBox).clear().type(exploitableRationale),
        ($inputField) => $inputField.val() === exploitableRationale,
        { delay: 1000 })
        .should('have.value', exploitableRationale)
    }).then(() => {
      cy.get(weaknessSelector.globalCheckBox).check({ force: true });
      cy.get(weaknessSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Weakness analysis updated successfully');
      cy.wait(2000);
    }).then(() => {
      cy.get(weaknessSelector.weaknessDropDownActionButton).first().click({ force: true});
    }).then(() => {
      cy.get(weaknessSelector.archiveWeaknessButton).click();
    }).then(() => {
      cy.get(weaknessSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Weakness Archived Successfully');
      cy.wait(1000);
    }).then(() => {
      cy.searchForWeaknessInArchivedListPage(weaknessDescription);
    })
  })

  it('Verify the working of the "Refresh" button on the weakness page (MAIN-TC-1336)', () => {
    cy.refreshWeaknessActiveListPage().then(() => {
      cy.refreshWeaknessArchivedListPage();
    })
  })

  it('Verify the weakness page has "Delete weakness" button present on weakness page for Active / Archived List (MAIN-TC-883)', () => {
    cy.addNewWeakness(weakness, weaknessDescription).then(() => {
      cy.deleteWeaknessActiveList();
    }).then(() => {
      cy.wait(1000);
      cy.addNewWeakness(weakness, weaknessDescription);
    }).then(() => {
      cy.wait(1000);
      cy.get(weaknessSelector.vulnerabilityAnalysisButton).first().click({ force: true });  // Open Analyze Weakness Dialog
    }).then(() => {
      cy.get(weaknessSelector.analyzeWeaknessExploitableButton).click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).eq(1).click();
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.analyzeWeaknessExploitableRationaleFieldBox).clear().type(exploitableRationale),
        ($inputField) => $inputField.val() === exploitableRationale,
        { delay: 1000 })
        .should('have.value', exploitableRationale)
    }).then(() => {
      cy.get(weaknessSelector.globalCheckBox).check({ force: true });
      cy.get(weaknessSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Weakness analysis updated successfully');
      cy.wait(2000);
    }).then(() => {
      cy.get(weaknessSelector.weaknessDropDownActionButton).first().click({ force: true});
    }).then(() => {
      cy.get(weaknessSelector.archiveWeaknessButton).click();
    }).then(() => {
      cy.get(weaknessSelector.globalConfirmButton).click();
    }).then(() => {
      cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Weakness Archived Successfully');
      cy.wait(1000);
    }).then(() => {
      cy.deleteWeaknessArchivedList();
    })
  })

  it('Verify the working of 3 dots button in weakness page for Archived list (MAIN-TC-929)', () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.get(weaknessSelector.weaknessArchivedListPageTab).click();  // Redirects to Weakness Archived List Page
      cy.wait(2000);
    }).then(() => {
      cy.get(weaknessSelector.weaknessDropDownActionButton).first().click({ force: true });
    }).then(() => {
      cy.get(weaknessSelector.deleteWeaknessButton).should('exist');
      cy.get(weaknessSelector.eventLinkingButton).should('exist');
      cy.get(weaknessSelector.attachmentButton).should('exist');
      cy.get(weaknessSelector.highlightWeaknessButton).should('exist');
    })
  })

  it('Verify the "Attachments" option under the three dots button of Weakness (MAIN-TC-3205)', () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => {  // Go to Weakness Page
      cy.wait(2000);
      cy.get(weaknessSelector.weaknessDropDownActionButton).first().click({ force: true });
    }).then(() => {
      cy.get(weaknessSelector.attachmentButton).should('exist').click();
      cy.get(weaknessSelector.weaknessAttachmentTextDialog).should('be.visible');
    })
  })

  it('Verify the "Responsible" field in the Add/Edit Weakness dialog of the Weakness page (MAIN-TC-2410)', () => {
    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
      cy.get(weaknessSelector.addNewWeaknessButton).click();
      cy.wait(2000);
    }).then(() => {
      cy.get(weaknessSelector.weaknessResponsibleFieldButton).should('be.visible').click();
      cy.get(weaknessSelector.weaknessDropDownOptionList).contains(weakness.responsibleUser).click();
    }).then(() => {
      recurse(() =>
        cy.get(weaknessSelector.weaknessDescriptionFieldBox).clear().type(weaknessDescription),
        ($inputField) => $inputField.val() === weaknessDescription,
        { delay: 1000 })
        .should('have.value', weaknessDescription);
    }).then(() => {
      cy.get(weaknessSelector.globalConfirmButton).click();
      cy.get(weaknessSelector.snackBarMessage).should('include.text','Weakness added successfully.');
    }).then(() => {
      cy.visit(Cypress.env('baseURL') + '/weaknesses');
      cy.wait(1000);
    }).then(() => {
      cy.get(weaknessSelector.weaknessContentTextArea).first().click();
      cy.get(weaknessSelector.weaknessResponsibleFieldButton).should('be.visible');
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