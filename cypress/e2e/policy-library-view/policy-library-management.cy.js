const navBarSelector = require('../../selectors/navBarSelector.js')
const projectLibrarySelector = require('../../selectors/projectLibrarySelector.js')
var projectName;

describe('Policy Library Management', () => {
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
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify the "Create New Policy" button functionality (MAIN-TC-1473, MAIN-TC-1475)', () => {
        var highestPolicyNo;
        cy.visit(Cypress.env('baseURL') + '/library').then(() => {
            cy.get(projectLibrarySelector.librarySideNavPolicyAnchor).should('exist').then(() => {
                cy.get(projectLibrarySelector.librarySideNavPolicyAnchor).click();
            })
        }).then(() => {
            cy.get('body').then((body) => {
                if (body.find(projectLibrarySelector.policyNumberTableCell).length < 1) {
                    highestPolicyNo = 0;
                }
                else {
                    cy.get(projectLibrarySelector.policyNumberTableCell).first().invoke('text').then(($val) => {
                        highestPolicyNo = $val;
                    })
                }
            });
            cy.get(projectLibrarySelector.createNewPolicyButton).click().then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement)
                    .should('exist')
                    .and('include.text', 'A new policy successfully created.');
            })
        }).then(() => {
            cy.get(navBarSelector.subsequentSnackBarElement).should('not.exist').then(() => {
                cy.get(projectLibrarySelector.policyNumberTableCell).first().invoke('text').then(($val) => {
                    expect(Number($val)).to.be.greaterThan(Number(highestPolicyNo));//The new row shall be added on the top of the list having highest number
                })
                cy.get(projectLibrarySelector.policyEnabledCheckbox).first().should('not.be.checked');
            })
        }).then(() => {
            cy.get(projectLibrarySelector.deletePolicyIcon).first().click().then(() => {
                cy.get(navBarSelector.confirmDialogueDeleteButton).click();
            })
        }).then(() => {
            cy.get(projectLibrarySelector.policyComparisonOperatorSelect).first().click().then(() => {
                cy.get(projectLibrarySelector.policyLibraryLessThanOperator).should('be.visible');
                cy.get(projectLibrarySelector.policyLibraryLessThanOrEqualToOperator).should('be.visible');
                cy.get(projectLibrarySelector.policyLibraryEqualToOperator).should('be.visible');
                cy.get(projectLibrarySelector.policyLibraryGreaterThanOrEqualToOperator).should('be.visible');
                cy.get(projectLibrarySelector.policyLibraryGreaterThanOperator).should('be.visible');
            })
        })
    })

    it('Verify the "Delete" policy functionality (MAIN-TC-1486, MAIN-TC-1925)', () => {
        let deleteIcon = 'material-icons';
        cy.visit(Cypress.env('baseURL') + '/library').then(() => {
            cy.get(projectLibrarySelector.librarySideNavPolicyAnchor).should('exist').then(() => {
                cy.get(projectLibrarySelector.librarySideNavPolicyAnchor).click();
            })
        }).then(() => {
            cy.get(projectLibrarySelector.createNewPolicyButton).click().then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement)
                    .should('exist')
                    .and('include.text', 'A new policy successfully created.');
            })
        }).then(() => {
            cy.get(navBarSelector.subsequentSnackBarElement).should('not.exist').then(() => {
                cy.get(projectLibrarySelector.deletePolicyIcon).first().click().then(() => {
                    cy.get(navBarSelector.dialogMessageParagraph).should('include.text', 'Are you sure you want to delete policy');
                    cy.get(navBarSelector.confirmDialogueDeleteButton).click();
                })
            }).then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement)
                    .should('exist')
                    .and('include.text', 'deleted.');
            }).then(() => {
                cy.get(projectLibrarySelector.deletePolicyIcon).first().should('have.class', deleteIcon);
            }).then(() => {
                cy.get(projectLibrarySelector.librarySideNavRequirementAnchor).should('exist').click();
            }).then(() => {
                cy.wait(1000);
                cy.get(projectLibrarySelector.requirementLibraryDeleteIcon).first().should('have.class', deleteIcon);
            }).then(() => {
                cy.get(projectLibrarySelector.librarySideNavAttackActionAnchor).should('exist').click();
            }).then(() => {
                cy.wait(1000);
                cy.get(projectLibrarySelector.attackActionLibraryDeleteButton).first().should('have.class', deleteIcon);
            }).then(() => {
                cy.get(projectLibrarySelector.librarySideNavDamageScenarioAnchor).should('exist').click();
            }).then(() => {
                cy.wait(1000);
                cy.get(projectLibrarySelector.damageScenarioLibraryDeleteButton).first().should('have.class', deleteIcon);
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