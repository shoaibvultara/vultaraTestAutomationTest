const controlLibrarySelector = require('../selectors/controlLibrarySelector.js');
const projectLibrarySelector = require('../selectors/projectLibrarySelector.js');

Cypress.Commands.add('createNewControl', () => {
    cy.visit(Cypress.env('baseURL')+'/library'); // Go to Library Page
    cy.wait(1000);
    cy.get(projectLibrarySelector.librarySideNavControlAnchor).click();  // Redirects to Control Page
    cy.get(controlLibrarySelector.createNewControlButton).should('exist').click();
    cy.get(controlLibrarySelector.newControlDialogFieldBox).click().type('Automation_Control');
    cy.get(controlLibrarySelector.newControlDialogConfirmButton).click({force: true});
    cy.wait(2000); // Added wait statement to ensure that Control is added successfully
  })

Cypress.Commands.add('controlRefreshButton', () => {
    cy.visit(Cypress.env('baseURL')+'/library'); // Go to Library Page
    cy.wait(1000);
    cy.get(projectLibrarySelector.librarySideNavControlAnchor).click();  // Redirects to Control Page
    cy.get(controlLibrarySelector.controlLibraryRefreshButton).should('exist').click();    
    cy.get(controlLibrarySelector.controlLibraryRefreshLoader).should('exist');
  })

Cypress.Commands.add('controlShowAllButton', () => {
    cy.visit(Cypress.env('baseURL')+'/library'); // Go to Library Page
    cy.wait(1000);
    cy.get(projectLibrarySelector.librarySideNavControlAnchor).click();  // Redirects to Control Page
    cy.get(controlLibrarySelector.controlLibraryShowAllButton).should('exist').click();
    cy.get(controlLibrarySelector.controlLibraryRefreshLoader).should('exist');
  })

Cypress.Commands.add('controlSearchBox', () => {    
    cy.visit(Cypress.env('baseURL')+'/library'); // Go to Library Page
    cy.wait(1000);
    cy.get(projectLibrarySelector.librarySideNavControlAnchor).click();  // Redirects to Control Page
    cy.get(controlLibrarySelector.controlLibrarySearchBox).should('exist').click().type('`Automation_Control');
  })

Cypress.Commands.add('deleteControl', () => {    
    cy.visit(Cypress.env('baseURL')+'/library'); // Go to Library Page
    cy.wait(1000);
    cy.get(projectLibrarySelector.librarySideNavControlAnchor).click();  // Redirects to Control Page
    cy.get(controlLibrarySelector.controlLibraryMoreOptionsButton).eq(0).click({force: true});
    cy.get(controlLibrarySelector.moreOptionsDeleteControlButton).click();
    cy.get(controlLibrarySelector.controlLibraryConfirmToDeleteButton).click();
    cy.wait(2000); // Added wait statement to ensure that Control is deleted successfully
  })
  
Cypress.Commands.add('linkRequirement', () => {    
    cy.visit(Cypress.env('baseURL')+'/library'); // Go to Library Page
    cy.wait(1000);
    cy.get(projectLibrarySelector.librarySideNavControlAnchor).click();  // Redirects to Control Page
    cy.get(controlLibrarySelector.controlLibraryMoreOptionsButton).eq(0).click({force: true});
    cy.get(controlLibrarySelector.moreOptionsLinkedRequirementsButton).click();
    cy.get(controlLibrarySelector.linkedRequirementSwitchButton).click();
    cy.get(controlLibrarySelector.linkedRequirementCheckboxInput).eq(0).check();
    cy.get(controlLibrarySelector.linkedRequirementConfirmButton).click();
    cy.get(controlLibrarySelector.linkedRequirementSnackBar).should('include.text','Changes saved successfully');
  })  