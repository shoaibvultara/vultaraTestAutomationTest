const vulnerabilityListViewSelector = require('../../selectors/vulnerabilityListViewSelector.js')
const weaknessSelector = require('../../selectors/weaknessSelector.js');
const eventSelector = require('../../selectors/eventSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;
var newProjectName;

describe('My Tasks Display', () => {
    var projectId;
    var weakness;
    var vulnerability;
    var event;
    var milestoneKey;

    before(() => {
        cy.viewport(1920, 1080);            //Creating Project
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
            cy.createComponent();
        })
        //setup the vulnerability object
        vulnerability = {
            description: 'Vulnerability is being Automated',
            responsibleUser: 'vultara_automation_test',
            attackVector: '(AV:N)',
            attackComplexity: '(AC:H)',
            privilegesRequired: '(PR:L)',
            userInteraction: '(UI:R)',
            scope: '(S:U)',
            confidentialityImpact: '(C:N)',
            integerityImpact: '(I:L)',
            availabilityImpact: '(A:H)',
            descriptionAttribute: 'ng-reflect-model',
        };
        //setup Weakness objects
        weakness = {
            responsibleUser: 'vultara_automation_test',
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
        //setup Event objects
        event = {
            priority: 'High',
            responsibleUser: 'vultara_automation_test',
        };
    })

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify that a confirmation dialog appears before redirecting the user to the task present in other project (MAIN-TC-2546, MAIN-TC-2545)', () => {
        cy.generateProjectName().then(($generatedName) => {
            newProjectName = $generatedName;
            cy.createProject(newProjectName).then(() => {
                cy.createComponent().then(() => {
                    let weaknessDescription = 'TC_2546: New Weakness is being Automated in another project';
                    cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => {
                        cy.addNewWeakness(weakness, weaknessDescription);
                        cy.visit(Cypress.env('baseURL') + '/user-profile');
                    }).then(() => {
                        cy.get(navBarSelector.myTaskSideNavAnchor).click();
                        cy.wait(2000);
                        cy.get(navBarSelector.projectNameContentArea).contains(newProjectName).should('be.visible');
                        cy.get(navBarSelector.taskDescriptionContentArea).contains(weaknessDescription).should('be.visible').click();
                    }).then(() => {
                        cy.get(navBarSelector.redirectTextDialog).should('be.visible');
                        cy.get(navBarSelector.redirectDialogConfirmButton).click();
                    }).then(() => {
                        cy.wait(1000);
                        cy.get(weaknessSelector.weaknessDescriptionContentArea).its('length').then((length) => {
                            let weaknessRowCount = length;
                            cy.get(weaknessSelector.weaknessDescriptionContentArea).should('have.length', weaknessRowCount);
                            cy.get(weaknessSelector.weaknessPagination).should('contain', '1 of 1');
                        })
                    }).then(() => {
                        cy.get(navBarSelector.navBarProfileButton).click();
                        cy.get(navBarSelector.profileListProjectNameHeader).first().should('contain', newProjectName);
                    })
                })
            })
        })
    })

    it('Verify that milestone created stored the correct information on "my task" page with correct pagination  (MAIN-TC-2988, MAIN-TC-3156)', () => {
        let weaknessDescription = 'TC_2988: Weakness is being Automated';
        let eventDetail = 'TC_2988: Event is being Automated';
        vulnerability.description = 'TC_2988: Vulnerability is being Automated';
        cy.createComponent().then(() => {
            cy.addNewWeakness(weakness, weaknessDescription);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
                cy.wait(1000);
                cy.get(eventSelector.addNewEventButton).click();
            }).then(() => {
                cy.get(eventSelector.addNewEventDialogText).should('be.visible');
                cy.get(eventSelector.priorityFieldButton).click();
                cy.get(eventSelector.eventDropDownListOption).contains(event.priority).click();
            }).then(() => {
                cy.get(eventSelector.eventStatusFieldButton).click();
                cy.get(eventSelector.eventDropDownListOption).contains('Not Started').click();
            }).then(() => {
                cy.get(eventSelector.eventResponsibleFieldButton).click({ force: true });
                cy.get(eventSelector.eventDropDownListOption).contains(event.responsibleUser).click();
            }).then(() => {
                recurse(() =>
                    cy.get(eventSelector.eventDetailFieldBox).clear().type(eventDetail),
                    ($inputField) => $inputField.val() === eventDetail,
                    { delay: 1000 })
                    .should('have.value', eventDetail);
            }).then(() => {
                cy.get(eventSelector.globalConfirmButton).click();
            }).then(() => {
                cy.get(eventSelector.snackBarMessage).should('include.text','Event added successfully');
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/vulnerabilities').then(() => {
                    cy.get(vulnerabilityListViewSelector.vulnerabilityListViewAddNewButton).should('exist');
                    cy.get(vulnerabilityListViewSelector.vulnerabilityListViewAddNewButton).click();
                }).then(() => {
                    cy.get(vulnerabilityListViewSelector.vulnerabilityListViewResponsibleField).click();
                    cy.get(vulnerabilityListViewSelector.vulnerabilityDropDownOption).contains(vulnerability.responsibleUser).click();
                }).then(() => {
                    cy.get(vulnerabilityListViewSelector.addNewVulnerabilityBaseScoreMetricsPanel).click();
                    if (vulnerability.description) {
                        recurse(
                            () => cy.get(vulnerabilityListViewSelector.addNewVulnerabilityDescriptionTextArea).type(vulnerability.description),
                            ($inputField) => $inputField.val() === vulnerability.description,
                            { delay: 1000 }
                        )
                    }
                    switch (vulnerability.cvssVersion) {
                        case '2.0':
                            cy.get(vulnerabilityListViewSelector.addNewVulnerabilityCvssVersion2Button).click();
                            cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.accessVector).click();
                            cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.accessComplexity).click();
                            cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.authentication).click();
                            break;
                        default:
                            cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.attackVector).click();
                            cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.attackComplexity).click();
                            cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.privilegesRequired).click();
                            cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.userInteraction).click();
                            cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.scope).click();
                    }
                    cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.confidentialityImpact).click();
                    cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.integerityImpact).click();
                    cy.get(vulnerabilityListViewSelector.metricsScoreRadioInputLabel).contains(vulnerability.availabilityImpact).click();
                }).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                    cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Successfully added vulnerability');
                }).then(() => {
                    cy.visit(Cypress.env('baseURL') + '/user-profile').then(() => {
                        cy.get(navBarSelector.myTaskSideNavAnchor).should('exist').click();
                        cy.wait(2000);
                    }).then(() => {
                        cy.get(navBarSelector.taskDescriptionContentArea).each(($taskDescriptionContentArea) => {
                            cy.wrap($taskDescriptionContentArea).should('be.visible'); 
                        })
                    }).then(() => {
                        milestoneKey = 'MAIN-TC-2988';
                        cy.createMilestone(milestoneKey);
                    }).then(() => {
                        cy.wait(3000);
                        cy.loadMilestone(milestoneKey);
                    }).then(() => {
                        cy.visit(Cypress.env('baseURL') + '/user-profile');
                        cy.get(navBarSelector.myTaskSideNavAnchor).should('exist').click();
                        cy.wait(2000);
                    }).then(() => {
                        cy.get(navBarSelector.taskDescriptionContentArea).each(($taskDescriptionContentArea) => {
                            cy.wrap($taskDescriptionContentArea).should('be.visible'); 
                        })       
                    }).then(() => {
                        cy.visit(Cypress.env('baseURL') + '/user-profile');
                    }).then(() => {
                        cy.get(navBarSelector.myTaskSideNavAnchor).click();
                        cy.wait(2000);
                        cy.get(navBarSelector.taskDescriptionContentArea).contains(weaknessDescription).should('be.visible').click();
                        cy.get(navBarSelector.redirectDialogConfirmButton).click();
                    }).then(() => {
                        cy.get(weaknessSelector.weaknessDescriptionContentArea).its('length').then((length) => {
                            let weaknessRowCount = length;
                            cy.get(weaknessSelector.weaknessDescriptionContentArea).should('have.length', weaknessRowCount);
                            cy.get(weaknessSelector.weaknessPagination).should('contain', '1 of 1');
                        })
                    }).then(() => {
                        cy.get(navBarSelector.navBarProfileButton).click();
                        cy.get(navBarSelector.profileListMilestoneHeader).should('contain', milestoneKey);
                    }).then(() => {
                        cy.visit(Cypress.env('baseURL') + '/user-profile');
                    }).then(() => {
                        cy.get(navBarSelector.myTaskSideNavAnchor).click();
                        cy.wait(2000);
                        cy.get(navBarSelector.taskDescriptionContentArea).contains(eventDetail).should('be.visible').click();
                    }).then(() => {
                        cy.wait(1000);
                        cy.get(eventSelector.eventDetailsContentArea).its('length').then((length) => {
                            let eventRowCount = length;
                            cy.get(eventSelector.eventDetailsContentArea).should('have.length', eventRowCount);
                            cy.get(eventSelector.eventPagination).should('contain', '1 of 1');
                        })
                    }).then(() => {
                        cy.get(navBarSelector.navBarProfileButton).click();
                        cy.get(navBarSelector.profileListMilestoneHeader).should('contain', milestoneKey);
                    }).then(() => {
                        cy.visit(Cypress.env('baseURL') + '/user-profile');
                    }).then(() => {
                        cy.get(navBarSelector.myTaskSideNavAnchor).click();
                        cy.wait(2000);
                        cy.get(navBarSelector.taskDescriptionContentArea).contains(vulnerability.description).should('be.visible').click();
                    }).then(() => {
                        cy.wait(1000);
                        cy.get(vulnerabilityListViewSelector.vulnerabilityListViewDescriptionTextArea).its('length').then((length) => {
                            let vulnerabilityRowCount = length;
                            cy.get(vulnerabilityListViewSelector.vulnerabilityListViewDescriptionTextArea).should('have.length', vulnerabilityRowCount);
                            cy.get(vulnerabilityListViewSelector.vulnerabilityPagination).should('contain', '1 of 1');
                        })
                    }).then(() => {
                        cy.get(navBarSelector.navBarProfileButton).click();
                        cy.get(navBarSelector.profileListMilestoneHeader).should('contain', milestoneKey);
                    })
                })
            })
        })
    })

    it('Verify that all assigned tasks in My Task tab are present (MAIN-TC-3149, MAIN-TC-2533, MAIN-TC-2534)', () => {
        let responsibleUser = 'vultara_automation_test';
        cy.visit(Cypress.env('baseURL')).then(() => {
            cy.get(navBarSelector.navBarProfileButton).click();
            cy.get(navBarSelector.profileListUserProfileHeader).click();
        }).then(() => {
            cy.get(navBarSelector.myTaskSideNavAnchor).should('exist').click();
            cy.wait(1000);
            cy.get(navBarSelector.myTaskPageText).should('be.visible');
        }).then(() => {
            cy.get(navBarSelector.taskDescriptionContentArea).each(($taskDescriptionContentArea) => {
                cy.wrap($taskDescriptionContentArea).should('be.visible'); 
            })
        }).then(() => {
            cy.get(navBarSelector.taskReporterContentArea).each(($taskReporterContentArea) => {
                cy.wrap($taskReporterContentArea).contains(responsibleUser).should('be.visible');
            })
        })
    })
})

describe('CLEANUP: Project Deletion', () => {
    it('Deleting The Project If Created', () => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.deleteProject(projectName);
        }).then(() => {
            cy.deleteProject(newProjectName);
        })
    })
})