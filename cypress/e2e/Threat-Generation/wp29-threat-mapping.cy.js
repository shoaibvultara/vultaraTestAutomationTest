const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('WP29 Threats in Threat List View', () => {
    var projectId;

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
        cy.createModel().then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
        }).then(() => {
            cy.get(navBarSelector.loader).should('not.exist');
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Verify that default notes shall be added to all WP29 generated threats (MAIN-TC-2425)', () => {
        let threatCount;
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewThreatActionsButton).then(($actionButtonList) => {
                threatCount = $actionButtonList.length;
            });
            cy.mapThreatListToWP29().then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'WP29 threat mapping is successfully done');
            })
        }).then(() => {
            cy.get(navBarSelector.loader).should('not.exist').then(() => {
                cy.expandThreat(threatCount + 1); // the recently generated threat
            })
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewNoteTextArea).should('have.value', 'WP29 engine: this threat is automatically generated based on WP29 requirements. Please check carefully whether this threat is relevant, should be a standalone threat, or merged with other threats.');
        })
    })

    it('Verify if the user can delete WP29 threats permanently after generating them (MAIN-TC-2154)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.mapThreatListToWP29().then(() => {
                cy.intercept('GET', Cypress.env('apiURL') + '/projects/threatsDb*').as('getRequest');
                cy.get(navBarSelector.loader).should('not.exist').then(() => {
                    cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'WP29 threat mapping is successfully done');
                    cy.get('@getRequest').its('response.statusCode').should('eq', 200).then(() => {
                        let threatCountBeforeDeletion = Cypress.$(threatListViewSelector.threatListViewPaginator).text().trim().split(" ").pop();// get last number of paginator, i.e. # of threats
                        cy.deleteHighlightedThreat().then(() => {
                            let threatCountAfterDeletion = Cypress.$(threatListViewSelector.threatListViewPaginator).text().trim().split(" ").pop();
                            expect(Number(threatCountAfterDeletion)).to.be.lessThan(Number(threatCountBeforeDeletion));
                        })
                    })
                })
            })
        })
    })

    it('Verify that when user map WP29 threats, it shall show the Show Mapping button enabled (MAIN-TC-2263)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.mapThreatListToWP29().then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'WP29 threat mapping is successfully done');
                cy.get(navBarSelector.navBarEditButton).click().then(() => {
                    cy.get(navBarSelector.editListShowMappingButton).should('be.enabled');
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