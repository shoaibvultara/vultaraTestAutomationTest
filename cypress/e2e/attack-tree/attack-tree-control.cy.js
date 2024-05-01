import { recurse } from 'cypress-recurse';
const attackTreeSelector = require('../../selectors/attackTreeSelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js')
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
var projectName;

describe('Attack Tree Control', () => {
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
        })
    })
    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Adding a Control (MAIN-TC-3225)', () => {
        let attackTreeName = 'Control Testing';
        let controlName = 'New Control';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).click();
        }).then(() => {
            recurse(
                () => cy.get(attackTreeSelector.attackTreeDialogNewTreePopupName).clear().type(attackTreeName),
                ($inputField) => $inputField.val() == attackTreeName,
                { delay: 1000 })
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogNode).first().realClick({ force: true }).realMouseDown({ force: true }).realMouseMove(50, -300).get(attackTreeSelector.attackTreeDialogCanvas).realMouseUp({ force: true });
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogCanvasComponent3Dots).first().click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeCanvasComponentMenuControlOption).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeCanvasControlPopup).should('be.visible');
            cy.get(attackTreeSelector.attackTreeCanvasControlAddNewControlButton).click();
        }).then(() => {
            recurse(
                () => cy.get(attackTreeSelector.attackTreeCanvasControlAddNewControlNameTextarea).clear().type(controlName),
                ($inputField) => $inputField.val() == controlName,
                { delay: 1000 })
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeCanvasControlConfirmButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeCanvasControlConfirmButton).eq(0).click();
        }).then(() => {
            cy.wait(2000);
            cy.get(attackTreeSelector.attackTreeCanvasControlShieldIcon).should('be.visible')
            cy.get(attackTreeSelector.attackTreeCanvasControlAnimation).should('be.visible');
            cy.get(attackTreeSelector.attackTreeDialogSaveIcon).click({ force: true })
            cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Attack Tree saved successfully.')
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/cybersecurity-control');
        }).then(() => {
            cy.wait(2000);
            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).first().should('include.value', controlName);
        })
    })

    it('Feasibility Criteria Values (MAIN-TC-3239)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogCanvasComponentName).should('include.text', 'WIN:10,EQU:9 EXP:8,ELA:19');
        })
    })

    it('Right & Left Click on Shield (MAIN-TC-3240, MAIN-TC-3242)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeCanvasControlShieldIcon).click({ force: true });
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeCanvasControlAnimation).should('not.exist');
            cy.get(attackTreeSelector.attackTreeDialogCanvasComponentName).should('include.text', 'WIN:0,EQU:0 EXP:0,ELA:0');
            cy.get(attackTreeSelector.attackTreeCanvasControlShieldIcon).rightclick();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeCanvasControlPopup).should('be.visible');
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
