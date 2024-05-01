module.exports = {

    // Add New Event Action buttons Selectors
    addNewEventButton : 'button.add-event-btn', // Add New Event Button
    addNewEventDialogText : 'h1:contains(Add New Event)',  // Add New Event Text in the Dialog
    triggerNameFieldButton : 'mat-select[formcontrolname="eventTriggerName"]',  // Trigger Name Field Button
    priorityFieldButton : 'mat-select[formcontrolname="eventPriority"]',  // Priority Field Button
    eventStatusFieldButton : 'mat-select[formcontrolname="eventStatus"]',  // Event Status Field Button
    eventResponsibleFieldButton : 'mat-select[formcontrolname="responsibleUserId"]',  // Responsible Field Button
    eventDetailFieldBox : 'textarea.mat-mdc-input-element[formcontrolname="eventDetails"]',  // Event Details Field box
    evaluationNoteFieldBox : 'textarea[formcontrolname="evaluationNotes"]',  // Evaluation Noted Field Box
    evaluationStatusFieldButton : 'mat-select[formcontrolname="evaluationStatus"]',  // Evaluation Status Field Button
    weaknessLinkingDialogCheckBox : 'input[type="checkbox"]',  // Weakness Linking Dialog Check box
    generateWeaknessFromThisEventButton : 'button:contains("Generate Weakness from this Event")',  // Generate Weakness From This Event Button in the Weakness Linking Dialog
    weaknessLinkingTextDialog: 'h1',
    eventDropDownListOption: 'mat-option',
    snackBarMessage: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',
    globalConfirmButton: 'button:contains("Confirm")',
    globalCancelButton: 'button:contains("Cancel")',
    evaluationStatusLabel: 'label:contains(Evaluation Status) > span',
    requiredSymbol: 'mat-mdc-form-field-required-marker',
    attachmentButton: 'button:contains(Attachments)',
    eventAttachmentTextDialog: 'h1.global-dialog-title-style',

    // Search Event Box
    searchEventBox : 'input[placeholder="Search Event"]',  // Search Event Field box 

    // Event dropdown actions
    eventDropDownActionButton : 'button:contains("more_horiz")',  //Event Dropdown action button
    deleteEventButton : 'button:contains(" Delete Event ")',  //Delete Event button
    confirmDialogDeleteEventButton : 'button:contains("Delete")',  // Delete button in Confirmation Dialog
    
    // Weakness Linking
    weaknessLinkingButton : 'button:contains(" Weakness Linking ")',  // Weakness Linking Button

    // Event Row 
    eventDetailsContentArea : 'textarea', 
    editEventDialogText : 'h1:contains(Edit Event ID)',  // Edit Event Text in the Dialog
    eventPagination: 'mat-paginator',
}