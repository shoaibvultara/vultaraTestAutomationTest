module.exports = {

    goalAddNewGoalButton: 'button:contains(Add New Goal)',
    goalNoGoalFoundParagraph: 'p:contains("No cybersecurity goal found")',
    goalExportButton: 'button:contains(Export to ReqIF)',
    addNewGoalDialogContentTextArea: 'textarea[formcontrolname="content"]',
    addNewGoalDialogConfirmButton:'button:contains(Confirm)',
    addNewGoalDialogCancelButton:'button:contains(Cancel)',
    addNewGoalDialogAddFromLibraryButton:'.add-from-lib-btn',
    addNewGoalDialogCreateNewGoal: 'p:contains(Create New Goal)',
    addNewGoalDialog:'.mdc-dialog__container',
    goalSerialNumber:'.mat-mdc-row > .mat-column-serial', //use .eq() for row number
    goalDescription:'mat-mdc-row > mat-column-goal',//use .eq() for row number
    goalLinkedControl:'mat-mdc-row > mat-column-control',//use .eq() for row number
    goalDropDownButton:'.mat-mdc-row > .cdk-column-action',//use .eq() for row number
    goalDropDownDeleteOption:'button:contains(Delete Goal)',
    goalDropDownAddGoalToLibraryOption:'button:contains(Add Goal to Library)',
    goalDropDownLinkedControlsOption:'button:contains(Linked Controls)',
    goalSnackBarMessageSuccessfulCreation:'.mat-mdc-simple-snack-bar',
    goalDeleteConfirmButton: '.dialog-buttons > button:contains(Delete)',
    searchControlBox: 'input[ng-reflect-placeholder="Search Control..."]',
    globalDropDownList: 'mat-option',
    linkedControlChip: 'mat-chip-row',
}