module.exports = {
    //side nav bar
    systemConfigSideNavAttackTreeAnchor: 'mat-nav-list > a:contains(Attack Tree)',
    systemConfigSideNavCustomFieldAnchor: 'mat-nav-list > a:contains(Custom Fields)',
    systemConfigSideNavVulnerabilitySlaAnchor: 'mat-nav-list > a:contains(Vulnerability SLA)',
    systemConfigSideNavRiskDeterminationAnchor: 'mat-nav-list > a:contains(Risk Determination)',
    systemConfigSideNavFeasibilityAndImpactExpandAnchor: 'mat-panel-title:contains(Feasibility and Impact)',
    systemConfigSideNavImpactRatingAnchor: 'a:contains(Impact Rating)',

    //Impact Rating Tab
    impactRatingAddOrEditImpactButton: '[data-cy="AddOrEditImpactButton"]',
    addNewImpactDialogLevelNameInput: '[data-cy="ImpactLevelNameInputField"]',
    addNewImpactDialogDamageScenarioTextarea: '[data-cy="ImpactDamageScenarioForEveryCategoryInputField"]',
    impactRatingSafetyTitleHeader: '.system-page-impact-category-title:contains(Safety)',
    impactRatingFinancialTitleHeader: '.system-page-impact-category-title:contains(Financial)',
    impactRatingPrivacyTitleHeader: '.system-page-impact-category-title:contains(Privacy)',
    impactRatingOperationalTitleHeader: '.system-page-impact-category-title:contains(Operational)',
    impactRatingDamageScenarioTableRow: 'tr.impact-rating-table-body-list',

    //Custom fields Tab
    customFieldPageText: 'h1:contains(Custom Fields)',
    createCustomFieldButton: 'button:contains(Create custom field)',
    addCustomFieldTextDialog: 'h1:contains(Add Custom Field)',
    addCustomNameField: 'input[ng-reflect-name="name"]',
    addCustomCategoryField: 'mat-select[formcontrolname="category"]',
    addCustomTypeField: 'mat-select[formcontrolname="type"]',
    customFieldDialogCancelButton: 'button:contains(Cancel)',
    customFieldDialogConfirmButton: 'button:contains(Confirm)',
    customFieldNameContentArea: 'td[class*="mat-column-name"]',

    //global system Config
    globalDropDownListOption: 'mat-option',
    confirmToDeleteButton: 'button:contains(Delete)',
    confirmToDeleteTextDialog: 'h1:contains(CONFIRM TO DELETE)',
    systemConfigSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',
    pageContentTable: 'table',
    systemConfigDeleteIcon: 'mat-icon:contains(delete)',
    systemConfigConfirmationHint: 'mat-hint:contains(Type confirm to continue)',
    SystemConfigConfirmationInput: 'input[placeholder="Type confirm"]',
}