const navBarSelector = require('../selectors/navBarSelector.js');
var projectName;

describe('Loading a Project', () => {
  var projectId;  //to store the project Id which is used in next test case to draw a diagram and delete the project

  before(() => {
    cy.generateProjectName().then(($generatedName) => {
      projectName = $generatedName
    })
  });

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login();
  });

  it('Test Case 1: No Project is loaded After loading In (MAIN-TC-1455, MAIN-TC-249)', () => {
    cy.visit(Cypress.env('baseURL'));
    cy.wait(2000).then(() => {
      cy.get(navBarSelector.navBarViewButton).click();
    }).then(() => {
      cy.get(navBarSelector.viewListAssumptionButton).should('not.be.enabled'); // Checking Modeling button is not enabled (project not loaded)
      cy.wait(200);
      cy.get(navBarSelector.viewListThreatListButton).should('not.be.enabled'); // Checking Threat List is not enabled (project not loaded)
      cy.wait(200);
      cy.get(navBarSelector.viewListVulnerabilityButton).should('not.be.enabled'); // Checking Vulnerability is not enabled (project not loaded)
      cy.wait(200);
      cy.get(navBarSelector.viewListDashboardButton).last().click();
      cy.wait(500);
    }).then(() => {
      cy.get(navBarSelector.navBarProfileButton).click();
      cy.wait(500);
    }).then(() => {
      cy.get(navBarSelector.profileListMilestoneHeader).should('have.text', 'Milestone: ');
    })
  })

  it('Test Case 2 : Creating a New Project (MAIN-TC-846, MAIN-TC-2281)', () => {
    cy.createProject(projectName)
    // Get the project ID from local storage
    cy.window().then((win) => {
      const newDesignData = JSON.parse(win.localStorage.getItem('newDesign'));
      expect(newDesignData).to.not.be.null;
      expect(newDesignData.project).to.not.be.undefined;
      // Extract the project ID from the nested structure
      projectId = newDesignData.project.id;
      expect(projectId).to.not.be.undefined;
      cy.log("Project ID is: " + projectId);
      cy.getCookie('accessToken').should('exist');
    })
  });

  it('Test Case 3: Creating a New Model (MAIN-TC-1986, MAIN-TC-2467)', () => {
    cy.loadProject(projectId);
    // Visit another page if needed.
    cy.visit(Cypress.env("baseURL") + "/modeling");
    cy.url().should('contain', '/modeling');
    cy.wait(1000);
    //Drag and Drop if req.
    cy.get(navBarSelector.navBarProfileButton).click();
    // Testing if the cursor remains at default 
    cy.get(navBarSelector.profileListUsernameHeader) // Index 4 represents the 5th element (0-based index)
      .should('have.css', 'cursor', 'default');
    cy.get(navBarSelector.profileListRoleHeader) // Index 4 represents the 5th element (0-based index)
      .should('have.css', 'cursor', 'default');
    cy.get(navBarSelector.profileListMilestoneHeader) // Index 4 represents the 5th element (0-based index)
      .should('have.css', 'cursor', 'default'); // Ensure the cursor style is 'auto'
  })
});

describe('CLEANUP: Project Deletion', () => {
  it('Deleting The Project If Created', () => {
    cy.viewport(1920, 1080);
    cy.login().then(() => {
      cy.deleteProject(projectName);
    })
  })
})
