module.exports = {
    impactPopup: '.edit-damage-scenario-dialog-header',
    impactPopupTitle: '.global-dialog-title-style',
    impactPopupRatingAndLevelParagraph: 'p.ng-star-inserted',//use .eq(1)
    impactPopupConfirmButton: '.mdc-button__label:contains("Confirm")',
    impactPopupCancelButton: 'button:contains("Cancel")',
    impactPopupCloseButton: 'mat-icon:contains(close)',

    impactPopupCategoryDropDown: '.risk-impact-treatment-container',//use .eq(0-3) for safety, financial, operational & privacy respectively
    impactPopupCategoryDropdownNegligibleOption: "span.mdc-list-item__primary-text:contains('Negligible')",
    impactPopupCategoryDropdownModerateOption: "span.mdc-list-item__primary-text:contains('Moderate')",
    impactPopupCategoryDropDownColor: '.editDamageImpactIcon',

    impactPopupDamageScenarioDropDown: 'mat-label:contains(Replace from Damage Scenario Pool)',
    impactPopupDamageScenarioDropDownOptionOne: 'span.mdc-list-item__primary-text:contains("New Pool Damage Scenario")',
    impactPopupDamageScenarioDropDownOptionTwo: 'span.mdc-list-item__primary-text:contains("No Pool Damage Scenario")',

    impactPopupDamageScenarioTextArea: 'textarea[class*="damage-scenario-text-area"]',
    impactPopupAutoDSCheckBox: '.editDamageCheckBox > p > mat-checkbox > div > div > input[type="checkbox"]',

    impactPopupBeforeParagraph: 'div.ng-star-inserted > p:contains(Before Treatment)',
    impactPopupAfterParagraph: 'div.ng-star-inserted > p:contains(After Treatment)',
    impactPopupBeforeAfterCategoryForm: '.editImpactContainer',
    impactPopupCategoryHeading: 'div.impact-category-heading',
    impactPopupDamageScenarioHeading: 'span.replaceDamageScenarioHeading',
    impactAfterTreatmentText: '.impactUnderLineActive',
    impactPopupSwitchButton: 'button[role="switch"]',
}