const helpViewSelector = require('../../selectors/helpViewSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');
import { recurse } from 'cypress-recurse';
describe('Help Page View', () => {

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.login();
    });

    it('Verify the help page is opening using the help icon (MAIN-TC-271, MAIN-TC-300, MAIN-TC-2973)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            cy.get(navBarSelector.navBarHelpButton).click().then(() => {
                cy.url().should('contain', 'help');
                cy.get(helpViewSelector.helpViewSearchDocumentsInput).should('be.visible');
            });
        });
    });

    it('Verify the help page have different tabs with pictures for each Vultara functions (MAIN-TC-272)', () => {
        cy.visit(Cypress.env('baseURL') + '/help').then(() => {
            const TABS_TO_TEST = 5;
            cy.get(helpViewSelector.helpViewExpandableFeatureContent).should('have.length.at.least', TABS_TO_TEST);
            for (let currentTab = 0; currentTab < TABS_TO_TEST; currentTab++) {
                cy.get(helpViewSelector.helpViewReadMoreButton).eq(currentTab).click().then(() => {
                    cy.get(helpViewSelector.helpViewImageElement).should('be.visible');
                }).then(() => {
                    cy.get(helpViewSelector.helpViewBackButton).click();
                });
            }
        });
    });

    it('Verify that Search Results in the Help page are relevant to the search query (MAIN-TC-2976, MAIN-TC-2977, MAIN-TC-2978)', () => {
        cy.visit(Cypress.env('baseURL') + '/help').then(() => {
            let searchKey = 'Wp29';
            let featuresCount;
            cy.get(helpViewSelector.helpViewFeatureTitleHeader).its('length').then((titleLength) => {
                featuresCount = titleLength;
            }).then(() => {
                recurse(
                    () => cy.get(helpViewSelector.helpViewSearchDocumentsInput).clear().type(searchKey),
                    ($inputField) => $inputField.val() === searchKey,
                    { delay: 1000 }
                );
            }).then(() => {
                cy.get(helpViewSelector.helpViewFeatureTitleHeader).contains(searchKey, { matchCase: false }).should('be.visible');
            }).then(() => {
                searchKey = '/';
                recurse(
                    () => cy.get(helpViewSelector.helpViewSearchDocumentsInput).clear().type(searchKey),
                    ($inputField) => $inputField.val() === searchKey,
                    { delay: 1000 }
                );
            }).then(() => {
                cy.get(helpViewSelector.helpViewFeatureParagraph).should('include.text', searchKey);
            }).then(() => {
                recurse(
                    () => cy.get(helpViewSelector.helpViewSearchDocumentsInput).clear(),
                    ($inputField) => $inputField.val() === '',
                    { delay: 1000 }
                );
            }).then(() => {
                cy.get(helpViewSelector.helpViewFeatureTitleHeader).should('have.length', featuresCount);
            });
        });
    });

    it('Verify the Read More button is showing the brief description of that document (MAIN-TC-351, MAIN-TC-362)', () => {
        cy.visit(Cypress.env('baseURL')).then(() => {
            cy.get(navBarSelector.navBarHelpButton).click();
        }).then(() => {
            cy.url().should('contain', 'help');
        }).then(() => {
            let indexOfRecord = 0;
            cy.get(helpViewSelector.helpViewFeatureTitleHeader).each(($element) => {
                if ($element.text() === 'Abort WP29 Threat Mapping') {
                    cy.get(helpViewSelector.helpViewReadMoreButton).eq(indexOfRecord).click();
                    return false;// to exist from the .each() loop
                }
            indexOfRecord++;
            }).then(() => {
                cy.get(helpViewSelector.helpViewDetailsTitleHeader).should('include.text', 'Abort WP29 Threat Mapping');
            })
        })
    })

    it('Verify each row shall have a title and an icon/thumbnail (MAIN-TC-326, MAIN-TC-333)', () => {
        cy.visit(Cypress.env('baseURL') + '/help').then(() => {
            cy.get(helpViewSelector.helpViewFeatureTitleHeader).each(($headerTitle) => {
                cy.wrap($headerTitle).should('exist');
            })
            cy.get(helpViewSelector.helpViewHeaderIcon).each(($headerIcon) => {
                cy.wrap($headerIcon).should('exist');
            })
            cy.get(helpViewSelector.helpViewReadMoreButton).each(($readMoreButton) => {
                cy.wrap($readMoreButton).should('exist');
            })
        })
    })
})