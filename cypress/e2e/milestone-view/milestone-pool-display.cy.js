import { recurse } from 'cypress-recurse'
const navBarSelector = require('../../selectors/navBarSelector.js')
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
const vulnerabilityListViewSelector = require('../../selectors/vulnerabilityListViewSelector.js');
const projectTriggerSelector = require('../../selectors/projectTriggerSelector.js');
const monitoringPageSelector = require('../../selectors/monitoringPageSelector.js');
const assumptionPageSelector = require('../../selectors/assumptionPageSelector.js');
const modelingViewSelector = require('../../selectors/modelingViewSelector.js');
var projectName;

describe('Milestone & Cybersecurity Pools Display', () => {
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
        cy.login();
        cy.loadProject(projectId);
    })

    it('Verify that the Cybersecurity Control pool page shall show the records in the milestone view (MAIN-TC-2113, MAIN-TC-830)', () => {
        cy.visit(Cypress.env('baseURL'));
        cy.addControl('MAIN-TC-2113-Control');
        cy.wait(1000);
        milestoneName = 'MAIN-TC-2113'
        cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
        cy.createMilestone(milestoneName).then(() => {
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone MAIN-TC-2113 is created successfully.');
        });
        cy.loadMilestone(milestoneName);
        cy.get(modelingViewSelector.modelingViewMilestoneNameDiv).should('exist');
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-control');
        cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('exist');
    })

    it('Verify that the project pages shall show the records in the milestone view (MAIN-TC-2115, MAIN-TC-2116, MAIN-TC-2117, MAIN-TC-2119, MAIN-TC-2120, MAIN-TC-2121, MAIN-TC-843, MAIN-TC-845)', () => {
        cy.visit(Cypress.env('baseURL'));
        cy.wait(1000);
        //req
        const requirementName = 'Automation_Requirement';
        cy.addRequirement(requirementName);
        cy.wait(500);
        //bom
        const bom = {
            version: '1',
            product: 'automation_test',
            vendor: 'automation_test',
            part: 'Application',
        };
        cy.addNewBom(bom);
        cy.wait(500);
        //vuln
        const vulnerability = {
            description: 'Automation_Vulnerability',
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
        cy.addNewVulnerability(vulnerability);
        cy.wait(500);
        //trigger
        cy.generateTrigger();
        cy.wait(500);
        //monitor
        cy.addNewInformation('Automation_Information');
        cy.wait(500);
        //assumption
        cy.addNewAssumption('Automation_Assumption');
        cy.wait(500);
        //create milestone
        milestoneName = 'MAIN-TC-2115-2116-2117-2119-2120-2121';
        cy.intercept('POST', Cypress.env('apiURL') + '/milestones/projectMilestoneDb*').as('postRequest');
        cy.createMilestone(milestoneName).then(() => {
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone MAIN-TC-2115-2116-2117-2119-2120-2121 is created successfully.');
        });
        cy.loadMilestone(milestoneName);
        cy.get(modelingViewSelector.modelingViewMilestoneNameDiv).should('exist');
        //assert records are shown
        cy.visit(Cypress.env('baseURL') + '/requirements').then(() => {
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('have.value', requirementName);
        })
        cy.visit(Cypress.env('baseURL') + '/vulnerabilities').then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityListViewDescriptionTextArea).should('have.value', vulnerability.description);
        })
        cy.visit(Cypress.env('baseURL') + '/monitoring').then(() => {//Go to Monitoring Page
            cy.get(monitoringPageSelector.infoContentSummaryTextArea).eq(2).should('have.value', 'Automation_Information');
            cy.get(projectTriggerSelector.projectTriggerListTab).click().then(() => {
                cy.get(monitoringPageSelector.infoContentSummaryTextArea).first().should('have.value', 'automation_test');
            })
        })
        cy.visit(Cypress.env('baseURL') + '/assumptions').then(() => {
            cy.get(assumptionPageSelector.assumptionRowTextArea).should('have.value', 'Automation_Assumption');
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