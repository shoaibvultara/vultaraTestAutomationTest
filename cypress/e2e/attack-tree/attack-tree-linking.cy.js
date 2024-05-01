import { recurse } from 'cypress-recurse';
const attackPathPopupSelector = require('../../selectors/attackPathPopupSelector.js');
const attackTreeSelector = require('../../selectors/attackTreeSelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
const vulnerabilityListViewSelector = require('../../selectors/vulnerabilityListViewSelector.js');
var projectName;

describe('Linking the Attack Tree with Threats & Vulnerabilities', () => {
    var projectId;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        //Generate a random project name
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
        }).then(() => {
            cy.createModel().then(() => {
                cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandThreatIcon).should('be.visible');
                })
            })
        })
    })
    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Pop-up to link Threat to an Attack Tree (MAIN-TC-3226)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewAttackPathButton).eq(0).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathLinkTreePopup).should('exist');
            cy.get(attackPathPopupSelector.attackPathLinkTreePopupCreateTree).invoke('text').should('include', 'Create a new Tree');
            cy.get(attackPathPopupSelector.attackPathLinkTreePopupLoadTree).should('include.text', 'Load a Tree');
        })
    })

    it('Linking the Threat with New Tree (MAIN-TC-3227)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewAttackPathButton).eq(0).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathLinkTreePopup).should('exist');
            cy.get(attackPathPopupSelector.attackPathLinkTreePopupCreateTreeButton).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogNextButton).click();
        }).then(() => {
            recurse(
                () => cy.get(attackPathPopupSelector.attackPathDialogTreeName).clear().type('Tree to Link'),
                ($inputField) => $inputField.val() == 'Tree to Link',
                { delay: 1000 })
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogConfirmButton).eq(1).click();    //shows 2 confirm button
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkAttackPath).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkAttackPathPopupThreatNumber).should('include.text', '1');
        })
    })

    it('Linking the Threat with Existing Tree (MAIN-TC-3228)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewAttackPathButton).eq(1).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathLinkTreePopup).should('exist');
            cy.get(attackPathPopupSelector.attackPathLinkTreePopupLoadTreeButton).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogNextButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogConfirmButton).eq(1).click();    //shows 2 confirm button
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkAttackPath).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkAttackPathPopupThreatNumber).eq(1).should('include.text', '2');
        })
    })

    it('Linking the tree by opening "link Attack Tree" option in Tree drop down (MAIN-TC-3229)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkAttackPath).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkAttackPathPopupShowAllButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkAttackPathPopupLinkThreatCheckbox).eq(2).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkAttackPathPopupYesButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkAttackPath).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkAttackPathPopupLinkThreatCheckbox).eq(2).should('be.checked');
        })
    })

    it('Verify if tree is already linked Threat will directly opens the attack tree (MAIN-TC-3230)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewAttackPathButton).eq(0).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkAttackPathPopupShowAllButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogCanvas).should('be.visible');
        })
    })

    it('Verify the attack tree button on vulnerability page (MAIN-TC-3234, MAIN-TC-3235)', () => {
        var vulnerability; //Creating Vulnerabilities
        vulnerability = {
            description: 'TO BE DELETED',
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
        cy.addNewVulnerability(vulnerability).then(() => {
            cy.wait(1000);
            cy.addNewVulnerability(vulnerability);
        }).then(() => {
            cy.wait(1000);
            cy.addNewVulnerability(vulnerability);
        }).then(() => {
            cy.wait(1000);
            cy.reload();
            cy.get(vulnerabilityListViewSelector.attackTreeButton).should('exist').should('be.visible').should('be.enabled');
            cy.get(vulnerabilityListViewSelector.vulnerabilityListViewDescriptionTextArea).eq(0).click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityPopupAttackTreeIcon).should('not.be.enabled');
            cy.get(vulnerabilityListViewSelector.vulnerabilityPopupLinkTreeButton).should('not.be.enabled');
        })
    })

    it('Loading the Attack tree then opening vulnerability popup (MAIN-TC-3236)', () => {
        cy.visit(Cypress.env('baseURL') + '/vulnerabilities').then(() => {
            cy.get(vulnerabilityListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogSelectTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityListViewDescriptionTextArea).eq(0).click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityPopupLinkTreeButton).should('be.enabled');
        })
    })

    it('Linking a vulnerability through Vulnerability Popup(MAIN-TC-3237)', () => {
        cy.visit(Cypress.env('baseURL') + '/vulnerabilities').then(() => {
            cy.get(vulnerabilityListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogSelectTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityListViewDescriptionTextArea).eq(0).click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityPopupLinkTreeButton).click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityPopupAttackTreeIcon).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogCanvas).should('be.visible')
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkVulnerability).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkVulnerabilityPopupVulnerabilityNumber).eq(0).should('include.text', '3');
        })
    })

    it('Linking a vulnerability through Tree Drop-down (MAIN-TC-3238)', () => {
        cy.visit(Cypress.env('baseURL') + '/vulnerabilities').then(() => {
            cy.get(vulnerabilityListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogSelectTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkVulnerability).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkVulnerabilityPopupShowAllButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLinkAttackPathPopupLinkThreatCheckbox).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityListViewDescriptionTextArea).eq(1).click();
        }).then(() => {
            cy.get(vulnerabilityListViewSelector.vulnerabilityPopupAttackTreeIcon).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogCanvas).should('be.visible');
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