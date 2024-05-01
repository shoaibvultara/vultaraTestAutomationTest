module.exports = {
    //new requirement dialog
    newReqDialogDescriptionTypeInput: 'input[type="radio"][value="description"]',
    newReqDialogImageTypeInput: 'input[type="radio"][value="image"]',
    newReqDialogNextButton: 'button:contains(Next)',
    newReqDialogDescriptionTextArea: 'textarea[formcontrolname="description"]',
    addFromLibraryButton : '.add-to-library-btn:contains("Add from library")' ,  // Add from Library Button
    newReqDialogPhaseFieldButton : 'mat-select[formcontrolname="phase"]' ,  // Phase Field Button in Add a New Requirement Dialog
    addRequirementFromLibrarySearchBox : 'input[placeholder="Search for Requirements"]' ,  // Search For Requirements Box in Add Requirement from library Dialog
    addRequirementFromLibraryConfirmButton: 'button:contains("Confirm")' ,  // Confirm Button in Add Requirement from library Dialog
    addRequirementToLibraryButton: 'button:contains(Add Requirement to library)', 
    addRequirementToLibraryConfirmButton: 'button:contains(Confirm)',
    newReqDialogStyleFieldButton: 'mat-select[formcontrolname="style"]',
    requirementPoolContentTextArea: 'textarea[class*="requirement-page-description"]',
    requirementPoolEditDialog: 'add-update-requirement',
    requirementPageButton: 'a:contains(Requirements)',
    
    // Delete Requirement
    requirementPoolMoreOptionsButton : 'mat-icon.mat-icon-no-color:contains("more_horiz")' ,  // More Options button in Requirement Pool Page
    deleteRequirementButton : '.mdc-list-item__primary-text:contains(" Delete Requirement ")' ,  // Delete Requirement button in Requirement Pool Page
    deleteRequirementConfirmToDeleteButton : '.mdc-button__label:contains("Delete")' ,  // Delete Button in Confirmation to Delete Dialog
    deleteRequirementCancelToDeleteButton : '.mdc-button__label:contains("Cancel")' ,  // Cancel Button in Confirmation to Delete Dialog
    deleteRequirementSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Delete Requirement Snack Bar
    
    //add new button
    requirementPoolAddNewButton: 'button[class="add-new-requirement-btn ng-star-inserted"]',

    // Requirement Library Page 
    createNewRequirementLibraryButton : 'button:contains(" Create New Requirement ")' ,  // Create New Requirement in Requirement Library Page
    newReqDialogCancelButton: 'button:contains("Cancel")',  // Cancel Button in Add a New Requirement Dialog
    newReqDialogConfirmButton: 'button:contains("Confirm")',  // Confirm Button in Add a New Requirement Dialog
    newReqDialogTypeFieldButton : 'mat-select[formcontrolname="type"]' ,  // Type Field Button in Add a New Requirement Dialog
    newReqDialogSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Create New Requirement Snack Bar
    newReqDialogDisciplineFieldButton : 'mat-select[formcontrolname="discipline"]' ,  // Discipline Field Button in Add a New Requirement Dialog
    requirementLibraryRefreshButton : '.refresh-btn-in-library',  // Refresh Button in Requirement Library Page
    requirementLibraryRefreshLoader : 'mat-progress-spinner[role="progressbar"]' ,  // Refresh Loader 
    requirementLibraryShowAllButton : 'button:contains(" Show All ")',  // Show All Button in Requirement Library Page
    requirementLibrarySearchBox : 'input[matinput][placeholder="Search Available Requirements"]',  // Requirement Library Page Search Box
    requirementLibraryDeleteIcon : 'mat-icon[aria-label="Delete Icon"]' ,  // Requirement Delete Icon in Requirement Library Page
    requirementLibraryConfirmToDeleteButton : 'button:contains("Delete")' ,  // Delete Button in Confirmation to Delete Dialog
    requirementLibraryCancelToDeleteButton : 'button:contains("Cancel")' ,  // Cancel Button in Confirmation to Delete Dialog
    globalDropDownOptionList: 'mat-option',
    requirementContentTextArea: 'textarea',
}