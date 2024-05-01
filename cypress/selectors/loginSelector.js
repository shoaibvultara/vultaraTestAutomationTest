module.exports = {

    // LoginPage Selectors
    loginUsernameInput : 'input[name="username"]', // Username TextBar
    loginPasswordInput : "input[type='password']", //Password TextBar
    loginLabelButton : '.mdc-button__label', //Label of Login Button
    loginIconButton : '.mat-mdc-button-touch-target', //Icon of Login Button
    loginFormErrorMessage  : '.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label', //Error Message text

    loginLoader : '.la-3x > :nth-child(1)',
    loginWelcomeBackTitle:'.welcome-message-title',
    loginWelcomeBackSubtitle: '.welcome-message-subtitle',
    loginLoginMessage: 'h2',
    loginSSOLogin:'.ssoLoginBtn',
    loginImage:'.login-image'
}
