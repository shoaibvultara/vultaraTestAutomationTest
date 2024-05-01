const navBarSelector = require('../../selectors/navBarSelector.js')
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
const projectLibrarySelector = require('../../selectors/projectLibrarySelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
import { recurse } from 'cypress-recurse'
var projectName;

describe('Cybersecurity Claim Pool', () => {
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
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Verify user cannot add empty claims in Cybersecurity claim tab (MAIN-TC-336, MAIN-TC-123, MAIN-TC-414, MAIN-TC-343, MAIN-TC-363)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            cy.get(navBarSelector.loader).should('not.exist');
            cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click();
        }).then(() => {
            cy.get(cybersecurityPoolSelector.cybersecurityClaimPoolTitle).should('be.visible');
            cy.get(cybersecurityPoolSelector.noCybersecurityClaimFoundDescription).should('be.visible');
            cy.get(cybersecurityPoolSelector.claimPoolAddNewClaimButton).click();
        }).then(() => {
            cy.get(cybersecurityPoolSelector.addNewDialogContentTextArea).should('have.value', '');
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).should('not.be.enabled');
        }).then(() => {
            cy.get(cybersecurityPoolSelector.cybersecurityPoolAddFromLibraryParagraph).click();
        }).then(() => {
            cy.get(cybersecurityPoolSelector.claimPoolAddClaimSearchInput).clear();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).should('not.be.enabled');
        })
    })

    it('Verify adding a new claim from the cybersecurity claim tab (MAIN-TC-339, MAIN-TC-366)', () => {
        let claimName = 'CLM_TC_339>' + projectName.substring(20);
        cy.addClaim(claimName);
    })

    it('Verify application updates claim name with snack bar message (MAIN-TC-330)', () => {
        let claimName = 'CLM_TC_330>' + projectName.substring(20);
        let updatedClaimName = 'updated CLM>' + projectName.substring(20);
        cy.addClaim(claimName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal');
        }).then(() => {
            cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click();
            cy.wait(2000);
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
                if ($element.val() === claimName) {
                    cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                recurse(
                    () => cy.get(cybersecurityPoolSelector.addNewDialogContentTextArea).clear().type(updatedClaimName),
                    ($inputField) => $inputField.val() === updatedClaimName,
                    { delay: 1000 })
            }).then(() => {
                cy.get(navBarSelector.confirmDialogueConfirmButton).click();
            }).then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'claim has been updated successfully');
            })
        })
    })

    it('Verify "Add to Library" button adds the claim to the library (MAIN-TC-358)', () => {
        let claimName = 'CLM_TC_358>' + projectName.substring(20);
        cy.addClaim(claimName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal');
        }).then(() => {
            cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click();
            cy.wait(2000);
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each(($element) => {
                if ($element.val() === claimName) {
                    cy.get(projectLibrarySelector.libraryMoreOptionsButton).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
                indexOfRecord++;
            }).then(() => {
                cy.get(cybersecurityPoolSelector.addClaimToLibraryButton).click();
            }).then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Claim added to the library successfully');
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/library');
            }).then(() => {
                cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click({ force: true });
            }).then(() => {
                cy.get(projectLibrarySelector.cybersecurityClaimTab).click();
                cy.wait(2000);
            }).then(() => {
                cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('include.value', claimName);
            }).then(() => {
                cy.deleteClaimFromLibrary(claimName);
            })
        })
    })

    it('Claims added from "Search in Library" (MAIN-TC-320)', () => {
        let claimName = 'CLM_TC_320>' + projectName.substring(20);
        cy.addClaimToLibrary(claimName).then(() => {
            cy.addClaimFromLibrary(claimName);
        }).then(() => {
            cy.deleteClaimFromLibrary(claimName);
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