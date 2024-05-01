import { recurse } from 'cypress-recurse';
const cybersecurityGoalSelector = require('../../selectors/cybersecurityGoalSelector.js');
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
const threatListViewSelector = require('../../selectors/threatListViewSelector.js');
var projectName;

describe('Cybersecurity Pools In Threat List View', () => {
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

    it('Verify the adding a new goal from threat list view (MAIN-TC-190, , MAIN-TC-633)', () => {
        let threatRow = 1;
        let goalDescription = 'Adding New Goal From ThreatListView';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon).should('have.length', 2).first().scrollIntoView().click();//1st add goal, 2nd add control
            }).then(() => {
                recurse(
                    () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                    ($inputField) => $inputField.val() === goalDescription,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL 1').should('be.visible');
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            })
        })
    })

    it('Verify the updated goal is reflecting in all its threats (MAIN-TC-29)', () => {
        let threatRow = 1;
        let goalDescription = 'this description should be updated';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.get(threatListViewSelector.threatListViewExpandThreatIcon).should('be.visible').then(() => {
                cy.get('body').then($pageContent => {
                    if ($pageContent.find(threatListViewSelector.threatListViewExpandedThreatDiv).length == 0) {//check if the threat is not expanded
                        cy.expandThreat(threatRow);
                    }
                })
            })
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                    .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
            }).then(() => {
                recurse(
                    () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                    ($inputField) => $inputField.val() === goalDescription,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible');
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            })
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
                cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalDescription).then(() => {
                    goalDescription = 'this description should remain';
                    cy.updateGoal({ row: 0, newGoalContent: goalDescription }).then(() => {
                        cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalDescription);
                    })
                })
            })
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible');
                cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
            })
        })
    })

    it('Verify goals can be reused in the same project (MAIN-TC-122, MAIN-TC-372, MAIN-TC-374)', () => {
        let threatRow = 1;
        let goalDescription = 'this goal will be added to two threats';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.saveAsNewThreat(threatRow);
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandThreatIcon).should('be.visible').then(() => {
                cy.get('body').then($pageContent => {
                    if ($pageContent.find(threatListViewSelector.threatListViewExpandedThreatDiv).length == 0) {//check if the threat is not expanded
                        cy.expandThreat(threatRow);
                    }
                })
            })
        }).then(() => {//add goal to first threat
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                ($inputField) => $inputField.val() === goalDescription,
                { delay: 1000 }
            ).then(() => {
                cy.get(navBarSelector.confirmDialogueConfirmButton).click();
            }).then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible');
                cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
            })
        }).then(() => {//add the goal to the second threat
            cy.foldThreat(threatRow);
            cy.wait(2000).then(() => {
                threatRow = 2;
                cy.expandThreat(threatRow).then(() => {
                    cy.changeThreatTreatment(threatRow, 'reduce');
                    cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                        .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
                    cy.get(threatListViewSelector.threatListViewAddNewGoalFromPool).click().then(() => {
                        cy.get(navBarSelector.dropDownOption).contains(goalDescription).click();
                    }).then(() => {
                        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                    }).then(() => {
                        cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible');
                        cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                    })
                }).then(() => {
                    cy.foldThreat(threatRow);
                    cy.wait(1000);
                })
            })
        })
    })

    it('Remove functionality of Goal from Threat (MAIN-TC-125, MAIN-TC-127)', () => {
        let threatRow = 1;
        let goalDescription = 'MAIN-TC-125';
        let goalNum;
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                    .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
            }).then(() => {
                recurse(
                    () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                    ($inputField) => $inputField.val() === goalDescription,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('GL').should('be.visible').then((recordId) => {
                        goalNum = recordId.text();
                    });
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            })
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).click().then(() => {
                cy.get(threatListViewSelector.poolDialogRemoveButton).click()
            }).then(() => {
                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Cybersecurity goal removed successfully!')
            })
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon).should('have.length', 2).first().click({ force: true }).then(() => {//1st add goal, 2nd add control
                cy.get(threatListViewSelector.threatListViewAddNewGoalFromPool).click().then(() => {
                    cy.get(navBarSelector.dropDownOption).contains(goalDescription).click();
                }).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains(goalNum).should('be.visible');
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            })
        }).then(() => {
            cy.foldThreat(threatRow);
            cy.wait(1000);
        })
    })

    it('Verify the deleted goal is not visible in threat view (MAIN-TC-129)', () => {
        let threatRow = 1;
        let goalDescription = 'MAIN-TC-129';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'reduce').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                    .should('have.length', 2).first().click({ force: true });//1st add goal, 2nd add control
            }).then(() => {
                recurse(
                    () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(goalDescription),
                    ($inputField) => $inputField.val() === goalDescription,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('be.visible');
                })
            }).then(() => {
                cy.deleteGoal(goalDescription);
            }).then(() => {
                cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(goalDescription).should('not.exist');
                })
            })
        }).then(() => {
            cy.foldThreat(threatRow);
            cy.wait(1000);
        })
    })

    it('Verify adding a new claim from threat list view (MAIN-TC-338)', () => {
        let threatRow = 2;
        let claimDescription = 'Adding New Claim From ThreatListView';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.changeThreatTreatment(threatRow, 'retain').then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                    .should('have.length', 1).click({ force: true });
            }).then(() => {
                recurse(
                    () => cy.get(threatListViewSelector.threatListViewAddClaimDialogDescription).clear().type(claimDescription),
                    ($inputField) => $inputField.val() === claimDescription,
                    { delay: 1000 }
                ).then(() => {
                    cy.get(navBarSelector.confirmDialogueConfirmButton).click();
                }).then(() => {
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('CLM').should('be.visible');
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimDescription).should('be.visible');
                }).then(() => {
                    cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal');
                }).then(() => {
                    cy.get(cybersecurityPoolSelector.goalPoolClaimPoolTabDiv).click();
                    cy.wait(2000);
                }).then(() => {
                    cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).should('include.value', claimDescription);
                }).then(() => {
                    cy.foldThreat(threatRow);
                    cy.wait(1000);
                })
            })
        })
    })

    it('Verify the updated claim is reflecting in all its threats (MAIN-TC-332, MAIN-TC-329)', () => {
        let threatRow = 2;
        let claimName = 'CLM_TC_332>' + projectName.substring(20);
        let updatedClaimName = 'updated threat CLM>' + projectName.substring(20);
        cy.addClaim(claimName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
                cy.expandThreat(threatRow);
            }).then(() => {
                //cy.changeThreatTreatment(threatRow, 'retain');
            //}).then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                    .should('have.length', 1).click({ force: true });
            }).then(() => {
                cy.wait(1000);
                cy.get(threatListViewSelector.threatListViewAddClaimDialogSelectField).last().click();
                cy.get(threatListViewSelector.globalDropDownList).contains(claimName).click();
            }).then(() => {
                cy.get(navBarSelector.confirmDialogueConfirmButton).click();
            }).then(() => {
                cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('CLM').should('be.visible');
                cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimName).should('be.visible');
            }).then(() => {
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
                }).then(() => {
                    cy.visit(Cypress.env('baseURL') + '/threats');
                }).then(() => {
                    cy.wait(2000);
                    cy.get(threatListViewSelector.threatListViewExpandedRecordId).contains('CLM').should('be.visible');
                    cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(updatedClaimName).should('be.visible');
                }).then(() => {
                    cy.foldThreat(threatRow);
                    cy.wait(1000);
                })
            })
        })
    })

    it('Verify the deleted claim is not visible in the drop-down (MAIN-TC-346)', () => {
        let threatRow = 2;
        let claimDescription = 'MAIN-TC-346';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            //cy.changeThreatTreatment(threatRow, 'retain');
        //}).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 1).click({ force: true });//1st add goal, 2nd add control
        }).then(() => {
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(claimDescription),
                ($inputField) => $inputField.val() === claimDescription,
                { delay: 1000 })
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimDescription).should('be.visible');
        }).then(() => {
            cy.deleteClaim(claimDescription);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
        }).then(() => {
            cy.wait(2000);
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimDescription).should('not.exist');
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 1).click({ force: true });
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAddClaimDialogSelectField).last().click();
            cy.get(threatListViewSelector.globalDropDownList).contains(claimDescription).should('not.exist');
        }).then(() => {
            cy.foldThreat(threatRow);
            cy.wait(1000);
        })
    })

    it('Verify the remove button removes the desired claims only (MAIN-TC-352)', () => {
        let threatRow = 2;
        let claimName = 'CLM_TC_352>' + projectName.substring(20);
        cy.addClaim(claimName).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
        }).then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 1).click({ force: true });
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAddClaimDialogSelectField).last().click();
            cy.get(threatListViewSelector.globalDropDownList).contains(claimName).click();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimName).should('be.visible');
        }).then(() => {
            cy.foldThreat(threatRow);
            cy.wait(2000);
        }).then(() => {
            threatRow = 3;
            cy.expandThreat(threatRow).then(() => {
                cy.changeThreatTreatment(threatRow, 'retain');
            })
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 1).click({ force: true });
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAddClaimDialogSelectField).last().click();
            cy.get(threatListViewSelector.globalDropDownList).contains(claimName).click();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimName).should('be.visible');
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimName).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewRemoveButton).click();
            cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Cybersecurity claim removed successfully!');
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewCybersecurityRecordDialog).contains(claimName).should('not.exist');
        }).then(() => {
            cy.foldThreat(threatRow);
        }).then(() => {
            threatRow = 2;
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewCybersecurityRecordDialog).contains(claimName).should('be.visible');
        }).then(() => {
            cy.foldThreat(threatRow);
        })
    })

    it('Verify claims can be reused in the same project (MAIN-TC-335)', () => {
        let threatRow = 2;
        let claimDescription = 'MAIN-TC-335';
        cy.visit(Cypress.env('baseURL') + '/threats').then(() => {
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 1).click({ force: true });
        }).then(() => {
            recurse(
                () => cy.get(threatListViewSelector.threatListViewAddGoalDialogDescription).clear().type(claimDescription),
                ($inputField) => $inputField.val() === claimDescription,
                { delay: 1000 })
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimDescription).should('be.visible');
        }).then(() => {
            cy.foldThreat(threatRow);
        }).then(() => {
            cy.visit(Cypress.env('baseURL') + '/threats');
        }).then(() => {
            let threatRow = 3;
            cy.wait(2000);
            cy.expandThreat(threatRow);
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedThreatAddIcon)
                .should('have.length', 1).click({ force: true });
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewAddClaimDialogSelectField).last().click();
            cy.get(threatListViewSelector.globalDropDownList).contains(claimDescription).click();
        }).then(() => {
            cy.get(navBarSelector.confirmDialogueConfirmButton).click();
        }).then(() => {
            cy.get(threatListViewSelector.threatListViewExpandedRecordContent).contains(claimDescription).should('be.visible');
        }).then(() => {
            threatRow = 3;
            cy.foldThreat(threatRow);
            cy.wait(1000);
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