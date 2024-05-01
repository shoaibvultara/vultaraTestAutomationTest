const threatListViewSelector = require('../../selectors/threatListViewSelector.js')
const attackPathPopupSelector = require('../../selectors/attackPathPopupSelector.js');
const attackTreeSelector = require('../../selectors/attackTreeSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse'
var projectName;

describe('Attack Tree', () => {
    var projectId;
    //Creating Project
    before(() => {
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
            expect(newDesignData.project).to.not.be.undefined;            //Have to change because 
            // Extract the project ID from the nested structure
            projectId = newDesignData.project.id;                         //projectId to be used 
            expect(projectId).to.not.be.undefined;
            cy.log("Project ID is: " + projectId);
        })
        cy.getCookie('accessToken').then((cookie) => {
            if (cookie) {
                const cookieValue = cookie.value;
                // Make the API request to generate threats
                cy.request({
                    url: `${Cypress.env('apiURL')}/projects/threatsDb`,
                    method: 'POST',
                    body: {
                        threat: {
                            threatRowNumber: 1, id: "threatid" + 1, projectId: projectId, asset: "Asset Test " + 1,
                            threatScenario: "Threat Scenario " + 1, attackPathName: "Attack Path Name " + 1,
                            damageScenario: "Damage Scenario " + 1, impactF: 1, impacctO: 1, riskLevel: 1,
                            riskScore: 1, treatment: "no treatment", securityPropertyCia: "c"
                        }
                    },
                })
            }
        });
    })

    beforeEach(() => {// Logging In and Loading Project
        cy.viewport(1920, 1080);
        cy.login();
        cy.loadProject(projectId);
    })

    it('Attack Tree Button in Threat List View page (MAIN-TC-1988, MAIN-TC-1990, MAIN-TC-1992)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).should('exist').click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialog).should('exist');
            cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialog).should('not.be.visible');
        })
    })

    it('Tree in Attack Path Popup (MAIN-TC-1993, MAIN-TC-1994, MAIN-TC-1995, MAIN-TC-1996)', () => {
        let attackTreeName = 'Automation Tree';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).click();
        }).then(() => {
            recurse(() =>
                cy.get(attackTreeSelector.attackTreeDialogNewTreePopupName).clear().type(attackTreeName),
                ($inputField) => $inputField.val() === attackTreeName,
                { delay: 1000 })
                .should('have.value', attackTreeName);
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAttackPathTextArea).click();
            cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathLinkTreePopupLoadTreeButton).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogNextButton).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogLinkCurrentLoadedTreeButton).click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogConfirmButton).last().click();
        }).then(() => {
            cy.get(attackPathPopupSelector.attackPathDialogAttackTreeIcon).should('exist').click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialog).should('exist');
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).should('exist').invoke('text').should('include', attackTreeName);
        })
    })

    it('Attack Tree in Local Storage (MAIN-TC-1997, MAIN-TC-1998, MAIN-TC-2000, MAIN-TC-2001, MAIN-TC-2002)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.window().then((win) => {
                const diagramId = win.localStorage.getItem('diagramId');
                expect(diagramId).to.not.exist;
            }).then(() => {
                cy.get(threatListViewSelector.attackTreeButton).click();
            }).then(() => {
                cy.wait(1000);
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
            }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();
            }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogSelectTree).click();
            }).then(() => {
                cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click();
            }).then(() => {
                cy.wait(2000);
                cy.window().then((win) => {
                    const diagramId = win.localStorage.getItem('diagramId');
                    expect(diagramId).to.exist;
                }).then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogHeader).should('exist').should('be.visible');
                    cy.get(attackTreeSelector.attackTreeDialogCanvas).should('exist').should('be.visible');
                    cy.get(attackTreeSelector.attackTreeDialogFooter).should('exist').should('be.visible');
                }).then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(0).should('exist').invoke('text').should('contain', 'Tree');
                    cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).should('exist').click();
                }).then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogDropDown).should('exist');
                }).then(() => {
                    cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).should('exist').invoke('text').should('include', 'Loaded: Automation Tree');
                    cy.get(attackTreeSelector.attackTreeDialogSaveIcon).should('exist');
                    cy.get(attackTreeSelector.attackTreeDialogPlayIcon).last().should('exist');
                })
            })
        })
    })

    it('Verify the Components when No project is Loaded (MAIN-TC-2003, MAIN-TC-3219)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click().then(() => {
                cy.wait(1000);
                cy.get(attackTreeSelector.attackTreeDialogHeader).should('exist').should('be.visible');
                cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).should('be.enabled');
                cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).should('exist').invoke('text').should('include', 'Loaded: None');
                cy.get(attackTreeSelector.attackTreeDialogSaveIcon).should('not.be.enabled');
                cy.get(attackTreeSelector.attackTreeDialogPlayIcon).should('not.be.enabled');
                cy.get(attackTreeSelector.attackTreeDialogFooter).should('not.exist');
            })
        })
    })

    it('Attack tree panel "Tree Button Dropdown" option (MAIN-TC-2004)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogDropDown).should('exist');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).should('be.enabled').invoke('text').should('contain', 'New Tree');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDetailsButton).should('not.be.enabled').invoke('text').should('contain', 'Attack Tree Details');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDeleteTree).should('be.enabled').invoke('text').should('contain', 'Delete Tree');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).should('be.enabled').invoke('text').should('contain', 'Load Tree');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownSaveTree).should('not.be.enabled').invoke('text').should('contain', 'Save Tree As');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkAttackPath).should('not.be.enabled').invoke('text').should('contain', 'Link Attack Path');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkVulnerability).should('not.be.enabled').invoke('text').should('contain', 'Link Vulnerability');
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogSelectTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDetailsButton).should('be.enabled').invoke('text').should('contain', 'Attack Tree Details');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownSaveTree).should('be.enabled').invoke('text').should('contain', 'Save Tree As');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkAttackPath).should('be.enabled').invoke('text').should('contain', 'Link Attack Path');
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLinkVulnerability).should('be.enabled').invoke('text').should('contain', 'Link Vulnerability');
        })
    })

    it('"New Tree" Dialog (MAIN-TC-2005, MAIN-TC-2006, MAIN-TC-2007)', () => {
        let attackTreeName = 'Automation Tree 2';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogNewTreePopup).should('exist');
            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).should('not.be.enabled');
        }).then(() => {
            recurse(() =>
                cy.get(attackTreeSelector.attackTreeDialogNewTreePopupName).clear().type(attackTreeName),
                ($inputField) => $inputField.val() === attackTreeName,
                { delay: 1000 })
                .should('have.value', attackTreeName);
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).should('be.enabled').click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).invoke('text').should('include', attackTreeName);
        })
    })

    it('Zoom Functionalities (MAIN-TC-3231, MAIN-TC-3232, MAIN-TC-3233)', () => {
        let initialZoomValue; 
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click({ force: true });
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
            cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).invoke('text').then((text) => {
                initialZoomValue = parseFloat(text.trim().replace('Zoom ', '').replace('%', '')); // Extract numeric part
            });
            // Click the zoom-in button
            cy.get(attackTreeSelector.attackTreeCanvasZoomInButton).click({ force: true });
        }).then(() => {
            // Get the new zoom value and verify
            cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).invoke('text').then((text) => {
                const newZoomValue = parseFloat(text.trim().replace('Zoom ', '').replace('%', '')); // Extract numeric part
                expect(newZoomValue).to.be.gt(initialZoomValue);
            });
        }).then(() => {//Reset Button
            cy.get(attackTreeSelector.attackTreeCanvasResetZoomButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).should('include.text', '100%');
        }).then(() => {
            //Zoom Out         
            cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).invoke('text').then((text) => {
                initialZoomValue = parseFloat(text.trim().replace('Zoom ', '').replace('%', '')); // Extract numeric part
            });
        }).then(() => {
            // Click the zoom-out button
            cy.get(attackTreeSelector.attackTreeCanvasZoomOutButton).click();
        }).then(() => {
            // Get the new zoom value and verify
            cy.get(attackTreeSelector.attackTreeCanvasZoomDisplay).invoke('text').then((text) => {
                const newZoomValue = parseFloat(text.trim().replace('Zoom ', '').replace('%', '')); // Extract numeric part
                expect(newZoomValue).to.be.lt(initialZoomValue);
            })
        })
    })

    it('"Load & Delete Tree" Dialog (MAIN-TC-2009, MAIN-TC-2010, MAIN-TC-2012, MAIN-TC-2013, MAIN-TC-2014, MAIN-TC-2028)', () => {
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click();   //Attack Tree open
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();   //Tree drop down click
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();    //Load Tree click
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopup).should('exist');           //Load tree popup
            cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).should('exist');      //select project
            cy.get(attackTreeSelector.attackTreeDialogLoadTreePopupCancelButton).click();       //Cancel the pop up
        }).then(() => { 
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();     //Again tree drop down
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDeleteTree).click();     //Click delete tree
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogSelectTree).click();      //select tree
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).click();     //press delete btn
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).click()      //delete button(1st)
        }).then(() => { 
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();      //click tree
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDeleteTree).click();      //select delete
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopup).should('exist');         //delete popup
            cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).should('not.be.enabled');    //delete btn not enable
            cy.get(attackTreeSelector.attackTreeDialogLoadTreeSelectTree).should('exist').click();      //select tree
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).should('be.enabled').click();      //click delete
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogDeleteTreePopupDeleteButton).click();       //again click delete (2nd deleted)
        }).then(() => {
            cy.wait(5000);    //to wait till the delete snack bar message disappears
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();      //again click tree
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDeleteTree).click();
            cy.get(navBarSelector.subsequentSnackBarElement).should('exist').invoke('text').should('include', 'No Trees found. Please, create new Tree');      //working fine
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownLoadTree).click();
            cy.get(navBarSelector.subsequentSnackBarElement).should('exist').invoke('text').should('include', 'No Trees found. Please, create new Tree');
        })
    })

    it('Verify that the user clicks the “Attack Tree Details” header option, the “Edit Tree” dialog displays (MAIN-TC-2008)', () => {
        let attackTreeName = 'Automated Attack Tree';
        let updatedAttackTreeName = 'New Automated Attack Tree';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.attackTreeButton).click();
        }).then(() => {
            cy.wait(1000);
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownNewTree).click();
        }).then(() => {
            recurse(() =>
                cy.get(attackTreeSelector.attackTreeDialogNewTreePopupName).clear().type(attackTreeName),
                ($inputField) => $inputField.val() === attackTreeName,
                { delay: 1000 })
                .should('have.value', attackTreeName);
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogNewTreePopupConfirmButton).click();
        }).then(() => {
            cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Attack Tree Diagram created successfully.');
            cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).should('include.text', attackTreeName);
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeButton).eq(1).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogTreeDropDownDetailsButton).click();
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogEditAttackTreeDetailsPopup).should('include.text', 'Edit Attack Tree Details');
        }).then(() => {
            recurse(() =>
                cy.get(attackTreeSelector.attackTreeDialogUpdateTreeNameInput).clear().type(updatedAttackTreeName),
                ($inputField) => $inputField.val() === updatedAttackTreeName,
                { delay: 1000 })
                .should('have.value', updatedAttackTreeName);
        }).then(() => {
            cy.get(attackTreeSelector.attackTreeDialogEditAttackTreeDetailsConfirmButton).click();
        }).then(() => {
            cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Attack Tree saved successfully.');
            cy.get(attackTreeSelector.attackTreeDialogLoadedTreeButton).should('include.text', updatedAttackTreeName);
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
