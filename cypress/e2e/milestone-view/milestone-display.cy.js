import { recurse } from 'cypress-recurse'
const navBarSelector = require('../../selectors/navBarSelector.js');
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
var projectName;

describe('Milestone Display Features', () => {
    var projectId;
    var milestoneName;
    before(() => {//Creating Project
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
            expect(newDesignData.project).to.not.be.undefined;
            // Extract the project ID from the nested structure
            projectId = newDesignData.project.id;//projectId to be used 
            expect(projectId).to.not.be.undefined;
            cy.log("Project ID is: " + projectId);
        })
        //setup the milestone data
        milestoneName = 'Automation_Milestone';
        cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
        cy.createMilestone(milestoneName).then(() => {
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone Automation_Milestone is created successfully.');
        });
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify "Load milestone" button should be enabled (MAIN-TC-84)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'MAIN-TC-84';
            cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
            cy.createMilestone(milestoneName).then(() => {
                cy.get('@postRequest').its('response.statusCode').should('eq', 200);
                cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone MAIN-TC-84 is created successfully.');
            });
            cy.get(navBarSelector.navBarProjectButton).click().then(() => {// Click project in navigation bar
                cy.get(navBarSelector.projectListLoadMilestoneButton).should('be.enabled'); // load a milestone button
            })
        })
    })

    it('Verify that during Milestone view the "Run the model" button should be disabled in the Modeling view (MAIN-TC-87)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone';
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(navBarSelector.navBarRunTheModelButton).should('be.disabled'); // Click run the model in navigation bar
            })
        })
    })

    it('Verify "Save" button should be disabled in the Modeling view during Milestone view (MAIN-TC-88)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone';
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(modelingViewSelector.modelingViewSaveIcon).should('have.css', 'pointer-events', 'none'); // save icon is not clickable
            })
        })
    })

    it('Verify that "New Design" button shall be disabled during Milestone view in Modeling View (MAIN-TC-94)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone';
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(navBarSelector.navBarEditButton).click();
                cy.get(navBarSelector.editListNewDesignButton).should('be.disabled');
            })
        })
    })

    it('Verify that the milestone text in show milestone dialogue written as "Milestone Created on" with time and date (MAIN-TC-1005)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone';
            cy.get(navBarSelector.navBarProjectButton).click();
            cy.get(navBarSelector.projectListLoadMilestoneButton).click().then(() => {
                cy.get(navBarSelector.loadMilestoneSelectionList).first().should('include.text', milestoneName + ' , milestone created on: ');
            })
        })
    })

    it('Verify the milestone name on the top left of the canvas and on milstone header in profile drop down when loaded(MAIN-TC-2051, MAIN-TC-1159, MAIN-TC-1165, MAIN-TC-1157, MAIN-TC-1166)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'MAIN-TC-2051, MAIN-TC-1159, MAIN-TC-1165, MAIN-TC-1157';
            cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
            cy.createMilestone(milestoneName).then(() => {
                cy.get('@postRequest').its('response.statusCode').should('eq', 200);
                cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone MAIN-TC-2051, MAIN-TC-1159, MAIN-TC-1165, MAIN-TC-1157 is created successfully.');
            });
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(modelingViewSelector.modelingViewMilestoneNameDiv).should('exist');
                cy.get(modelingViewSelector.modelingViewMilestoneNameDiv).invoke('text').then((text) => {
                    expect(text.length).to.be.at.most(34);//FIRST SUB OF MILESTONE NAME = 30 CHARS + SPACE CHAR + THREE DOTS
                });
                cy.get(navBarSelector.navBarProfileButton).click();
                cy.get(navBarSelector.profileListMilestoneHeader).should('include.text', 'Milestone: ' + milestoneName);
            })
        })
    })

    it('Verify that the user clicks on the confirm button after creating the milestone it shows the message "Milestone is being created. You will receive a message upon completion" MAIN-TC-2237', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone_TC-2237';
            cy.createMilestone(milestoneName).then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Milestone is being created. You will receive a message upon completion');
            });
        })
    })

    it('Verify that when the milestone is created successfully it should show the message "Milestone (milestone name) created successfully" MAIN-TC-2238', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone_TC-2238';
            cy.createMilestone(milestoneName).then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone Automation_Milestone_TC-2238 is created successfully.');
            });
        })
    })

    it('Verify that there should be a "Milestone" icon in navigation bar when user is in Milestone mode (MAIN-TC-2568)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone';
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(navBarSelector.navBarMilestoneButton).should('exist');
            })
        })
    })

    it('Verify that Milestone icon is not present before loading the milestone view and after closing it (MAIN-TC-2569)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            cy.get(navBarSelector.navBarMilestoneButton).should('not.exist');
        })
    })

    it('Verify that if no milestone is loaded, the milestone field is showing "N/A" (MAIN-TC-1158)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            cy.get(navBarSelector.navBarProfileButton).click();
            cy.get(navBarSelector.profileListMilestoneHeader).should('have.text', 'Milestone: ' + 'N/A');
        })
    })

    it('Verify that when the user returns to a live project from a Milestone, the value of the field is returned to "N/A" (MAIN-TC-1160)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone';
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(navBarSelector.navBarMilestoneButton).click({ force: true }).then(() => {
                    cy.get(navBarSelector.navBarProfileButton).click();
                    cy.get(navBarSelector.profileListMilestoneHeader).should('have.text', 'Milestone: ' + 'N/A');
                })
            })
        })
    })

    it('Verify that the user loads Milestone and user log-out of the application and then again login to the application the value in the Milestone in User Profile Dropdown changes to "N/A" (MAIN-TC-1170)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone';
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(navBarSelector.navBarProfileButton).click();
                cy.get(navBarSelector.profileListLogoutButton).click();
            })
            cy.wait(1000);
            cy.login();
            cy.loadProject(projectId);
            cy.visit(Cypress.env('baseURL')).then(() => {
                cy.get(navBarSelector.navBarProfileButton).click();
                cy.get(navBarSelector.profileListMilestoneHeader).should('have.text', 'Milestone: ' + 'N/A');
            })
        })
    })

    it('Verify in modeling view, All buttons in edit menu should be disabled (MAIN-TC-95, MAIN-TC-89, MAIN-TC-388)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone';
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(navBarSelector.navBarEditButton).click();
            }).then(() => {
                cy.get(navBarSelector.editListNewDesignButton).should('be.disabled');
                cy.get(navBarSelector.editListRestoreThreatButton).should('be.disabled');
                cy.get(navBarSelector.editListMapThreatListToWP29Button).should('be.disabled');
                cy.get(navBarSelector.editListShowMappingButton).should('be.disabled');
                cy.get(navBarSelector.editListRunTheModelButton).first().should('be.disabled');
                cy.get(navBarSelector.editListStartOverRunTheModelButton).last().should('be.disabled');
            })
        })
    })

    it('Verify in navbar under project menu, "Switch to current project" button should be enabled (MAIN-TC-97)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            milestoneName = 'Automation_Milestone';
            cy.loadMilestone(milestoneName).then(() => {
                cy.get(navBarSelector.navBarProjectButton).click();
            }).then(() => {
                cy.get(navBarSelector.projectListSwitchToCurrentProjectButton).should('be.enabled').click();
            }).then(() => {
                cy.get(navBarSelector.navBarProfileButton).click();
                cy.get(navBarSelector.profileListMilestoneHeader).should('have.text', 'Milestone: ' + 'N/A');
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