const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse';
var projectName;

describe('Threat List View Drop Down Actions', () => {
    var projectId;
    var textAreaAttribute = 'ng-reflect-model';

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

    it('Verify the working of "Threat History" button (MAIN-TC-840)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewAttackPathColumn).should('exist');
        }).then(() => {
            recurse(
                // the commands to repeat, and they yield the input element
                () => cy.wrap(Cypress.$(navBarSelector.loader).length),
                // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
                ($loaderExist) => $loaderExist == false,//length === 0
                { delay: 1000 });
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAttackPathColumn).then(($foundElementList) => {
                let threatCount = $foundElementList.length;
                expect(threatCount).to.be.greaterThan(0);
                cy.threatHistory(threatCount); //last threat
            }).then(() => { 
                cy.get(threatListViewSelector.threatHistoryCloseIcon).click();
            })
        })
    })

    it('Verify the "Add new threat" button functionality (MAIN-TC-1366)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.intercept('POST', Cypress.env('apiURL') + '/projects/threatsDb*').as('postRequest');
            cy.addNewThreat();
        }).then(() => {
            //verify the network call
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
        }).then(() => {
            //verify the new cells are empty
            cy.get(threatListViewSelector.threatListViewAttackPathColumn).then(($foundElementList) => {
                let threatCount = $foundElementList.length;
                cy.get(threatListViewSelector.threatListViewAttackPathColumn).eq(threatCount - 1).should('have.text', '');//the newly added threat, 0 based counting
                cy.get(threatListViewSelector.threatListViewThreatScenarioTextArea).eq(threatCount - 1).should('have.text', '');//the newly added threat, 0 based counting
            })
        })
    })

    it('Verify the "Save as new threat" button functionality (MAIN-TC-1368)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.intercept('POST', Cypress.env('apiURL') + '/projects/threatsDb*').as('postRequest');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAttackPathColumn).eq(0).invoke('attr', textAreaAttribute).as('originalAttackPath');
            cy.get(threatListViewSelector.threatListViewThreatScenarioTextArea).eq(0).invoke('attr', textAreaAttribute).as('originalThreatScenario');
        }).then(() => {
            cy.saveAsNewThreat(1);
        }).then(() => {
            //verify the network call
            cy.get('@postRequest').its('response.statusCode').should('eq', 200);
            cy.wait(1000);
        }).then(() => {
            //verify the saved threat has the same values
            cy.get(threatListViewSelector.threatListViewAttackPathColumn).eq(1).invoke('attr', textAreaAttribute).as('savedAttackPath');//the saved threat added right after the source threat
            cy.get(threatListViewSelector.threatListViewThreatScenarioTextArea).eq(1).invoke('attr', textAreaAttribute).as('savedThreatScenario');//the saved threat added right after the source threat
        }).then(() => {
            cy.get('@originalAttackPath').then(originalAttackPath => {
                cy.get('@savedAttackPath').then(savedAttackPath => {
                    expect(originalAttackPath).to.equal(savedAttackPath);
                });
            }).then(() => {
                cy.get('@originalThreatScenario').then(originalThreatScenario => {
                    cy.get('@savedThreatScenario').then(savedThreatScenario => {
                        expect(originalThreatScenario).to.equal(savedThreatScenario);
                    })
                })
            })
        })
    })

    it('Verify if user Permanently Deleted a Threat, it should not generate again when the model is run and, should exist in restore threat dialog(MAIN-TC-2147, MAIN-TC-1209)', () => {
        let scenario;
        let threatId;
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewThreatScenarioTextArea).eq(1).invoke('val').then(($value) => {
                scenario = $value;
            }).then(() => {
                cy.get(threatListViewSelector.threatListViewThreatNoTableData).eq(1).invoke('text').then(($text) => {
                    threatId = $text;
                }).then(() => {
                    cy.deleteThreat('permanent', '2');
                }).then(() => {
                    cy.visit(Cypress.env('baseURL') + '/modeling');
                }).then(() => {
                    cy.get(navBarSelector.navBarRunTheModelButton).click();
                }).then(() => {
                    cy.url().should('contain', '/threats');
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewThreatScenarioTextArea).should('not.include.value', scenario);
                }).then(() => {
                    cy.get(navBarSelector.navBarEditButton).click();
                }).then(() => {
                    cy.get(navBarSelector.editListRestoreThreatButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewDamageScenarioTableData).last().should('include.text', scenario);
                    cy.get(threatListViewSelector.threatListViewThreatNoTableData).last().should('include.text', threatId);
                })
            })
        })
    })

    it('Verify if user Permanently Deleted a Threat, it should not be shown in Milestone (MAIN-TC-2148)', () => {
        let milestoneName = 'MAIN-TC-2148';
        let threatNo;
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewThreatNoTableData).first().then(($td) => {
                threatNo = Number($td.text());
            }).then(() => {
                cy.deleteThreat('permanent', '1');
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/modeling');
            }).then(() => {
                cy.createMilestone(milestoneName);
            }).then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('contain', 'Milestone MAIN-TC-2148 is created successfully.');
            }).then(() => {
                cy.loadMilestone(milestoneName);
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/threats');
            }).then(() => {
                cy.get(threatListViewSelector.threatListViewThreatNoTableData).should('not.include.value', threatNo);
            })
        })
    })

    it('Verify the Reviewed threats shall not change the threat id (MAIN-TC-1114)', () => {
        let threatNo;
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewThreatNoTableData).first().then(($td) => {
                threatNo = Number($td.text());
            }).then(() => {
                recurse(//wait until the loader spinner disappear
                    () => cy.wrap(Cypress.$(navBarSelector.loader).length),
                    ($loaderExist) => $loaderExist == false,//length === 0
                    { delay: 1000 });
                cy.get(threatListViewSelector.threatListViewThreatActionsButton).should('be.visible');
            }).then(() => {
                cy.reviewThreat(1);
            }).then(() => {
                cy.get(threatListViewSelector.threatListViewThreatNoTableData).first();
            }).then(($td) => {
                expect(Number($td.text())).to.eq(threatNo);
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