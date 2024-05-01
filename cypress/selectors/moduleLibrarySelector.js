module.exports = {
    // Module Library action buttons
    createNewModuleButton : 'button:contains(" Create New Module ")' ,  // Create New Module Button in Module Library page
    moduleNameDialogText : 'h1:contains("Module Name")',  // Module Name Text in the Dialog
    moduleNameDialogCategoryFieldButton : 'mat-select[name="category"]' ,  // Category Field Button in Module Name Dialog
    moduleNameTextAreaField : 'input[name="model"]' ,  // Module Name Textarea Field in Module Name Dialog
    moduleNameErrorMessage : 'mat-error:contains("Enter at-least one character")' ,  // Module Name Error message
    moduleNameConfirmButton : '.mdc-button__label:contains("Confirm")' ,  // Confirm button in Module Name Dialog
    moduleNameDisabledConfirmButton : 'button[ng-reflect-disabled="true"]' ,  // Confirm button in Module Name Dialog in Disabled condition
    moduleNameCancelButton : '.mdc-button__label:contains("Cancel")' ,  // Cancel button in Module Name Dialog
    moduleSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Create New Module Snack Bar
    moduleArrowDropdownButton : 'mat-icon:contains("keyboard_arrow_down")' ,  // Module Arrow Dropdown Button
    editModuleCategoryButton : '.mdc-list-item__primary-text:contains(" Edit Module Category ")' ,  // Edit Module Category Button
    moduleCategoryDialogText : 'h1:contains("MODULE CATEGORY")' ,  // Module Category Text in the Dialog
    addNewCategoryButton : 'mat-icon:contains("add_circle")' ,  // Add New Category Button in Module Category dialog
    deleteCategoryButton : 'mat-icon:contains("highlight_off")' ,  // Delete Category Button in Module Category dialog
    moduleCategoryTextArea : 'input[matinput][maxlength="65"]' ,  // Module Category Text Area
    moduleCategoryConfirmButton : '.mdc-button__label:contains("Confirm")' ,  // Confirm button in Module Category Dialog
    moduleCategoryDisabledConfirmButton : 'button[ng-reflect-disabled="true"]' ,  // Confirm button in Module Category Dialog in Disabled condition
    moduleCategoryCancelButton : '.mdc-button__label:contains("Cancel")' ,  // Cancel button in Module Category Dialog
    moduleCategorySnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Edit Module Category Snack Bar
    moduleLibraryPageCategoryTextArea : 'mat-select[class*="mat-mdc-select"]' ,  // Category Text Area in Module Library page
    commitAllModulesButton : '.mdc-list-item__primary-text:contains(" Commit All Modules ")' ,  // Commit All Modules Button
    commitAllModulesSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Commit All Modules Snack Bar
    moduleLibraryRefreshButton : '.all-library-refresh-btn',  // Refresh Button in Module Library Page
    refreshModulesLoader : 'mat-progress-spinner[role="progressbar"]' ,  // Refresh Modules Loader Icon
    moduleLibraryShowAllButton : 'button:contains(" Show All ")' ,  //  Show All Button in Module Library Page
    moduleLibrarySearchBox : 'input[placeholder="Search Available Modules"]' ,  // Search Box in Module Library Page
    moduleNameContentTextArea: 'input[maxlength="64"]' ,  // Module Name Content Text Area in Module Library Page
    moduleCategoryNameInputField: 'input.mat-mdc-input-element', //module category input field in edit category dialog

    // Module Library Dropdown row action buttons
    moduleMoreOptionsButton : 'button[mat-button]:contains("expand_more")' ,  // More Options button in Module Library Page
    deleteModuleButton : '.mdc-list-item__primary-text:contains(" Delete Module ")' ,  // Delete Module button in Module Library Page
    moduleLibraryConfirmToDeleteButton : '.mdc-button__label:contains("Delete")' ,  // Delete Button in Confirmation to Delete Dialog
    moduleLibraryCancelToDeleteButton : '.mdc-button__label:contains("Cancel")' ,  // Cancel Button in Confirmation to Delete Dialog
    confirmToDeleteDialogText : 'h1:contains("CONFIRM TO DELETE")' ,  // CONFIRM TO DELETE Text in the Deletion Dialog
    editModuleFeaturesButton : '.mdc-list-item__primary-text:contains(" Edit Module Features ")' ,  // Edit Module Features button in Module Library Page
    closeEditModuleFeatureDialogButton: 'mat-icon:contains(close)' ,  // Close button in Edit Module Feature Dialog 
    applyNewFeatureButton : 'button:contains(Apply New Feature)' ,  // Apply New Feature button in Module Features Dialog
    featureNameFieldButton : 'mat-label:contains("Feature Name")' ,  // Feature Name Text area Field in Module Features Dialog
    featureRoleFieldButton : 'mat-label:contains("Feature Role")' ,  // Feature Role Field Button in Module Features Dialog
    moduleFeatureMoreOptionsButton : 'mat-icon:contains("more_horiz")' ,  // More Options button in Module Features Dialog
    confirmFeatureButton : '.mdc-list-item__primary-text:contains(" Confirm Feature ")' ,  // Confirm Feature Button in Module Features Dialog
    removeFeatureButton : '.mdc-list-item__primary-text:contains(" Remove Feature ")' ,  // Remove Feature Button in Module Features Dialog
    updateFeatureButton : '.mdc-list-item__primary-text:contains(" Update Feature ")' ,  // Update Feature Button in Module Features Dialog
    confirmFeatureSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Confirm Module Feature Snack Bar
    updateFeatureSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Update Module Feature Snack Bar
    duplicateFeatureSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Duplicate Module Feature Snack Bar
    commitModuleButton : '.mdc-list-item__primary-text:contains(" Commit Module ")' ,  // Commit Module button in Module Library Page
    commitModuleSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Commit Module Snack Bar
    expandMoreButton: 'button:contains(unfold_more)' ,  // Expand More button in Edit Module Feature Dialog
    safetyImpactFieldBox: 'mat-label:contains(Safety Impact)' ,  // Safety Impact Field Box in Edit Module Feature Dialog
    financialImpactFieldBox: 'mat-label:contains(Financial Impact)' ,  // Financial Impact Field Box in Edit Module Feature Dialog
    operationalImpactFieldBox: 'mat-label:contains(Operational Impact)' ,  // Operational Impact Field Box in Edit Module Feature Dialog
    privacyImpactFieldBox: 'mat-label:contains(Privacy Impact)' ,  // Privacy Impact Field Box in Edit Module Feature Dialog
    damageScenarioTextDescription: 'textarea' ,  // Damage Scenario Text Area Field for all Module Feature Impact
    globalDropDownOptionList: 'mat-option' ,  // Global DropDown Option List for all DropDown Lists that exists in Module Library
    moduleFeatureContentArea: 'mat-chip-grid',
}