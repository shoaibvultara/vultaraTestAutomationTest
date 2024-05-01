module.exports = {

    // Add New Trigger Dialog
    projectTriggerListTab: 'span.mdc-tab__text-label:contains("Project Trigger")',  // Project Trigger Page Tab
    archivedListTab: 'span.mdc-tab__text-label:contains("Archived List")',  // Project Trigger Page Tab
    activeListTab: 'span.mdc-tab__text-label:contains("Active List")',  // Project Trigger Page Tab
    addNewTriggerButton: 'button:contains("+ Add New Trigger")',  // Add New Trigger Button 
    triggerNameFieldBox: 'input[formcontrolname="triggerName"]',  // Trigger Name Field Box
    triggerDescriptionFieldBox: 'textarea[formcontrolname="triggerDescription"]', // Trigger Description Field Box
    relevantPartieFieldBox: 'input[ng-reflect-placeholder="Add New..."]',  // Trigger Relevant Parties Field Box
    triggerPriorityFieldButton: 'mat-select[formcontrolname="triggerPriority"]',  // Trigger Priority Field Button
    triggerPriorityDropDownList: 'mat-option',  // Trigger Priority Dropdown List
    priorityRationaleFieldBox: 'textarea[formcontrolname="priorityRationale"]',  // Trigger Priority Rationale Field Box
    statusCheckBox: 'input[type="checkbox"]',  // Trigger Status Check Box
    newTriggerConfirmButton: 'button:contains("Confirm")',  // Confirm Button
    newTriggerCancelButton: 'button:contains("Cancel")',  // Cancel Button 
    addNewTriggerSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // New Trigger Added Snack bar

    // Generate Trigger Dialog
    generateTriggerButton: 'button:contains("Generate Trigger")',  // Generate Trigger Button
    generateTriggerTextDialog: 'h1.global-dialog-title-style',
    triggerSourceCheckBox: 'input[type="checkbox"]',  // Generate Trigger Source Check Box
    generateTriggerDialogGenerateButton: 'span.mdc-button__label:contains("Generate")',  // Generate Button 
    newGenerateTriggerCancelButton: 'button:contains("Cancel")',  // Cancel Button 
    generateTriggerSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Generate Trigger Snack Bar
    selectAllText: 'label:contains("Select All")',
    modelingViewText: 'label:contains("Modeling View")',  // Modeling View Text Box
    ProjectBomText: 'label:contains("Project BOM")',  // Project BOM Text Box
    generateTriggerLoader: '.la-3x > :nth-child(1)',  // Generate Trigger Loader Icon
    triggerNameTextArea: 'textarea.mat-mdc-input-element',
    editTriggerTextDialog: 'h1.global-dialog-title-style',
    triggerNameTableData: 'td[class*="mat-column-triggerName"]',

    // Search Trigger Box
    searchTriggerBox: 'input[placeholder="Search Triggers"]',  // Search Triggers Field box 

    // Project Trigger action Buttons
    projectTriggerDropDownActionButton: 'mat-icon.mat-icon-no-color:contains("more_horiz")',  // Project Trigger Dropdown Action Button
    deleteTriggerButton: '.mdc-list-item__primary-text:contains(" Delete Trigger ")',  // Delete Proejct Trigger Button
    confirmToDeleteTriggerButton: '.mdc-button__label:contains("Delete")',  // Delete Button in Confirmation To Delete Weakness Dialog
    cancelToDeleteTriggerButton: '.close-dialog-btn:contains("Cancel")',  // Cancel Button in Confirmation To Delete Weakness Dialog
    deleteTriggerSnackBar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',  // Delete Project Trigger Snack Bar
}