const navBarSelector = require('../../selectors/navBarSelector.js')
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
var projectName;

describe('Modeling Automation', () => {
  var projectId;

  before('Creating a new Project (MAIN-TC-73, MAIN-TC-1203)', () => {
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
      cy.get(navBarSelector.navBarLeftSeparator).should('exist');
      cy.wait(800);
      cy.get(navBarSelector.navBarEditButton).click();//Click Edit in navigation bar
      cy.get(navBarSelector.editListRestoreThreatButton).should('not.be.enabled');
    })
  })

  beforeEach('Logging In', () => {
    cy.viewport(1920, 1080);
    cy.login();
    cy.loadProject(projectId);
  })

  //This model will run more then 50 piece
  it('Creating a New Model (MAIN-TC-827, MAIN-TC-1915, MAIN-TC-1564, MAIN-TC-72, MAIN-TC-828, MAIN-TC-860)', () => {
    // Visit another page if needed.
    cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
      cy.url().should('include', '/modeling')
    }).then(() => {
      //Test Case to verify DFD-Process is visible
      cy.get(modelingViewSelector.componentLibraryDfdProcess).should('have.text', 'DFD-Process')
    })
    //Working on Drag and Drop  
    const dataTransfer = new DataTransfer();
    // Test case to check if the module is empty
    cy.get(modelingViewSelector.componentLibraryModule)
      .trigger('dragstart', { dataTransfer, force: true }).then(() => {
        cy.get(modelingViewSelector.modelingViewCanvas)
          .trigger('drop', { dataTransfer, force: true, clientX: 250, clientY: 250 });
      })
      .then(() => {
        cy.get(modelingViewSelector.drawingCanvasModuleText).should('exist');
      }).then(() => {
        cy.get(modelingViewSelector.drawingCanvasModule)
          .rightclick()
          .then(() => {
            cy.get(modelingViewSelector.componentSpecFeatureSettingsModuleTextarea)
              .should('have.value', '');
          });
      });
    const numMicrocontrollers = 52;
    const controllersPerRow = 10;
    const distanceBetweenWireAndController = 100;
    const startX = 250; // Starting x-coordinate
    const startY = 120; // Starting y-coordinate
    const rowGap = 400; // Gap between rows
    for (let i = 0; i < numMicrocontrollers; i++) {
      const row = Math.floor(i / controllersPerRow);
      const col = i % controllersPerRow;
      const x = startX + col * distanceBetweenWireAndController;
      const y = startY + row * rowGap;
      cy.get(modelingViewSelector.componentLibraryMicrocontroller)
        .trigger('dragstart', { dataTransfer, force: true })
        .then(() => {
          cy.get(modelingViewSelector.modelingViewCanvas)
            .trigger('drop', { dataTransfer, force: true, clientX: x, clientY: y });
        });
      // If there are more controllers than wires, add a wire
      if (i < 42) {
        const wireX = x + distanceBetweenWireAndController / 2;
        const wireY = y + (distanceBetweenWireAndController / 2) + 30;
        cy.get(modelingViewSelector.componentLibraryCommunicationLine)
          .trigger('dragstart', { dataTransfer, force: true })
          .then(() => {
            cy.get(modelingViewSelector.modelingViewCanvas)
              .trigger('drop', { dataTransfer, force: true, clientX: wireX, clientY: wireY })
          })
      }
    }
    cy.then(() => {
      cy.get(modelingViewSelector.modelingViewSaveIcon).click({ force: true })
        .then(() => {
          cy.get(modelingViewSelector.modelingViewSnackBar).should('contain', 'successfully saved');
        });
    })
  });

  it('Modeling Test Cases (MAIN-TC-1115, MAIN-TC-793)', () => {
    // Visit another page if needed.
    cy.visit(Cypress.env("baseURL") + "/modeling");
    cy.url().should('contain', '/modeling').then(() => {
      cy.wait(500);
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).eq(0).rightclick({ force: true })
      cy.wait(1000);
      cy.get(modelingViewSelector.communicationLineSpecNameInput).clear().type("Communication Line 1")
      cy.get(modelingViewSelector.communicationLineSpecTransmissionSelect).click()
      cy.get(modelingViewSelector.transmissionMediaShortRangeWirelessOption).click();
      cy.wait(1000);
      cy.get(modelingViewSelector.communicationLineSpecBaseProtocolSelect).click()
      cy.get(modelingViewSelector.baseProtocolBluetoothLeOption).click();
      cy.wait(1000);
      cy.get(modelingViewSelector.communicationLineSpecTransmissionSelect).click()
      cy.get(modelingViewSelector.transmissionMediaPhysicalWireOption).click()
    });
    cy.wait(500);
    cy.get(modelingViewSelector.communicationLineSpecBaseProtocolSelect).should('have.value', '').then(() => {
      cy.get(modelingViewSelector.drawingCanvasCommunicationLine).eq(0).rightclick({ force: true })
    });
    cy.wait(500);
    cy.get(modelingViewSelector.drawingCanvasCommunicationLine).eq(0).rightclick({ force: true }).then(() => {
      cy.get(modelingViewSelector.componentSpecRemoveLineButton).click();
      cy.wait(500);
      cy.get(navBarSelector.confirmDialogueParagraph).invoke('text').should('contain', 'Communication Line 1')
    })
      .then(() => { cy.get(navBarSelector.confirmDialogueCancelButton).click() });
  })

  it('Modeling-View Cases: Save Button on the Canvas, Modeling view button opens modeling view page and working of floating bar components(MAIN-TC-2047, MAIN-TC-148, MAIN-TC-1064, MAIN-TC-1065)', () => {
    // Visit another page if needed.
    cy.visit(Cypress.env("baseURL") + "/modeling")
      .then(() => {
        cy.get(modelingViewSelector.drawingCanvasMicrocontroller).eq(51).rightclick()
          .then(() => {
            cy.get(modelingViewSelector.modelingViewSaveIcon).should('exist')
          })
      }).then(() => {
        cy.get(modelingViewSelector.drawingCanvasMicrocontroller).eq(51).rightclick();
      }).then(() => {
        cy.visit(Cypress.env("baseURL"));
      }).then(() => {
        cy.get(navBarSelector.navBarViewButton).click().then(()=>{
          cy.get(navBarSelector.viewListModelingButton).click();
        })
      }).then(() => {
        cy.url().should('contain', '/modeling');
      }).then(() => {
        cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
          cy.get(modelingViewSelector.componentLibraryMicrocontroller).trigger('mouseenter').then(() => {
            cy.get(modelingViewSelector.componentLibraryFloatingBar).should('be.visible');
          }).then(() => {
            const dataTransfer = new DataTransfer();
            cy.get(modelingViewSelector.componentLibraryMemoryChip).trigger('dragstart', { dataTransfer, force: true }).then(() => {
              cy.get(modelingViewSelector.modelingViewCanvas).trigger('drop', { dataTransfer, force: true, clientX: 1750, clientY: 500 });
            }).then(() => {
              cy.get(modelingViewSelector.drawingCanvasModuleText).should('include.text', 'Memory Chip');
            })
          })
        })
      })
  })

  it('Verifying the Drop-down Menus of Navigation bar Project, Edit, View, Export, Setting(MAIN-TC-142, MAIN-TC-143,MAIN-TC-144, MAIN-TC-145, MAIN-TC-146 )', () => {
    // Visit another page if needed.
    cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
      cy.get(navBarSelector.navBarEditButton).click();
      cy.get(navBarSelector.editListNewDesignButton).should('include.text', 'New Design'); //Verifying the Edit Drop down
      cy.get(navBarSelector.navBarEditButton).click({ force: true });
    }).then(() => {
      cy.visit(Cypress.env("baseURL") + "/modeling");
      cy.get(navBarSelector.navBarExportButton).click();
      cy.get(navBarSelector.exportListGenerateReportButton).should('include.text', 'Generate Report'); //Verifying the Export Drop down
      cy.get(navBarSelector.navBarExportButton).click({ force: true });
    }).then(() => {
      cy.visit(Cypress.env("baseURL") + "/modeling");
      cy.get(navBarSelector.navBarProjectButton).click();
      cy.get(navBarSelector.projectListNewProjectButton).should('include.text', 'New Project'); //Verifying the Project Drop down
      cy.get(navBarSelector.navBarProjectButton).first().click({ force: true });
    }).then(() => {
      cy.visit(Cypress.env("baseURL") + "/modeling");
      cy.get(navBarSelector.navBarSettingsButton).click();
      cy.get(navBarSelector.settingsListAdminButton).should('include.text', 'Admin'); //Verifying the Settings Drop down
      cy.get(navBarSelector.navBarSettingsButton).click({ force: true });
    }).then(() => {
      cy.visit(Cypress.env("baseURL") + "/modeling");
      cy.get(navBarSelector.navBarViewButton).click();
      cy.get(navBarSelector.viewListAssumptionButton).should('include.text', 'Assumption'); //Verifying the View Drop down
      cy.get(navBarSelector.navBarViewButton).click({ force: true });
    });
  })

  it('Verifying the Navigation Bar Buttons and Shortcuts (MAIN-TC-154, MAIN-TC-1326, MAIN-TC-153, MAIN-TC-149, MAIN-TC-150)', () => {
    // Visit another page if needed.
    cy.visit(Cypress.env("baseURL") + "/modeling").then(() => {
      cy.get(navBarSelector.navBarProfileButton).click({ force: true })
        .get(navBarSelector.profileListUserProfileHeader).should('include.text', 'User Profile'); //Verifying the User Profile Drop down
    })
    cy.visit(Cypress.env("baseURL")).then(() => {
      cy.get(navBarSelector.navBarProfileButton).click()
        .get(navBarSelector.profileListChangePasswordHeader).click() //Change Password 
        .get(navBarSelector.changePasswordForm).should('exist');
    })
    cy.visit(Cypress.env("baseURL")).then(() => {
      cy.get(navBarSelector.navBarNotificationButton).click()
        .get(navBarSelector.notificationMenu).should('exist'); //Notification Test 
    })
    cy.visit(Cypress.env("baseURL")).then(() => {
      cy.get(navBarSelector.navBarThreatListViewButton).click({ force: true })
        .wait(2000)
        .url().should('include', '/threats'); //Threat List
    })
    cy.visit(Cypress.env("baseURL")).then(() => {
      cy.get(navBarSelector.navBarVulnerabilityListViewButton).click({ force: true })
        .wait(2000)
        .url().should('include', '/vulnerabilities'); //Vulnerability List
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