module.exports = {
    noDamageScenarioParagraph: 'p:contains("No damage scenario")', // No damage Scenario Text
    damageScenarioAddButton: 'button:contains("Add New Damage Scenario")', //Add Damage Scenario Button

    damageScenarioDialogContainer: '#mat-mdc-dialog-0', //Dialog Container Of Damage Scenarios
    damageScenarioDialogHeader: 'h1:contains("Damage Scenario")', //Dialog Title Of Damage Scenarios
    damageScenarioDialogConfirmButton: '.confirm-dialog-btn', //Dialog Confirm Button of Damage Scenarios
    damageScenarioTableIdThead: 'th:contains("ID")', //Id column header
    damageScenarioTableDescriptionThead: 'th:contains("Description")', //Description coulmn header
    damageScenarioMoreActionButton : 'button:contains("more_horiz")',  //Event Dropdown action button

    damageScenarioDialogIdInput: '#mat-input-2', //Dialog Id Input 
    damageScenarioDialogDescriptionInput: '#mat-input-1', //Dialog Description Input

    damageScenarioDeleteButton: 'button:contains(Delete Damage Scenario)', //Delete Button
    damageScenarioDescriptionTextArea: 'textarea', //Text Area of Damage Scenarios
    damageScenarioReplacementForm: 'mat-form-field:contains(Replace)', //DS selection list form 
    damageScenarioReplacementListOption: 'mat-option',// DS list option
    damageScenarioPagination: '.mat-mdc-paginator-range-label',
}