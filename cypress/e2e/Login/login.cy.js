const loginSelector = require('../../selectors/loginSelector.js');
const navBarSelector = require('../../selectors/navBarSelector.js');

describe('Login Test', () => {

  beforeEach(() => {              //This chunk will learn before every test
    cy.viewport(1920, 1080);
    // Visit the login page before each test
    cy.visit(Cypress.env('baseURL')) // Login 
  })

  it('Verify that Login Button is enabled after entering username and password(MAIN-TC-2054, MAIN-TC-2289, MAIN-TC-2274)', () => {
    cy.get(loginSelector.loginUsernameInput).click();
    cy.get(loginSelector.loginPasswordInput).click();
    cy.get(loginSelector.loginIconButton).should('not.be.enabled'); //Assertion that login button is not enabled with empty username and password
    cy.get(loginSelector.loginUsernameInput).type(Cypress.env('username')); // Replace with your username
    cy.get(loginSelector.loginPasswordInput).type(Cypress.env('password')); //Replace with password
    cy.get(loginSelector.loginIconButton).should('not.be.disabled');
  });

  it('Log in with Correct Credentials (MAIN-TC-2056, MAIN-TC-2053, MAIN-TC-2725)', () => {
    cy.get(loginSelector.loginUsernameInput).type(Cypress.env('username')); // Replace with your username
    cy.get(loginSelector.loginPasswordInput).type(Cypress.env('password')); //Replace with password
    cy.get(loginSelector.loginLabelButton).click(); //clicking the login button
    cy.wait(1000);
    // Assert that the user is redirected to the navigation page
    cy.url().should('include', '/dashboard'); //Successful login will lands on http://localhost:4200/navigation
  });

  it('Verifying the Loader while loging In (MAIN-TC-1421)', () => {
    cy.get(loginSelector.loginUsernameInput).type(Cypress.env('username')); // Replace with your username
    cy.get(loginSelector.loginPasswordInput).type(Cypress.env('password')); //Replace with password
    cy.get(loginSelector.loginLabelButton).click();
    // Assert that the user is redirected to the dashboard or a logged-in state
    cy.get(loginSelector.loginLoader).should('exist'); //assertion to check if the loader is being shown
  });

  it('Error message is not thrown before Hiting Login Button (MAIN-TC-409, MAIN-TC-2729)', () => {
    cy.wait(3000);
    cy.get(loginSelector.loginUsernameInput).type('wrong_username'); // Replace with your incorrect username
    cy.get(loginSelector.loginPasswordInput).type("wrongpassword");
    cy.get(loginSelector.loginFormErrorMessage).contains('Invalid username or password.').should('not.exist');
    cy.get(loginSelector.loginLabelButton).click();
    cy.wait(100);
    // Assert that the Error message is displayed
    cy.get(loginSelector.loginFormErrorMessage).should('contain', 'Invalid username or password.').should('exist');
    //cy.get(loginSelectors.loginFormErrorMessage).should("exist");//Assertion to check Error Message is shown

  });

  it('Verify that user logs out if token expires (MAIN-TC-1567)', () => {
    cy.get(loginSelector.loginUsernameInput).type(Cypress.env('username')); // Replace with your username
    cy.get(loginSelector.loginPasswordInput).type(Cypress.env('password'));   //Replace with password
    cy.get(loginSelector.loginLabelButton).click(); //clicking the login button
    cy.wait(1000);
    // Assert that the user is redirected to the navigation page
    cy.url().should('include', '/dashboard'); //Successful login
    cy.wait(1000);
    cy.clearCookies();
    cy.wait(500);
    cy.reload();
    cy.wait(2000);
    cy.url().should('eq', Cypress.env('baseURL') + '/login');
  });

  it('Should call the Login API after logging In (MAIN-TC-408)', () => {
    cy.intercept('POST', Cypress.env('authURL') + '/login*').as('login');
    cy.visit(Cypress.env('baseURL'));
    cy.get(loginSelector.loginUsernameInput).type(Cypress.env('username'));
    cy.get(loginSelector.loginPasswordInput).type(Cypress.env('password'));
    cy.get(loginSelector.loginLabelButton).click();
    cy.wait('@login');
    cy.get('@login').its('response.statusCode').should('eq', 200);
  });

  it('Access token in Cookies, after successful Login (MAIN-TC-2274)', () => {
    cy.visit(Cypress.env('baseURL'));
    cy.get(loginSelector.loginUsernameInput).type(Cypress.env('username')); // Replace with your username
    cy.get(loginSelector.loginPasswordInput).type(Cypress.env('password')); // Replace with password
    cy.get(loginSelector.loginLabelButton).click();
    cy.wait(1500);
    cy.getCookie('accessToken').should('exist');
  });

  it('Disable Modeling and Threat List Buttons when No project is loaded (MAIN-TC-249)', () => {
    cy.get(loginSelector.loginUsernameInput).type(Cypress.env('username')); // Replace with your username
    cy.get(loginSelector.loginPasswordInput).type(Cypress.env('password')); //Replace with password
    cy.get(loginSelector.loginLabelButton).click(); //clicking the login button
    cy.wait(1000);
    cy.visit(Cypress.env('baseURL'));
    cy.wait(200);
    cy.get(navBarSelector.navBarViewButton).click().then(() => {
      cy.get(navBarSelector.viewListModelingButton).should('not.be.enabled');
    })
    cy.get(navBarSelector.navBarThreatListViewButton).should('not.be.enabled');
  })

  it('Should not call the APIs before Login (MAIN-TC-387, MAIN-TC-386, MAIN-TC-385)', () => {
    cy.intercept('GET', Cypress.env('apiURL') + '*').as('API');
    cy.get('@API').should('not.exist');
    cy.intercept('GET', Cypress.env('apiURL') + '/projects/wp29Threats*').as('wp29API');
    cy.get('@wp29API').should('not.exist');
    cy.intercept('GET', Cypress.env('apiURL') + '/config/systemconfig*').as('SystemAPI');
    cy.get('@SystemAPI').should('not.exist');
    cy.visit(Cypress.env('baseURL'));
    cy.get(loginSelector.loginUsernameInput).type(Cypress.env('username'));
    cy.get(loginSelector.loginPasswordInput).type(Cypress.env('password'));
    cy.get(loginSelector.loginLabelButton).click();
    cy.wait(500);
    cy.url().should('include', '/dashboard')
  });

  it('Labels and Controls on Login Screen(MAIN-TC-2722)', () => {
    cy.get(loginSelector.loginUsernameInput).should('exist');
    cy.get(loginSelector.loginPasswordInput).should('exist');
    cy.get(loginSelector.loginLabelButton).should('exist');
    cy.get(loginSelector.loginIconButton).should('exist');
    cy.get(loginSelector.loginWelcomeBackTitle).should('exist');
    cy.get(loginSelector.loginWelcomeBackSubtitle).should('exist');
    cy.get(loginSelector.loginLoginMessage).should('exist');
    cy.get(loginSelector.loginSSOLogin).should('exist');
    cy.get(loginSelector.loginImage).should('exist');
  })

  it('should mask the password when typing(MAIN-TC-2727)', () => {
    // Type a password in the input field
    const passwordToType = 'testpassword';
    cy.get(loginSelector.loginPasswordInput)
      .type(passwordToType)
      .should('have.value', passwordToType);

    // Check if the password input type is 'password'
    cy.get(loginSelector.loginPasswordInput)
      .invoke('attr', 'type')
      .should('equal', 'password');
  });

});

