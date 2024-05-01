module.exports = {
    createNewControlButton : 'button:contains(" Create New Control ")' ,  // Create New Control Button in Control Library Page
    newControlDialogFieldBox : 'mat-label:contains("Control")' ,  // Control Field Box
    newControlDialogConfirmButton : 'button:contains("Confirm")' ,  // Confirm Button in Add New Control Dialog
    newControlDialogCancelButton : 'button:contains("Cancel")' ,  // Cancel Button in Add New Control Dialog
    controlLibraryRefreshButton : '.all-library-refresh-btn',  // Refresh Button in Control Library Page
    controlLibraryRefreshLoader : 'mat-progress-spinner[role="progressbar"]' ,  // Refresh Loader 
    controlLibraryShowAllButton : 'button:contains(" Show All ")' ,  // Show All Button in Control Library Page
    controlLibrarySearchBox : 'input[matinput][placeholder="Search Available Controls"]' ,  // Control Library Page Search Box
    controlLibraryMoreOptionsButton : 'button:contains(more_horiz)' ,  // More Options button in Control Library Page
    moreOptionsLinkedRequirementsButton: '.mdc-list-item__primary-text:contains(Linked Requirements)' ,  // Linked Requirements button in Control Library page
    linkedRequirementSwitchButton : 'button[role="switch"]' ,  // Show All button in Linked Requirements Dialog
    linkedRequirementCheckboxInput : 'input[type="checkbox"]',  // Check box in Linked Requirements Dialog
    linkedRequirementConfirmButton : '.mdc-button__label:contains("Confirm")' ,  // Delete Button in Confirmation to Delete Dialog
    linkedRequirementCancelButton : '.mdc-button__label:contains("Cancel")' ,  // Cancel Button in Confirmation to Delete Dialog
    linkedRequirementSnackBar : 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]' ,  // Linked Requirement Snack Bar
    moreOptionsDeleteControlButton: '.mdc-list-item__primary-text:contains(Delete Control)' ,  // Delete Control button in Control Library Page
    controlLibraryConfirmToDeleteButton : '.mdc-button__label:contains("Delete")' ,  // Delete Button in Confirmation to Delete Dialog
    controlLibraryCancelToDeleteButton : 'button:contains("Cancel")' ,  // Cancel Button in Confirmation to Delete Dialog
}