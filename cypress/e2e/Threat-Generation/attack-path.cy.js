const navBarSelector = require('../../selectors/navBarSelector.js');
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
const attackPathPopupSelector = require('../../selectors/attackPathPopupSelector.js');
var projectName;

describe('Attack Path', () => {
  var projectId;

  before(() => {
    cy.viewport(1920, 1080);            //Creating Project
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

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login();
    cy.loadProject(projectId);
  })

  it('Placing Component', () => {
    cy.visit(Cypress.env('baseURL') + '/modeling');
    cy.wait(3000);
    const dataTransfer = new DataTransfer();
    cy.get(modelingViewSelector.componentLibraryMicrocontroller).trigger('dragstart', { dataTransfer, force: true });
    cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 250, clientY: 250 });
    cy.wait(500);
    cy.get(modelingViewSelector.componentLibraryMicrocontroller).trigger('dragstart', { dataTransfer, force: true });
    cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 350, clientY: 250 });
    cy.get(modelingViewSelector.componentLibraryCommunicationLine).trigger('dragstart', { dataTransfer, force: true });
    cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 450, clientY: 250 });
    cy.wait(200);
    cy.get(modelingViewSelector.modelingViewSaveIcon).click();
    cy.wait(1000);

  })

  it('Generating Threats', () => {
    cy.visit(Cypress.env('baseURL') + '/threats') // Go to Threats Page
    cy.wait(2000);
    for (let i = 1; i < 6; i++) {
      cy.getCookie('accessToken').then((cookie) => {
        if (cookie) {
          const cookieValue = cookie.value;
          // Make the API request to generate threats
          cy.request({
            url: `${Cypress.env('apiURL')}/projects/threatsDb`,
            method: 'POST',
            body: {
              threat: {
                threatRowNumber: i,
                id: "threatid" + i,
                projectId: projectId,
                asset: "Asset Test " + i,
                threatScenario: "Threat Scenario " + i,
                attackPathName: "Attack Path Name " + i,
                damageScenario: "Damage Scenario " + i,
                impactF: i,
                impacctO: i,
                riskLevel: i,
                riskScore: i,
                treatment: "no treatment",
                securityPropertyCia: "c"
              }
            },
          })
        }
      });
    }

    cy.reload();
    cy.wait(500);
  })

  it('Component Drop down (MAIN-TC-1559, MAIN-TC-1560, MAIN-TC-1602, MAIN-TC-1692)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click();
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewAttackPathDialog).should('exist');
      cy.get(attackPathPopupSelector.attackPathDialogTitleHeader).invoke('text').should('include', 'Threat # 1')
      cy.get(attackPathPopupSelector.attackPathDialogAddStepButton).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogStepComponent).eq(0).click();
      cy.get(attackPathPopupSelector.attackPathDialogComponentSelectPanel).should('exist');
    }).then(() => {
      cy.get(threatListViewSelector.componentSelectPanelStepOneOption).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogDeleteButton).click();
      cy.get(navBarSelector.confirmDialogueParagraph).invoke('text').should('include', 'Step #1');
    }).then(() => {
      cy.get(navBarSelector.confirmDialogueCloseButton).click();
    }).then(() => {
      cy.get(navBarSelector.confirmDialogueConfirmButton).click();
      cy.wait(1000);
    })
  })

  it('Steps in Attack Path (MAIN-TC-1561, MAIN-TC-1565, MAIN-TC-1622)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click();
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewAttackPathDialog).should('exist');
      cy.get(attackPathPopupSelector.attackPathDialogStepOneTableData).invoke('text').should('contain', '1');
      cy.get(attackPathPopupSelector.attackPathDialogAddStepButton).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogStepComponent).eq(1).click();
    }).then(() => {
      cy.get(threatListViewSelector.componentSelectPanelStepTwoOption).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogStepTwoTableData).invoke('text').should('contain', '2');
    })
  })

  it('Description in Attack Path (MAIN-TC-1563)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogDescriptionEmptyTextArea).type("Testing the Description");
      cy.get(navBarSelector.confirmDialogueConfirmButton).click();
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewAttackPathColumn).should('have.value', 'Testing the Description');
    })
  })

  it('Reviewed Threat (MAIN-TC-1566, MAIN-TC-1696,MAIN-TC-1697)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(3000);
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check();// to mark it reviewed
    }).then(() => {
      cy.wait(500);
      cy.get(threatListViewSelector.threatListViewReviewedTableDataCheckBox).first().check();// to mark it reviewed
    }).then(() => {
      cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogStepComponent).first().click();
    }).then(() => {
      cy.get(threatListViewSelector.componentSelectPanelStepTwoOption).should('not.exist');//Component Drop down not be shown
      cy.get(attackPathPopupSelector.attackPathDialogDescriptionFilledTextArea).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogDescriptionPopUp).should('not.exist');
    })
  })

  it('New Fields in Attack Path & No of Threats (MAIN-TC-1603, MAIN-TC-1619)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(1000);
      cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogComponentTableHeader).should('exist');
      cy.get(attackPathPopupSelector.attackPathDialogStepTableHeader).should('exist');
      cy.get(attackPathPopupSelector.attackPathDialogDescriptionTableHeader).should('exist');
      cy.get(attackPathPopupSelector.attackPathDialogStepCount).invoke('text').should('include', "1");//as we have only 1 step
    })
  })

  it('Step is unaccessible (MAIN-TC-1624)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(1000);
      cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogStepOneTableData).should('not.be.enabled');
    })
  })

  it('Adding a New Step and Confirm Button (MAIN-TC-1694,MAIN-TC-1696, MAIN-TC-1803)', () => {
    cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
      cy.wait(1000);
      cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogAddStepButton).click();
    }).then(() => {
      cy.get(attackPathPopupSelector.attackPathDialogStepComponent).eq(1).should('have.value', '');
      cy.get(attackPathPopupSelector.attackPathDialogDescriptionFilledTextArea).should('have.value', '');
      cy.get(navBarSelector.confirmDialogueConfirmButton).should('not.be.enabled');
      cy.get(attackPathPopupSelector.attackPathDialogStepComponent).eq(1).click();
    }).then(() => {
      cy.get(threatListViewSelector.componentSelectPanelStepTwoOption).click();
    }).then(() => {
      cy.get(navBarSelector.confirmDialogueConfirmButton).should('not.be.disabled');
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