module.exports = {
    threatListViewAttackPathTextArea: '[id=mat-input-3]',//first threat attack path text area clickable field
    threatListViewAttackPathButton: '[property="attackPathName"]', //use .eq for exact threat number
    threatListViewAttackPathDialog: 'attack-path-dialog',//threat attack path dialog box
    threatListViewAttackPathColumn: 'textarea[property="attackPathName"]',
    threatListViewReviewCheckBox: '[id=mat-mdc-checkbox-3-input]',
    threatListViewThreatActionsButton: 'button:contains("more_horiz")',
    threatListViewAddNewThreatButton: 'button:contains("Add New Threat")',
    threatListViewDamageScenarioColumn: 'textarea[property="damageScenario"]',
    threatListViewDamageScenarioTableData: 'td[class*="cdk-column-threatScenario"]',
    threatListViewThreatNoTableData: 'td[class*="mat-column-rowNumber"]',
    threatListViewPaginator: '.mat-mdc-paginator-range-label',
    threatListViewNoteTextArea: 'textarea[class*="notesTextArea"]',

    threatListViewThreatScenarioTextArea: 'textarea[property="threatScenario"]',
    threatListViewFeasibilityMethodSelect: 'mat-select[ng-reflect-name="attackFeasibilityView"]',

    feasibilityMethodAttackPotentialOption: 'mat-option[value="Attack Potential"]',
    feasibilityMethodAttackVectorOption: 'mat-option[value="Attack Vector"]',

    threatScenarioCheckCircleIcon: 'mat-icon:contains("check_circle_outline")',

    threatListViewThreatCheckBoxInput: 'input[type="checkbox"]',
    threatListViewThreatTreatmentSelect: 'mat-select-trigger',
    threatListViewExpandThreatIcon: 'button:contains("unfold_more")',
    threatListViewExpandedThreatDiv: 'div[class^="expanded-threat-content"]',//'^' means, class name starts with...
    threatListViewSelectedNotiationSpan: 'span:contains("selected")',
    threatListViewExpandedThreatAddIcon: 'button:has(mat-icon:contains(add))',
    threatListViewAddGoalDialogDescription: 'textarea[class^="cybersecurity-goal-information"]',
    threatListViewAddNewGoalFromPool: 'mat-select:contains(New Goal)',
    threatListViewAddNewClaimFromPool: 'mat-select:contains(New Claim)',
    threatListViewAddClaimDialogDescription: 'textarea[class^="cybersecurity-goal-information"]',
    threatListViewAddClaimDialogSelectField: 'mat-select',
    threatListViewExpandedRecordId: 'td[class*="mat-column-serial"]',
    threatListViewExpandedRecordContent: 'td[class*="mat-column-content"]',
    threatListViewRemoveButton: 'button:contains(Remove)',
    threatListViewCybersecurityRecordDialog: '.cybersecurity-goal-list',
    threatListViewAddNewGoalSearchInput: 'textarea[ng-reflect-placeholder="Search"]',

    threatTreatmentNoTreatmentOption: 'mat-option:contains("no treatment")',
    threatTreatmentReduceOption: 'mat-option:contains("reduce")',
    threatTreatmentRetainOption: 'mat-option:contains("retain")',
    threatTreatmentAvoidOption: 'mat-option:contains("avoid")',
    threatTreatmentShareOption: 'mat-option:contains("share")',

    dropDownActionsDeleteButton: 'button:contains("Delete Threat")',
    dropDownActionsAddNewThreatButton: 'button:contains("Add New Threat")',
    dropDownActionsSaveAsNewThreatButton: 'button:contains("Save As New Threat")',
    dropDownActionsHighlightThreatButton: 'button:contains("Highlight")',
    dropDownActionsThreatHistoryButton: 'button:contains("Threat History")',
    dropDownActionsRemoveHighlightButton: 'button:contains("Remove Highlight")',

    confirmDialogDeletePermanentlyButton: 'button:contains("Permanently")',
    confirmDialogDeleteTemporarilyButton: 'button:contains("Temporarily")',

    threatHistoryDialog: 'app-threat-history',
    threatHistoryCloseIcon: 'mat-icon:contains("close")',

    threatListViewSnackbar: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',

    attackPathDialogTitleHeader: '.attackPathHeadingPosition > h1',//attack path dialog title
    attackPathDialogComponentTableHeader: 'th:contains("Component")',
    attackPathDialogStepTableHeader: 'th:contains("Step")',
    attackPathDialogDescriptionTableHeader: 'th:contains("Description")',
    attackPathDialogAddStepButton: '.mdc-button__label:contains("Add New Step")',//attack path dialog add new step
    attackPathDialogStepOneComponent: '[id=mat-select-value-23]',//first component values drop down bar
    attackPathDialogStepTwoComponent: '[id=mat-select-value-25]',//second 
    attackPathDialogComponentSelectPanel: '[id=cdk-overlay-1]',//component list panel
    attackPathDialogStepOneTableData: '[class="mat-mdc-cell mdc-data-table__cell cdk-cell cdk-column-step mat-column-step ng-star-inserted"]',//step cell
    attackPathDialogStepTwoTableData: '#cdk-drop-list-1 > tbody > tr:nth-child(2) > td.mat-mdc-cell.mdc-data-table__cell.cdk-cell.cdk-column-step.mat-column-step.ng-star-inserted',
    attackPathDialogDescriptionEmptyTextArea: '#mat-input-21',//before typing Description
    attackPathDialogDescriptionFilledTextArea: '#mat-input-22',//after Description is written
    attackPathDialogDeleteButton: 'button:contains("delete")',//delete icon
    attackPathDialogDescriptionPopUp: '#mat-autocomplete-0',
    attackPathDialogStepCount: '.attackPath-dialog-step-list-text',

    componentSelectPanelStepOneOption: '[id=mat-option-43]',//component list option 
    componentSelectPanelStepTwoOption: 'mat-option:contains("Microcontroller0")',
    threatListViewFeasibilityButton: 'td.mat-column-attackFeasibility',//use .eq(0) for first row feasibility and vice versa
    threatListViewImpactButton: 'td.mat-column-impact',
    threatListViewRiskButton: 'td.mat-column-riskLevel',

    mapThreatToWP29DialogYesButton: 'button:contains(Yes)',
    mapThreatToWP29DialogNextButton: 'button:contains(Next)',
    mapThreatToWP29DialogDoneButton: 'button:contains(Done)',
    mapThreatToWP29DialogAcknowledgeButton: 'button:contains(Acknowledge)',

    threatListViewValidatedTableDataCheckBox: 'td[class*="mat-column-treatmentVal"] > mat-checkbox > div > div > input[type="checkbox"]',
    dialogCloseIcon: 'mat-icon:contains("close")',
    attackTreeButton: '.attack-tree-button',
    poolDialogRemoveButton: 'button:contains(Remove)',
    confirmDialogCancelButton: 'button:contains(Cancel)',
    globalDropDownList: 'mat-option',
    threatListShowFilterButton: 'button:contains(Show Filter)',
    filterByGoalAndClaimButton: 'button:contains(Filter By Goals & Claims)',
    cybersecurityFilterContent: '.cybersecurity-filter-content',
    threatListViewReviewedTableDataCheckBox: 'td[class*="mat-column-reviewed"] > mat-checkbox > div > div > input[type="checkbox"]',
    threatListRow: 'tbody > tr',
    threatListViewDamageScenarioTableData: 'td.mat-column-damageScenario',
    threatListViewDamageScenarioScrollBar: 'td[class*="mat-column-damageScenario"] > mat-form-field > div > div[matformfieldlineripple]',
}