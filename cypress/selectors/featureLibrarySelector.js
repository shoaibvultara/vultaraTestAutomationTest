module.exports = {
    
    createNewFeatureButton: '.all-library-create-new-btn' ,  // Create New Feature Button in Feature Library page
    createNewFeatureSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Create New Feature Snack Bar
    createFeatureButton: 'button:contains(Create Feature)' ,  // Create Feature Button in Basic Feature settings dialog
    createFeatureDisabledButton: 'button[ng-reflect-disabled="true"]:contains(" Create Feature ")'  ,  // Create Feature Button when it is disabled in Basic Feature settings dialog
    featureContentTextArea: 'div[class="feature-tab-name-div"]' ,  // Feature Name Text area in Feature Library page
    featureNameFieldBox: 'input[name="featureName"]' ,  // Feature Name Field Box in Basic Feature settings dialog
    featureNameErrorMessage: 'mat-error:contains("Feature Name is required.")' ,  // Module Name Error message
    featureTypeFieldButton: 'mat-select[aria-haspopup="listbox"]' ,  // Feature Type Field Button in Basic Feature settings dialog
    showAssetLibraryButton: 'button:contains(" Show Asset Library ")' ,  // Show Asset Library Button in Basic Feature settings dialog
    hideAssetLibraryButton: 'button:contains(" Hide Asset Library ")' ,  // Hide Asset Library Button in Basic Feature settings dialog
    searchAvailableAssetFieldBox:  'input.mat-mdc-input-element[ng-reflect-name="searchAvailable"]' ,  // Search Available Assets Field Box in Basic Feature settings dialog
    assetChipDialog: 'mat-chip-grid[aria-label="All Available Assets"]' ,  // Asset Chips Dialog
    addToFeatureButton: 'button:contains(Add to Feature)' ,  // Add to Feature Button in Basic Feature settings dialog
    addApplicationButton: 'button:contains("Add Application")' ,  // Add Application Button in Basic Feature settings dialog
    autoDamageScenarioCheckBox: 'input[type="checkbox"]' ,  // Auto Damage Scenario Check Box in Basic Feature settings dialog
    featureApplicationModuleFieldButton: 'mat-label:contains(Module)' ,  // Module Field Button in Feature Applications Dialog
    featureApplicationFeatureRoleFieldButton: 'mat-label:contains(Feature Role)' ,  // Feature Role Field Button in Feature Applications Dialog
    featureApplicationMoreOptionsButton: 'mat-icon:contains("more_horiz")' ,  // More Options button in Feature Applications Dialog
    cancelNewApplicationButton: '.mdc-list-item__primary-text:contains(" Cancel New Application ")' ,  // Cancel New Application Button in Feature Applications Dialog
    goToModuleEditingPageButton: '.mdc-list-item__primary-text:contains(" Go To Module Editing Page ")' ,  // Go To Module Editing Page Button in Feature Applications Dialog
    featureLibraryRefreshButton: '.all-library-refresh-btn',  // Refresh Button in Feature Library Page
    featureLoaderIcon: 'mat-progress-spinner[role="progressbar"]' ,  // Refresh Features Loader Icon
    featureLibraryShowAllButton: 'button:contains(" Show All ")' ,  //  Show All Button in Feature Library Page
    featureLibrarySearchBox: 'input[placeholder="Search Available Features"]' ,  // Search Box in Feature Library Page
    editFeatureButton: '.mdc-button__label:contains(" Edit Feature ")' ,  // Edit Feature Button in Feature Library Page
    confirmChangesButton: '.mdc-button__label:contains(" Confirm Changes ")' ,  //  Confirm Changes Button in Edit Feature Dialog
    confirmChangesDisabledButton: 'button[ng-reflect-disabled="true"]:contains(" Confirm Changes ")'  ,  // Confirm Changes Button when it is disabled in Edit Feature Dialog
    confirmChangesSnackbar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Confirm Feature Changes Snack Bar
    deleteFeatureButton: 'button:contains(Delete)' ,  // Delete Features Button in Edit Feature Dialog
    featureLibraryConfirmToDeleteButton: '.mdc-button__label:contains("Delete")' ,  // Delete Button in Confirmation to Delete Dialog
    featureLibraryCancelToDeleteButton: '.mdc-button__label:contains("Cancel")' ,  // Cancel Button in Confirmation to Delete Dialog
    deleteFeatureSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Delete Feature Snack Bar
    editFeatureRole: 'button:contains(Edit Feature Roles)' ,  // Edit Feature Roles button in Basic Feature settings dialog
    featureAssetDialog: 'mat-chip-grid[id="featureAssetsChip"]' ,  // Feature Assets Dialog in Basic Feature settings dialog
    featureApplicationGlobalButton: 'mat-select',
    safetyImpactFieldBox: 'mat-label:contains(Safety Impact)' ,
    financialImpactFieldBox: 'mat-label:contains(Financial Impact)' , 
    operationalImpactFieldBox: 'mat-label:contains(Operational Impact)' ,  
    privacyImpactFieldBox: 'mat-label:contains(Privacy Impact)' ,  
    damageScenarioTextDescription: 'textarea' , 
    globalDropDownOptionList: 'mat-option' , 
    expandMoreButton: 'mat-icon:contains(unfold_more)' ,
    editFeatureRoleOptionButton: 'button.mdc-list-item',
}