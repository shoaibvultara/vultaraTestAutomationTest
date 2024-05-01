// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.

import '@4tw/cypress-drag-drop';
import "cypress-real-events/support";
import "cypress-localstorage-commands";
import 'cypress-log-to-output';
import { recurse } from 'cypress-recurse';

const navBarSelector = require('../selectors/navBarSelector.js');
const modelingViewSelector = require('../selectors/modelingViewSelector.js');
// command.js

Cypress.Commands.add('login', () => {
  cy.visit(Cypress.env('baseURL')) // Login
  cy.request({
    url: `${Cypress.env('authURL')}/login`,
    method: "POST",
    body: {
      username: Cypress.env('username'),
      password: Cypress.env('password'),
    }
  }).then((response) => {
    expect(response.status).to.equal(200);
  })
});

Cypress.Commands.add('createProject', (projectKey) => {
  cy.visit(Cypress.env("baseURL"))
    // Wait for the URL to match the baseURL
    .then(() => {
      cy.get(navBarSelector.navBarProjectButton).should('exist').then(() => {
        recurse(
          // the commands to repeat, and they yield the input element
          () => cy.wrap(Cypress.$(navBarSelector.loader).length),
          // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
          ($loaderExist) => $loaderExist == false,//length === 0
          { delay: 1000 }
        ).then(() => {
          cy.get(navBarSelector.navBarProjectButton).click();
        })
      })
    }).then(() => {
      cy.get(navBarSelector.projectListNewProjectButton).click({ force: true }).then(() => { //New project
        recurse(
          // the commands to repeat, and they yield the input element
          () => cy.get(navBarSelector.newProjectFormProjectNameInput).clear().type(projectKey),
          // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
          ($inputField) => $inputField.val() === projectKey,
          { delay: 1000 }
        );
        let projectDescription = 'This Project will be deleted from DB after Creation';
        recurse(
          // the commands to repeat, and they yield the input element
          () => cy.get(navBarSelector.newProjectFormProjectNotesInput).clear().type(projectDescription),
          // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
          ($inputField) => $inputField.val() === projectDescription,
          { delay: 1000 }
        );
      });
      cy.intercept('POST', Cypress.env('apiURL') + '/projects/*').as('postRequest');
      // button label is "Confirm"
      cy.get(navBarSelector.newProjectFormConfirmButton).click().then(() => {
        cy.get('@postRequest').its('response.statusCode').should('eq', 200);
      });
    })
});

Cypress.Commands.add('deleteProject', (projectKey) => {
  cy.clearLocalStorage();
  if (projectKey) {// Delete project
    cy.visit(Cypress.env("baseURL")).then(() => {
      recurse(//wait until the loader spinner disappear
        () => cy.wrap(Cypress.$(navBarSelector.loader).length),
        ($loaderExist) => $loaderExist == false,//length === 0
        { delay: 2000 }
      ).then(() => {
        cy.get(navBarSelector.navBarProjectButton).click({ force: true });
      }).then(() => {
        cy.get(navBarSelector.projectListDeleteProjectButton).click({ force: true }).then(() => {
          let projectElement = navBarSelector.deleteProjectDialogWindow + ':contains(' + projectKey + ')';
          if (cy.wrap(Cypress.$(projectElement).length)) {//project exists i.e != 0
            cy.get(navBarSelector.deleteProjectDialogWindow).contains(projectKey).click();
            cy.get(navBarSelector.deleteProjectDialogWindowContinueButton).click().then(() => {
              cy.intercept('DELETE', '*').as('deleteRequest');
              cy.get(navBarSelector.confirmDialogueDeleteButton).last().click();
              cy.wait(5000);
              cy.get('@deleteRequest').its('response.statusCode').should('eq', 200);
            });
          }
        })
      })
    });
  }
});

Cypress.Commands.add('loadProject', (projectKey) => {
  cy.visit(Cypress.env('baseURL'));
  // Use cy.getCookie() to retrieve the cookie value.
  cy.getCookie('accessToken').then((cookie) => {
    if (cookie) {
      const cookieValue = cookie.value;
      // Make the API request with the cookie value.
      cy.request({
        url: `${Cypress.env('apiURL')}/projects/projectDb?id=${projectKey}&projectId=${projectKey}`,
        method: 'GET',
        body: {
          projectId: projectKey,
          projectInfo: 'true',
        },
        headers: {
          Authorization: `Bearer ${cookieValue}`, // Use the cookie value as the bearer token.
          // Add any other headers as needed.
        },
      }).then((response) => {
        // Handle the API response as needed.
        expect(response.status).to.equal(200); // Replace with the expected status code.
        // Save the API response in local storage.
        cy.window().then((win) => {
          win.localStorage.setItem('newDesign', JSON.stringify(response.body));
        });
      });
    } else {
      // Handle the case where the cookie is not found if required.
    }
  });
})

Cypress.Commands.add('createMilestone', (milestoneKey) => {
  cy.visit(Cypress.env("baseURL")).then(() => {
    recurse(
      // the commands to repeat, and they yield the input element
      () => cy.get(navBarSelector.navBarProjectButton).should('be.visible'),
      // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
      ($projectButton) => cy.wait(10),
      { delay: 1000 }
    ).then(() => {
      cy.get(navBarSelector.navBarProjectButton).click();
    }).then(() => {
      cy.get(navBarSelector.projectListNewMilestoneButton).click(); // new milestone
      cy.get(navBarSelector.newMilestoneTitleHeader).should('exist');
      cy.get(navBarSelector.confirmDialogueConfirmButton).last().should('not.be.enabled');
      recurse(
        // the commands to repeat, and they yield the input element
        () => cy.get(navBarSelector.newMilestoneNameInput).clear().type(milestoneKey),
        // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
        ($inputField) => $inputField.val() === milestoneKey,
        { delay: 1000 }
      ).should('have.value', milestoneKey).then(() => {// confirm that the milestoneKey was entered correctly
        cy.get(navBarSelector.confirmDialogueConfirmButton)
          .last()
          .should('not.be.disabled') // Ensure the button is not disabled
          .last()
          .click();
      });
    })
  })
});

Cypress.Commands.add('loadMilestone', (milestoneKey) => {
  cy.visit(Cypress.env("baseURL")).then(() => {
    recurse(
      // the commands to repeat, and they yield the input element
      () => cy.get(navBarSelector.navBarProjectButton).should('be.visible'),
      // the predicate takes the output of the above commands and returns a boolean. If it returns true, the recursion stops
      ($projectButton) => cy.wait(10),
      { delay: 1000 }
    ).then(() => {
      cy.get(navBarSelector.navBarProjectButton).click({ force: true });
    }).then(() => {
      cy.get(navBarSelector.projectListLoadMilestoneButton).click(); // load a milestone
      cy.get(navBarSelector.loadMilestoneTitleHeader).should('exist');
      cy.get(navBarSelector.loadMilestoneSelectionList).contains(milestoneKey).click({ force: true }).then(() => {
        cy.get(navBarSelector.confirmDialogueConfirmButton).click();
      });
      cy.url().should('contain', '/modeling');
      cy.get(modelingViewSelector.modelingViewMilestoneNameDiv).should('include.text', 'Milestone:')
    })
  })
})

function generateRandomString(length) {
  let randomString = '';
  const alphanumerical = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let index = 0; index < length; index++) {
    randomString += alphanumerical.charAt(Math.floor(Math.random() * alphanumerical.length));
  }
  return randomString;
}
function generateRandomName() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString();
  const sanitizedDate = formattedDate.replace(/[\s:/]/g, '_');
  let project = `Automation_Project: ${sanitizedDate}>` + generateRandomString(5);
  return cy.wrap(project);
}
Cypress.Commands.add('generateProjectName', generateRandomName);

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  cy.url().then(currentUrl => {
    if (currentUrl !== url) {
      return originalFn(url, options);
    }
  });
});