import { recurse } from 'cypress-recurse';
import projectLibrarySelector from '../../selectors/projectLibrarySelector.js';
const cybersecurityGoalSelector = require('../../selectors/cybersecurityGoalSelector.js');
const cybersecurityPoolSelector = require('../../selectors/cybersecurityPoolSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
var projectName;

describe('Cybersecurity Goal Pool', () => {
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

    it('Add Goal Button, No Goal message (MAIN-TC-767, MAIN-TC-632, MAIN-TC-379)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            cy.get(cybersecurityGoalSelector.goalNoGoalFoundParagraph).should('exist').then(() => {
                cy.get(cybersecurityGoalSelector.goalNoGoalFoundParagraph).invoke('text').should('contain', 'No cybersecurity goal found');
            });
        }).then(() => {
            cy.get(cybersecurityGoalSelector.goalAddNewGoalButton).click(() => {
                cy.get(cybersecurityGoalSelector.addNewGoalDialogAddFromLibraryButton).click(() => {
                    recurse(
                        () => cy.get(cybersecurityPoolSelector.goalPoolAddGoalSearchInput).clear().type('This Goal Should not exist in library'),
                        ($inputField) => $inputField.val() === controlName,
                        { delay: 1000 }
                    )
                    cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'No goal with such name was found');
                })
            })
        })
    })

    it('Add New Goal Pop Up (MAIN-TC-769, MAIN-TC-375, MAIN-TC-124, MAIN-TC-131)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            cy.get(cybersecurityGoalSelector.goalAddNewGoalButton).click();
        });
        cy.get(cybersecurityGoalSelector.addNewGoalDialog).should('exist').then(() => {
            cy.get(cybersecurityGoalSelector.addNewGoalDialogConfirmButton).should('exist').should('not.be.enabled');
            cy.get(cybersecurityGoalSelector.addNewGoalDialogCancelButton).should('exist');
        }).then(() => {
            cy.get(cybersecurityGoalSelector.addNewGoalDialogAddFromLibraryButton).click().then(() => {
                cy.get(cybersecurityGoalSelector.addNewGoalDialogCreateNewGoal).click().then(() => {
                    cy.get(cybersecurityGoalSelector.addNewGoalDialogContentTextArea).should('be.visible');
                })
            })
        })
    })

    it('Snackbar Message(MAIN-TC-376) ', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            cy.get(cybersecurityGoalSelector.goalAddNewGoalButton).click();
        });
        cy.get(cybersecurityGoalSelector.addNewGoalDialogContentTextArea).type('Project Goal 1').then(() => {
            cy.get(cybersecurityGoalSelector.addNewGoalDialogConfirmButton).click();
        });
        cy.get(cybersecurityGoalSelector.goalSnackBarMessageSuccessfulCreation).invoke('text').should('contain', 'Cybersecurity goal saved successfully!');
    })

    it('Format for the Row Number(MAIN-TC-377, MAIN-TC-311)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            cy.get(cybersecurityGoalSelector.goalAddNewGoalButton).click();
        });
        cy.get(cybersecurityGoalSelector.addNewGoalDialogContentTextArea).type('Project Goal 2').then(() => {
            cy.get(cybersecurityGoalSelector.addNewGoalDialogConfirmButton).click();
        });
        cy.get(cybersecurityGoalSelector.goalSerialNumber).should('have.length', 2).then(() => {
            cy.get(cybersecurityGoalSelector.goalSerialNumber).eq(0).invoke('text').then((lastThreat) => {
                cy.get(cybersecurityGoalSelector.goalSerialNumber).eq(1).invoke('text').then((firstThreat) => {
                    // Convert the text values to numbers for comparison
                    const lastThreatValue = parseInt(lastThreat.replace(/\D/g, ''), 10); // Assuming the value is something like 'GL1'
                    const firstThreatValue = parseInt(firstThreat.replace(/\D/g, ''), 10); // Assuming the value is something like 'GL2'
                    // Make the assertion
                    expect(lastThreatValue).to.be.greaterThan(firstThreatValue);
                });
            });
        });
    })

    it('Deleting the Goal will not effect Row Numbers(MAIN-TC-378)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            cy.get(cybersecurityGoalSelector.goalAddNewGoalButton).click();
        });
        cy.get(cybersecurityGoalSelector.addNewGoalDialogContentTextArea).type('Project Goal 3').then(() => {
            cy.get(cybersecurityGoalSelector.addNewGoalDialogConfirmButton).click();
        });
        cy.get(cybersecurityGoalSelector.goalSerialNumber).should('have.length', 2).then(() => {
            cy.get(cybersecurityGoalSelector.goalDropDownButton).eq(1).click(); //Deleting the 2nd Goal
            cy.get(cybersecurityGoalSelector.goalDropDownDeleteOption).click();
            cy.get(cybersecurityGoalSelector.goalDeleteConfirmButton).click();
            // Make sure the UI updates and the first goal becomes GL3 and the second goal becomes GL1
            cy.get(cybersecurityGoalSelector.goalSerialNumber).eq(0).invoke('text').should('include', 'GL3');
            cy.get(cybersecurityGoalSelector.goalSerialNumber).eq(1).invoke('text').should('include', 'GL1');
        });
    })

    it('Verify the Cybersecurity goal dialogue box displays the correct goal description and could be added to library(MAIN-TC-28, MAIN-TC-121, MAIN-TC-250)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            let goalName = 'Content Before Update';
            cy.addGoal(goalName).then(() => {
                goalName = 'GL-TC-121_' + projectName;
                cy.updateGoal({ row: 0, newGoalContent: goalName }).then(() => {
                    cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalName);
                })
            }).then(() => {
                cy.addGoalToLibrary(goalName).then(() => {
                    let goalAdded = false;
                    cy.visit(Cypress.env('baseURL') + '/library').then(() => {
                        cy.get(projectLibrarySelector.librarySideNavGoalClaimAnchor).click({ force: true }).then(() => {
                            cy.get(projectLibrarySelector.cybersecurityGoalTab).click();
                            cy.get(cybersecurityPoolSelector.poolRecordContentTextArea).each((goal) => {
                                if (goal.val() === goalName) {
                                    goalAdded = true;
                                    return false;
                                }
                            });
                        })
                    }).then(() => {
                        expect(goalAdded).to.be.true;
                    })
                })
            }).then(() => {
                cy.deleteGoalFromLibrary(goalName);
            })
        });
    })

    it('Duplicate goals not allowed in project (MAIN-TC-203)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            let uniqueGoalContent = 'This content should not be duplicated'
            let goalCount;
            cy.addGoal(uniqueGoalContent).then(() => {
                cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', uniqueGoalContent).then(($goalList) => {
                    goalCount = $goalList.length;
                    cy.get(cybersecurityPoolSelector.goalPoolAddNewGoalButton).click().then(() => {
                        recurse(
                            () => cy.get(cybersecurityPoolSelector.addNewDialogContentTextArea).clear().type(uniqueGoalContent),
                            ($inputField) => $inputField.val() === uniqueGoalContent,
                            { delay: 1000 }
                        )
                        cy.get(navBarSelector.confirmDialogueConfirmButton).click().then(() => {
                            cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Duplicating goals is not allowed');
                            cy.get(cybersecurityPoolSelector.updateDialogCancelButton).click().then(() => {
                                cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('have.length', goalCount);
                            })
                        })
                    })
                })
            })
        });
    })

    it('"Search in library" switching (MAIN-TC-133, MAIN-TC-219, MAIN-TC-380)', () => {
        let goalName = 'GL-TC-133_' + projectName;
        cy.createGoalInLibrary(goalName).then(() => {
            cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalName)
        }).then(() => {
            recurse(
                () => cy.get(projectLibrarySelector.searchForGoalInput).clear({ force: true }).type(goalName),
                ($inputField) => $inputField.val() === goalName,
                { delay: 1000 }
            )
        }).then(() => {
            cy.get(navBarSelector.circleProgressSpinner).should('exist').then(() => {
                cy.get(navBarSelector.circleProgressSpinner).should('not.exist')
            }).then(() => {
                cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalName).then(($goalList) => {
                    expect($goalList.length).to.eq(1);
                })
            })
        }).then(() => {
            cy.deleteGoalFromLibrary(goalName);
        })
    })

    it('Same goal cant be added from library (MAIN-TC-204)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            let goalName = 'GL-TC-204_' + projectName;
            let goalCount;
            cy.createGoalInLibrary(goalName).then(() => {
                cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalName);
                cy.ImportGoalFromLibrary(goalName);
            }).then(() => {
                cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalName).then(($goalList) => {
                    goalCount = $goalList.length;
                    cy.get(cybersecurityPoolSelector.goalPoolAddNewGoalButton).click().then(() => {
                        cy.get(cybersecurityPoolSelector.cybersecurityPoolAddFromLibraryParagraph).click();
                        recurse(
                            () => cy.get(cybersecurityPoolSelector.goalPoolAddGoalSearchInput).clear().type(goalName),
                            ($inputField) => $inputField.val() === goalName,
                            { delay: 1000 }
                        ).then(() => {
                            cy.get(cybersecurityPoolSelector.cybersecurityPoolListOption).should('include.text', goalName).click();
                            cy.get(navBarSelector.confirmDialogueConfirmButton).click().then(() => {
                                cy.get(navBarSelector.subsequentSnackBarElement).should('include.text', 'Duplicating goals is not allowed');
                                cy.get(cybersecurityPoolSelector.updateDialogCancelButton).click().then(() => {
                                    cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('have.length', goalCount);
                                })
                            })
                        })
                    })
                })
            }).then(() => {
                cy.deleteGoalFromLibrary(goalName);
            })
        });
    })

    it('Verify that the newly added goals are shown first in the list and could be deleted (MAIN-TC-743, MAIN-TC-744)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            let goalOnTop = 'This goal should be on top';
            let helperGoal = 'This goal should not be on top';
            cy.addGoal(helperGoal).then(() => {
                cy.addGoal(goalOnTop).then(() => {
                    cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).first().should('include.value', goalOnTop);
                })
            }).then(() => {
                cy.deleteGoal(goalOnTop).then(() => {
                    cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).first().should('not.include.value', goalOnTop);
                })
            })
        });
    })

    it('Verify the Edit functionality for goal and claim tab (MAIN-TC-1187)', () => {
        cy.visit(Cypress.env('baseURL') + '/cybersecurity-goal').then(() => {
            let goalName = 'This name should be updated';
            cy.addGoal(goalName).then(() => {
                cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).first().should('include.value', goalName);
            }).then(() => {
                goalName = 'This name should appear';
                cy.updateGoal({ row: 0, newGoalContent: goalName }).then(() => {
                    cy.get(navBarSelector.loader).should('not.exist');
                    cy.get(cybersecurityPoolSelector.goalPoolGoalContentTextArea).should('include.value', goalName);
                })
            })
        });
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