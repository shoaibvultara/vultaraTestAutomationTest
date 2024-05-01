const navBarSelector = require('../../selectors/navBarSelector.js')
const modelingViewSelector = require('../../selectors/modelingViewSelector.js')
const threatListViewSelector = require('../../selectors/threatListViewSelector.js')
const feasibilityPopUpSelector = require('../../selectors/feasibilityPopupselector.js')
var projectName;
describe('Feasibility', () => {
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
    cy.createModel().then(() => {
      cy.visit(Cypress.env('baseURL') + '/threats');
    }).then(() => {
      cy.get(navBarSelector.loader).should('not.exist');
    })
  })

  beforeEach(() => {// Logging In and Loading Project
    cy.viewport(1920, 1080);
    cy.login();
    cy.loadProject(projectId);
  })

  it('Feasibility Pop-up (MAIN-TC-1593, MAIN-TC-1594)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
    }).then(() => {
      cy.get(feasibilityPopUpSelector.feasibilityPopupTitle).invoke('text').should('include', 'Threat #1')
      cy.get(feasibilityPopUpSelector.feasibilityPopupConfirmButton).click({ force: true }); //clicking confirm button
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
    }).then(() => {
      cy.get(feasibilityPopUpSelector.feasibilityPopupTitle).invoke('text').should('include', 'Threat #1');
    })
  })

  it('feasibility pop-up window w.r.t to Review Threats(MAIN-TC-1608, MAIN-TC-1582, MAIN-TC-1222)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check();
    }).then(() => {//Mark the threat as ready
      cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().should('not.be.enabled');
      cy.wait(1000);
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
    }).then(() => {
      cy.get(feasibilityPopUpSelector.feasibilityPopupCriteria).first().should('not.be.enabled');
      cy.get(feasibilityPopUpSelector.feasibilityPopupRationaleText).first().should('not.be.enabled');
      cy.get(feasibilityPopUpSelector.feasibilityPopupCancelButton).click();
    }).then(() => {
      cy.get(feasibilityPopUpSelector.feasibilityPopup).should("not.exist");
      cy.wait(1000);
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check(); //Mark the threat as reviewed
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().uncheck(); //Mark the threat as not reviewed
      cy.wait(1000);
      cy.get(feasibilityPopUpSelector.feasibilityPopupConfirmButton).click({ force: true });
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
    }).then(() => {
      cy.wait(1000);
      cy.get(feasibilityPopUpSelector.feasibilityPopupCriteria).first().should('not.be.disabled');
      cy.get(feasibilityPopUpSelector.feasibilityPopupRationaleText).first().should('not.be.disabled');
    })
  })

  it('feasibility pop-up window w.r.t Treatment (MAIN-TC-1584, MAIN-TC-1220, MAIN-TC-1221)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().click();
    }).then(() => {
      cy.get(threatListViewSelector.threatTreatmentRetainOption).click();
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
    }).then(() => {
      cy.get(feasibilityPopUpSelector.feasibilityPopUpThreatListHeading).invoke('text').should('include', 'Before Treatmentarrow_right_altAfter Treatment');
    })
  })

  it('Treatment in Threats(MAIN-TC-1609)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().click();
    }).then(() => {
      cy.get(threatListViewSelector.threatTreatmentShareOption).click(); //changing treatment option
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
    }).then(() => {
      cy.get(feasibilityPopUpSelector.feasibilityPopUpThreatListHeading).invoke('text').should('include', 'Before Treatmentarrow_right_altAfter Treatment');
    })
  })

  it('Feasibility pop-up functionality (MAIN-TC-1581, MAIN-TC-1216)', () => {
    let riskValue;
    let feasibility;
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.intercept('PATCH', Cypress.env('apiURL') + '/projects/threatsDb*').as('patchRequest');
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check(); //Mark the threat as ready
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().should('have.prop', 'indeterminate');
      cy.get('@patchRequest').its('response.statusCode').should('eq', 200);
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check(); //Mark the threat as reviewed
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().should('have.prop', 'checked');
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().uncheck(); //Mark the threat as not reviewed
    }).then(() => {
      cy.wait(1000);
      cy.get(feasibilityPopUpSelector.feasibilityPopupConfirmButton).click({ force: true });
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewRiskButton).first().invoke('text');
    }).then((text) => {
      riskValue = text.trim();
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().invoke('text');
    }).then((text) => {
      feasibility = text.trim();
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
    }).then(() => {
      cy.wait(1000);
      cy.get(feasibilityPopUpSelector.feasibilityPopup).should('be.visible');
      cy.get(feasibilityPopUpSelector.feasibilityPopupTitle).invoke('text').should('include', 'Threat #1');
      cy.get(feasibilityPopUpSelector.feasibilityPopupFeasibilityRating).invoke('text').should('include', feasibility);
    }).then(() => {
      cy.get(feasibilityPopUpSelector.feasibilityPopupRiskLevelTitle).invoke('text').should('include', riskValue);
      cy.get(feasibilityPopUpSelector.feasibilityPopupConfirmButton).click({ force: true });
    })
  })

  it.skip('Threats w.r.t to treatment value for "After treatment"(MAIN-TC-1587)', () => { //skip for the time being until developer fix the issue
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      // Get the initial treatment
      cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().invoke('text').then((initialTreatment) => {
        cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().click().then(() => {
          cy.get(threatListViewSelector.threatTreatmentAvoidOption).click();
        })
        // Get the final treatment
        cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().invoke('text').then((finalTreatment) => {
          // Assertions: final treatment should not be equal to initial treatment
          expect(finalTreatment).not.to.equal(initialTreatment); //Test Case assertion
        });
      });
      //Mark the threat as reviewed
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check().then(() => {
        cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().should('not.be.enabled');//Test Case assertion
        cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
      })
      cy.get(feasibilityPopUpSelector.feasibilityPopupConfirmButton).should('not.be.enabled');//Test Case assertion
    })
  })

  it('Threats w.r.t to treatment value for "Before treatment" (MAIN-TC-1588)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first();
    }).then(($reviewCheckbox) => {
      //mark threat as ready only when checkbox is not already in indeterminate state (ready)
      if (!$reviewCheckbox.is(':indeterminate')) {
        cy.intercept('PATCH', Cypress.env('apiURL') + '/projects/threatsDb*').as('patchRequest');
        cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check().then(() => {
          cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().should('have.prop', 'indeterminate');
          cy.get('@patchRequest').its('response.statusCode').should('eq', 200);
        })
      }
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check(); //Mark the threat as reviewed
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().should('have.prop', 'checked');
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().uncheck(); //Mark the threat as not reviewed
    }).then(() => {
      cy.wait(1000);
      cy.get(feasibilityPopUpSelector.feasibilityPopupConfirmButton).click({ force: true });
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewValidatedTableDataCheckBox).first().click(); //clicking the validated checkbox
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
    }).then(() => {
      cy.wait(1000);
      cy.get(feasibilityPopUpSelector.feasibilityPopupRationaleText).last().should('not.be.enabled');
      cy.get(feasibilityPopUpSelector.feasibilityPopupCancelButton).click();
    }).then(() => {
      //Mark the threat as review
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check();
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().click();
    }).then(() => {
      cy.get(feasibilityPopUpSelector.feasibilityPopupConfirmButton).should('not.be.enabled');
    })
  })

  it('Verify that when the user changes the Feasibility Method from Attack Potential to Attack Vector, it updates the Feasibility and Risk values respectively (MAIN-TC-2601)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewThreatActionsButton).should('be.visible');
    }).then(() => {
      cy.changeFeasibilityMethod('vector');
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewFeasibilityButton).first().should('include.text', 'Medium');
      cy.get(threatListViewSelector.threatListViewImpactButton).first().should('include.text', 'Major');
      cy.get(threatListViewSelector.threatListViewRiskButton).first().should('include.text', '5');
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