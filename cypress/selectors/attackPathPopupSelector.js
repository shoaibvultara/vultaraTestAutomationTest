module.exports = {

    attackPathDialogTitleHeader: '.attackPathHeadingPosition > h1',//attack path dialog title
    attackPathDialogComponentTableHeader: 'th:contains("Component")',
    attackPathDialogStepTableHeader: 'th:contains("Step")',
    attackPathDialogDescriptionTableHeader: 'th:contains("Description")',
    attackPathDialogAddStepButton: '.mdc-button__label:contains("Add New Step")',//attack path dialog add new step
    attackPathDialogStepComponent: '.attackPath-list-table-container > table > tbody > tr > td > mat-select',//component values drop down bar
    attackPathDialogComponentSelectPanel: '[id=cdk-overlay-1]',//component list panel
    attackPathDialogStepOneTableData: '[class="mat-mdc-cell mdc-data-table__cell cdk-cell cdk-column-step mat-column-step ng-star-inserted"]',//step cell
    attackPathDialogStepTwoTableData: '#cdk-drop-list-1 > tbody > tr:nth-child(2) > td.mat-mdc-cell.mdc-data-table__cell.cdk-cell.cdk-column-step.mat-column-step.ng-star-inserted',
    attackPathDialogDescriptionEmptyTextArea: '#mat-input-21',//before typing Description
    attackPathDialogDescriptionFilledTextArea: '#mat-input-22',//after Description is written
    attackPathDialogDeleteButton: 'button:contains("delete")',//delete icon
    attackPathDialogDescriptionPopUp: '#mat-autocomplete-0',
    attackPathDialogStepCount: '.attackPath-dialog-step-list-text',
    attackPathDialogAttackTreeIcon: '.attack-tree-white-icon',
    attackPathDialogLinkTreeButton: 'button:contains("Link Tree")',
    attackPathLinkTreePopup:'.mat-mdc-dialog-surface',
    attackPathLinkTreePopupLoadTree:'mat-radio-button[ng-reflect-value="load"]',
    attackPathLinkTreePopupCreateTree:'mat-radio-button[ng-reflect-value="create"]',
    attackPathLinkTreePopupLoadTreeButton:'input[value="load"]',
    attackPathLinkTreePopupCreateTreeButton:'input[value="create"]',
    attackPathDialogNextButton: 'button:contains("Next")',
    attackPathDialogLinkCurrentLoadedTreeButton: 'button:contains(Link Current Loaded Tree)',
    attackPathDialogTreeName: 'input[type="text"]',
    attackPathDialogConfirmButton: 'button:contains("Confirm")',
}