const vulnerabilityListViewSelector = require('../../selectors/vulnerabilityListViewSelector.js')
const weaknessSelector = require('../../selectors/weaknessSelector.js');
const eventSelector = require('../../selectors/eventSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('My Tasks Action', () => {
    var projectId;
    var weakness;
    var vulnerability;
    var event;
    var exploitableRationale;
    var eventDetail;
    var weaknessDescription;
    var newEventDetail;

    before(() => {
        cy.viewport(1920, 1080);            //Creating Project
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            weaknessDescription = 'TC_3153: Weakness is being Automated';
            eventDetail = 'TC_3154 & TC_2781: Event is being Automated';
            newEventDetail = 'TC_2785: New Event is being Automated in another project';
            exploitableRationale = 'Exploitable Rationale Test Description';
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

    it('Verify that After clicking on an Weakness assigned task it is redirected to the right Weakness page number (MAIN-TC-3153)', () => {
        cy.addNewWeakness(weakness, weaknessDescription).then(() => {
            cy.visit(Cypress.env('baseURL') + '/user-profile');
        }).then(() => {
            cy.get(navBarSelector.myTaskSideNavAnchor).click();
            cy.wait(2000);
            cy.get(navBarSelector.taskDescriptionContentArea).contains(weaknessDescription).should('be.visible').click();
        }).then(() => {
            cy.get(weaknessSelector.weaknessDescriptionContentArea).its('length').then((length) => {
                let weaknessRowCount = length;
                cy.get(weaknessSelector.weaknessDescriptionContentArea).should('have.length', weaknessRowCount);
                cy.get(weaknessSelector.weaknessPagination).should('contain', '1 of 1');
            })
        })
    })

    it('Verify that when the user clicks on the weakness in the Task List, that weakness is in the Archived list of the weakness (MAIN-TC-2783, MAIN-TC-2932)', () => {
        let weaknessDescription = 'TC_2783: Weakness is being Automated';
        cy.addNewWeakness(weakness, weaknessDescription).then(() => {
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
            cy.visit(Cypress.env('baseURL') + '/user-profile');
            cy.get(navBarSelector.myTaskSideNavAnchor).click();
        }).then(() => {
            cy.get(navBarSelector.taskDescriptionContentArea).contains(weaknessDescription).should('be.visible').click();
        }).then(() => {
            cy.wait(2000);
            //cy.get(weaknessSelector.weaknessArchivedListPageTab).should('be.visible');
            cy.get(weaknessSelector.addNewWeaknessButton).should('not.exist');  // To assert that it's redirected to the Archived list tab successfully which doesn't contain Add New Weakness button
        }).then(() => {
            cy.get(weaknessSelector.weaknessDescriptionContentArea).its('length').then((length) => {
                let weaknessRowCount = length;
                cy.get(weaknessSelector.weaknessDescriptionContentArea).should('have.length', weaknessRowCount);
                cy.get(weaknessSelector.weaknessPagination).should('contain', '1 of 1');
            })
        })
    })

    it('Verify that After clicking on an Event assigned task it is redirected to the right Event page number (MAIN-TC-3154, MAIN-TC-2781)', () => {
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
            cy.visit(Cypress.env('baseURL') + '/user-profile');
        }).then(() => {
            cy.get(navBarSelector.myTaskSideNavAnchor).click();
            cy.get(navBarSelector.taskDescriptionContentArea).contains(eventDetail).should('be.visible').click();
        }).then(() => {
            cy.wait(1000);
            cy.get(eventSelector.eventDetailsContentArea).its('length').then((length) => {
                let eventRowCount = length;
                cy.get(eventSelector.eventDetailsContentArea).should('have.length', eventRowCount);
                cy.get(eventSelector.eventPagination).should('contain', '1 of 1');
            })
        })
    })

    it('Verify that After clicking on an Vulnerability assigned task it is redirected to the right Vulnerability page number (MAIN-TC-3152)', () => {
        vulnerability.description = 'TC_3152: Vulnerability is being Automated';
        cy.visit(Cypress.env('baseURL') + '/vulnerabilities').then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityListViewAddNewButton).should('exist').then(() => {
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
                cy.visit(Cypress.env('baseURL') + '/user-profile');
            }).then(() => {
                cy.get(navBarSelector.myTaskSideNavAnchor).click();
                cy.get(navBarSelector.taskDescriptionContentArea).contains(vulnerability.description).should('be.visible').click();
            }).then(() => {
                cy.wait(1000);
                cy.get(vulnerabilityListViewSelector.vulnerabilityListViewDescriptionTextArea).its('length').then((length) => {
                    let vulnerabilityRowCount = length;
                    cy.get(vulnerabilityListViewSelector.vulnerabilityListViewDescriptionTextArea).should('have.length', vulnerabilityRowCount);
                    cy.get(vulnerabilityListViewSelector.vulnerabilityPagination).should('contain', '1 of 1');
                })
            })
        })
    })

    it('Verify that if the assigned task is deleted or the Responsibility is changed from Task Category page it shall be removed from My Tasks tab (MAIN-TC-3155)', () => {
        cy.visit(Cypress.env('baseURL') + '/user-profile').then(() => {
            cy.get(navBarSelector.myTaskSideNavAnchor).click();
            cy.get(navBarSelector.taskDescriptionContentArea).contains(eventDetail).should('be.visible').click();
        }).then(() => {
            cy.deleteEvent();
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/user-profile');
            cy.get(navBarSelector.myTaskSideNavAnchor).click();
        }).then(() => {
            cy.wait(2000);
            cy.get(navBarSelector.taskDescriptionContentArea).should('not.contain', eventDetail);
        }).then(() => {
            weakness.responsibleUser = 'Automation Test User';
            cy.get(navBarSelector.taskDescriptionContentArea).contains(weaknessDescription).should('be.visible').click();
        }).then(() => {
            cy.wait(2000);
            cy.get(weaknessSelector.weaknessDescriptionContentArea).first().click();
        }).then(() => {
            cy.get(weaknessSelector.weaknessResponsibleFieldButton).click();
            cy.get(weaknessSelector.weaknessDropDownOptionList).contains(weakness.responsibleUser).click();
        }).then(() => {
            cy.get(weaknessSelector.globalConfirmButton).click();
            cy.get(weaknessSelector.snackBarMessage).should('include.text','Weakness updated successfully.');
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/user-profile');
            cy.get(navBarSelector.myTaskSideNavAnchor).click();
        }).then(() => {
            cy.wait(2000);
            cy.get(navBarSelector.taskDescriptionContentArea).should('not.contain', weaknessDescription);
        })
    })

    it('Verify that If a project is deleted, its data in taskList collection will be deleted (MAIN-TC-2785)', () => {
        cy.generateProjectName().then(($generatedName) => {
            let newProjectName = $generatedName;
            cy.createProject(newProjectName).then(() => {
                cy.get(navBarSelector.loader).should('not.exist');
                cy.visit(Cypress.env('baseURL') + '/event').then(() => { //Go to Event Page
                    cy.wait(2000);
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
                        cy.get(eventSelector.eventDetailFieldBox).clear().type(newEventDetail),
                        ($inputField) => $inputField.val() === newEventDetail,
                        { delay: 1000 })
                        .should('have.value', newEventDetail);
                }).then(() => {
                    cy.get(eventSelector.globalConfirmButton).click();
                }).then(() => {
                    cy.get(eventSelector.snackBarMessage).should('include.text','Event added successfully');
                }).then(() => {
                    cy.visit(Cypress.env('baseURL') + '/user-profile');
                }).then(() => {
                    cy.get(navBarSelector.myTaskSideNavAnchor).click();
                    cy.wait(2000);
                    cy.get(navBarSelector.projectNameContentArea).contains(newProjectName).should('be.visible');
                    cy.get(navBarSelector.taskDescriptionContentArea).contains(newEventDetail).should('be.visible').click();
                }).then(() => {
                    cy.get(navBarSelector.redirectTextDialog).should('be.visible');
                    cy.get(navBarSelector.redirectDialogConfirmButton).click();
                }).then(() => {
                    cy.wait(1000);
                    cy.get(eventSelector.eventDetailsContentArea).its('length').then((length) => {
                        let eventRowCount = length;
                        cy.get(eventSelector.eventDetailsContentArea).should('have.length', eventRowCount);
                        cy.get(eventSelector.eventPagination).should('contain', '1 of 1');
                    })
                }).then(() => {
                    cy.get(navBarSelector.navBarProfileButton).click();
                    cy.get(navBarSelector.profileListProjectNameHeader).first().should('contain', newProjectName);
                })
            }).then(() => {
                cy.deleteProject(newProjectName);
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/user-profile');
            }).then(() => {
                cy.get(navBarSelector.myTaskSideNavAnchor).click();
                cy.wait(2000);
                cy.get(navBarSelector.projectNameContentArea).should('not.contain', newProjectName);
                cy.get(navBarSelector.taskDescriptionContentArea).should('not.contain', newEventDetail);
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