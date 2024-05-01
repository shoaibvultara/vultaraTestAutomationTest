const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
const impactPopupSelector = require('../../selectors/impactPopupSelectors.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('Impact', () => {
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

  it('Threat No in Impact Popup (MAIN-TC-1626, MAIN-TC-1627, MAIN-TC-1664)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(3000);
      cy.get(navBarSelector.loader).should('not.exist');
      cy.get(threatListViewSelector.threatListViewImpactButton).first().click();
    }).then(() => {
      cy.get(impactPopupSelector.impactPopup).should('be.visible').then(() => {
        cy.get(impactPopupSelector.impactPopupTitle).invoke('text').should('include', 'Impact for Threat #1')
      })
    }).then(() => {
      cy.get(navBarSelector.dialogCloseIcon).click();
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewDamageScenarioScrollBar).first().should('exist');
    })
  })

  it('Risk level and Impact rating in Impact Popup (MAIN-TC-1643, MAIN-TC-1675)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      let riskValue;
      let Rating;
      cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().should('contain', 'no treatment');
      cy.get(threatListViewSelector.threatListViewRiskButton).first().invoke('text').then((text) => {
        riskValue = text.trim();
        cy.get(threatListViewSelector.threatListViewImpactButton).first().invoke('text').then((text) => {
          Rating = text.trim();
          cy.wait(3000);
          cy.get(threatListViewSelector.threatListViewImpactButton).first().click();
          cy.get(impactPopupSelector.impactPopupRatingAndLevelParagraph).invoke('text').should('include', Rating)
        })
        cy.get(impactPopupSelector.impactPopupRatingAndLevelParagraph).invoke('text').should('include', riskValue);
      }).then(() => {
        cy.get(impactPopupSelector.impactPopupDamageScenarioTextArea).should('include.value', 'Worst case damage scenario is from adjacent component Microcontroller0');
      })
    })
  })

  it('Color dot with Each Impact Category (MAIN-TC-1645)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(3000);
      cy.get(threatListViewSelector.threatListViewImpactButton).first().click().then(() => {
        for (let i = 0; i < 4; i++) {
          cy.get(impactPopupSelector.impactPopupCategoryDropDown).eq(i).click();
          cy.get(impactPopupSelector.impactPopupCategoryDropdownModerateOption).click();
        }
      }).then(() => {
        for (let i = 0; i < 4; i++) {
          cy.get(impactPopupSelector.impactPopupCategoryDropDownColor).eq(i).should('exist');
        }
      })
    })
  })

  it('Edit the Reviewed Threat(MAIN-TC-1681) ', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(3000);
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check();//Marking threat as reviewed
      cy.get(threatListViewSelector.threatListViewImpactButton).first().click();
    }).then(() => {
      cy.get(impactPopupSelector.impactPopupCategoryDropDown).first().should('not.be.enabled');
      cy.get(impactPopupSelector.impactPopupDamageScenarioDropDown).should('not.be.enabled');
      cy.get(impactPopupSelector.impactPopupCancelButton).click();
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check(); //Marking threat as ready
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().uncheck(); //Marking threat as unreviewed
    }).then(() => {
      cy.wait(2000);
      cy.get(impactPopupSelector.impactPopupConfirmButton).last().click({ force: true });
      cy.wait(1000);
    })
  })

  it('Verify that when the user changes the treatment and opens Impact, then "before & after treatment view" should appear (MAIN-TC-1682, MAIN-TC-1683, MAIN-TC-1686, MAIN-TC-1687, MAIN-TC-1689)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(3000);
      cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().click().then(() => {
        cy.get(threatListViewSelector.threatTreatmentReduceOption).click();
      }).then(() => {
        cy.get(threatListViewSelector.threatListViewImpactButton).first().click({ force: true }).then(() => {
          cy.get(impactPopupSelector.impactPopupCategoryHeading).should('include.text', '(After Treatment)');
          cy.get(impactPopupSelector.impactPopupDamageScenarioHeading).should('include.text', '(After Treatment)');
        })
      }).then(() => {
        cy.get(impactPopupSelector.impactPopupSwitchButton).click().then(() => {
          cy.get(impactPopupSelector.impactPopupCategoryHeading).should('include.text', '(Before Treatment)');
          cy.get(impactPopupSelector.impactPopupDamageScenarioHeading).should('include.text', '(Before Treatment)');
        })
      })
    })
  })

  it('Verify impact rating and risk level is updated according to the view(MAIN-TC-1684)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewThreatTreatmentSelect).first().click();
    })
    cy.get(threatListViewSelector.threatTreatmentRetainOption).click({ force: true }).then(() => {
      cy.get(threatListViewSelector.threatListViewImpactButton).first().click();
    }).then(() => {
      for (let i = 0; i < 4; i++) {
        cy.get(impactPopupSelector.impactPopupCategoryDropDown).eq(i).click();
        cy.get(impactPopupSelector.impactPopupCategoryDropdownNegligibleOption).click();
      }
    }).then(() => {
      cy.get(impactPopupSelector.impactAfterTreatmentText).invoke('text').should('include', 'Negligible');
    }).then(() => {
      for (let i = 0; i < 4; i++) {
        cy.get(impactPopupSelector.impactPopupCategoryDropDown).eq(i).click();
        cy.get(impactPopupSelector.impactPopupCategoryDropdownModerateOption).click();
      }
    }).then(() => {
      cy.get(impactPopupSelector.impactAfterTreatmentText).invoke('text').should('include', 'Moderate');
    })
  })

  it('Verify that when the user clicks on New pool damage scenario option then the description box become empty (MAIN-TC-1746, MAIN-TC-1747)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(3000);
      cy.get(threatListViewSelector.threatListViewImpactButton).first().click();
    }).then(() => {
      cy.get(impactPopupSelector.impactPopupDamageScenarioDropDown).click();
      cy.get(impactPopupSelector.impactPopupDamageScenarioDropDownOptionOne).click();
      cy.get(impactPopupSelector.impactPopupDamageScenarioTextArea).should('include.text', '');
      cy.get(impactPopupSelector.impactPopupConfirmButton).should('not.be.enabled');
    }).then(() => {
      cy.get(impactPopupSelector.impactPopupDamageScenarioDropDown).click();
      cy.get(impactPopupSelector.impactPopupDamageScenarioDropDownOptionTwo).click();
      cy.get(impactPopupSelector.impactPopupDamageScenarioTextArea).should('include.text', '');
      cy.get(impactPopupSelector.impactPopupConfirmButton).should('not.be.disabled');
    })
  })

  it('Verify that while the Auto Damage scenario is checked and the user changes the impact ratings, the damage scenario input fields are updated with the auto damage scenario text (MAIN-TC-1679, MAIN-TC-1759)', () => {
    let damageScenario = 'Before checking Auto Damage Scenario Check Box'
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(3000);
      cy.get(threatListViewSelector.threatListViewImpactButton).eq(1).click();
    }).then(() => {
      cy.get(impactPopupSelector.impactPopupDamageScenarioDropDown).click();
      cy.get(impactPopupSelector.impactPopupDamageScenarioDropDownOptionOne).click();
    }).then(() => {
      recurse(() =>
        cy.get(impactPopupSelector.impactPopupDamageScenarioTextArea).clear().type(damageScenario),
        ($inputField) => $inputField.val() === damageScenario,
        { delay: 1000 })
        .should('have.value', damageScenario)
    }).then(() => {
      cy.get(impactPopupSelector.impactPopupAutoDSCheckBox).check();
    }).then(() => {
      cy.wait(2000);
      for (let i = 0; i < 4; i++) {
        cy.get(impactPopupSelector.impactPopupCategoryDropDown).eq(i).click();
        cy.get(impactPopupSelector.impactPopupCategoryDropdownModerateOption).click();
      }
    }).then(() => {
      cy.get(impactPopupSelector.impactPopupDamageScenarioTextArea).then(($autoDamageScenario) => { 
        expect($autoDamageScenario).not.to.be.eq(damageScenario);
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