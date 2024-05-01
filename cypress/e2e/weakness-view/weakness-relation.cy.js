const vulnerabilityListViewSelector = require('../../selectors/vulnerabilityListViewSelector.js')
const weaknessSelector = require('../../selectors/weaknessSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('Weakness Relation', () => {
    var projectId;
    var weakness;
    var vulnerability;
    var event;
    var exploitableRationale;
    var weaknessDescription;
    var preControlRiskValue;
    var riskRationale;
    var eventDetail;
    var evaluationNote;

    before(() => {
        cy.viewport(1920, 1080);            //Creating Project
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            weaknessDescription = 'Weakness is being Automated';
            exploitableRationale = 'Exploitable Rationale Test Description';
            preControlRiskValue = '1';
            riskRationale = '2';
            eventDetail = 'Event Details Test Description' + ': ' + $generatedName;
            evaluationNote = 'Evaluation Notes Test Description' + ': ' + $generatedName;
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
        //setup the vulnerability object
        vulnerability = {
            description: 'Vulnerability is being Automated',
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
        //setup Event objects
        event = {
            triggerName: 'Microcontroller0',
            priority: 'High',
            responsibleUser: 'Automation Test User',
        };
    })

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify the working of "Generate vulnerability from this weakness" button (MAIN-TC-899, MAIN-TC-2346)', () => {
        let weaknessDescription = 'TC_2346 is being Automated';
        cy.createComponent().then(() => {
            cy.addNewWeakness(weakness, weaknessDescription);
        }).then(() => {
            cy.wait(2000);
            cy.get(weaknessSelector.vulnerabilityAnalysisButton).first().click({ force: true });  // Open Analyze Weakness Dialog
        }).then(() => {
            cy.get(weaknessSelector.analyzeWeaknessExploitableButton).click();
            cy.get(weaknessSelector.weaknessDropDownOptionList).eq(0).click();
        }).then(() => {
            recurse(() =>
                cy.get(weaknessSelector.analyzeWeaknessExploitableRationaleFieldBox).clear().type(exploitableRationale),
                ($inputField) => $inputField.val() === exploitableRationale,
                { delay: 1000 })
                .should('have.value', exploitableRationale);
        }).then(() => {
            recurse(() =>
                cy.get(weaknessSelector.preControlRiskValueFieldBox).clear().type(preControlRiskValue),
                ($inputField) => $inputField.val() === preControlRiskValue,
                { delay: 1000 })
                .should('have.value', preControlRiskValue);
        }).then(() => {
            recurse(() =>
                cy.get(weaknessSelector.riskRationaleFieldBox).clear().type(riskRationale),
                ($inputField) => $inputField.val() === riskRationale,
                { delay: 1000 })
                .should('have.value', riskRationale);
        }).then(() => {
            cy.get(weaknessSelector.globalCheckBox).check({ force: true });
            cy.get(weaknessSelector.globalConfirmButton).click();
        }).then(() => {
            cy.wait(2000);
            cy.get(weaknessSelector.generateVulnerabilityFromThisWeaknessButton).click();
        }).then(() => {
            cy.get(weaknessSelector.globalConfirmButton).click();
            cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Changes saved successfully');
        })
    })

    it('Verify the update functionality in weakness page (MAIN-TC-936, MAIN-TC-1340)', () => {
        let updatedAsset = 'MAIN-TC-936 Asset is updated';
        weakness.asset = 'MAIN-TC-936';
        cy.addNewVulnerability(vulnerability).then(() => {
            cy.addNewWeakness(weakness, weaknessDescription);
        }).then(() => {
            cy.wait(2000);
            cy.get(weaknessSelector.vulnerabilityAnalysisButton).first().click({ force: true });  // Open Analyze Weakness Dialog
        }).then(() => {
            cy.get(weaknessSelector.analyzeWeaknessExploitableButton).click();
            cy.get(weaknessSelector.weaknessDropDownOptionList).eq(0).click();
        }).then(() => {
            recurse(() =>
                cy.get(weaknessSelector.analyzeWeaknessExploitableRationaleFieldBox).clear().type(exploitableRationale),
                ($inputField) => $inputField.val() === exploitableRationale,
                { delay: 1000 })
                .should('have.value', exploitableRationale);
        }).then(() => {
            recurse(() =>
                cy.get(weaknessSelector.preControlRiskValueFieldBox).clear().type(preControlRiskValue),
                ($inputField) => $inputField.val() === preControlRiskValue,
                { delay: 1000 })
                .should('have.value', preControlRiskValue);
        }).then(() => {
            recurse(() =>
                cy.get(weaknessSelector.riskRationaleFieldBox).clear().type(riskRationale),
                ($inputField) => $inputField.val() === riskRationale,
                { delay: 1000 })
                .should('have.value', riskRationale);
        }).then(() => {
            cy.get(weaknessSelector.globalCheckBox).check({ force: true });
            cy.get(weaknessSelector.globalConfirmButton).click();
        }).then(() => {
            cy.wait(2000);
            cy.get(weaknessSelector.globalCheckBox).eq(0).check({ force: true });
        }).then(() => {
            cy.get(weaknessSelector.globalConfirmButton).click();
        }).then(() => {
            cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Changes saved successfully');
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/vulnerabilities');
            cy.get(vulnerabilityListViewSelector.vulnerabilityListViewMoreButton).first().click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.moreButtonWeaknessLinkingButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(vulnerabilityListViewSelector.weaknessLinkDialogAssetColumn).first().should('contain', weakness.asset);
            cy.get(weaknessSelector.globalCancelButton).click();
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/weaknesses');
            cy.wait(2000);
        }).then(() => {
            cy.get(weaknessSelector.weaknessContentTextArea).first().click();
            recurse(() =>
                cy.get(weaknessSelector.weaknessAssetFieldBox).clear().type(updatedAsset),
                ($inputField) => $inputField.val() === updatedAsset,
                { delay: 1000 })
                .should('have.value', updatedAsset);
        }).then(() => {
            cy.get(weaknessSelector.globalConfirmButton).click();
            cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Weakness updated successfully.');
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/vulnerabilities');
            cy.get(vulnerabilityListViewSelector.vulnerabilityListViewMoreButton).first().click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.moreButtonWeaknessLinkingButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(vulnerabilityListViewSelector.weaknessLinkDialogAssetColumn).first().should('contain', updatedAsset);
        })
    })

    it('Verify that the Weakness Event Linking dialog shall have the following columns Info ID, Event ID, Date of Event, Event Details, Responsible, Evaluation Notes (MAIN-TC-2218)', () => {
        let informationIdHeader = 'Information ID';
        let eventIdHeader = 'Event ID';
        let dateOfEventHeader = 'Date of Event';
        let eventDetailsHeader = 'Event Details';
        let responsibleHeader = 'Responsible';
        let evaluationNotesHeader = 'Evaluation Notes';
        let weaknessDescription = 'TC_2218 is being Automated';
        weakness.asset = 'MAIN-TC-2218';
        cy.createComponent().then(() => {
            cy.wait(1000);
            cy.generateTrigger();
        }).then(() => {
            cy.addNewEventWhenEventStatusCompleted(event, eventDetail, evaluationNote);
        }).then(() => {
            cy.addNewWeakness(weakness, weaknessDescription);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/weaknesses');
            cy.wait(1000);
        }).then(() => {
            cy.get(weaknessSelector.weaknessDropDownActionButton).eq(0).click({ force: true });
        }).then(() => {
            cy.get(weaknessSelector.eventLinkingButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(weaknessSelector.headerRow).contains(informationIdHeader).should('be.visible');
            cy.get(weaknessSelector.headerRow).contains(eventIdHeader).should('be.visible');
            cy.get(weaknessSelector.headerRow).contains(dateOfEventHeader).should('be.visible');
            cy.get(weaknessSelector.headerRow).contains(eventDetailsHeader).should('be.visible');
            cy.get(weaknessSelector.headerRow).contains(responsibleHeader).should('be.visible');
            cy.get(weaknessSelector.headerRow).contains(evaluationNotesHeader).should('be.visible');
        }).then(() => {
            cy.get(weaknessSelector.globalCheckBox).eq(0).check({ force: true }).should('be.checked');
            cy.get(weaknessSelector.globalConfirmButton).click();
        }).then(() => {
            cy.get(weaknessSelector.snackBarMessage).should('include.text', 'Changes saved successfully');
        })
    })

    it('Verify that if user updated any field in Analyze Weakness dialog and clicked on cancel button in Confirmation box nothing is updated (MAIN-TC-2931)', () => {
        cy.visit(Cypress.env('baseURL') + '/weaknesses').then(() => { // Go to Weakness Page
            cy.createComponent().then(() => {
                cy.addNewWeakness(weakness, weaknessDescription).then(() => {
                    cy.get(weaknessSelector.vulnerabilityAnalysisButton).first().click({ force: true }).then(() => {
                        cy.get(weaknessSelector.analyzeWeaknessExploitableButton).click().then(() => {
                            cy.get(weaknessSelector.weaknessDropDownOptionList).eq(0).click();
                        })
                    }).then(() => {
                        cy.get(weaknessSelector.globalCancelButton).click().then(() => {
                            cy.get(weaknessSelector.globalConfirmButton).last().click().then(() => {
                                cy.get(weaknessSelector.vulnerabilityAnalysisButton).should('be.visible');
                            })
                        })
                    })
                })
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