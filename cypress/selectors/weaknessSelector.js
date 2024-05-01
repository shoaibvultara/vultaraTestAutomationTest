module.exports = {
    // Weakness Active List Page Action Buttons
    weaknessActiveListPageTab: 'span.mdc-tab__text-label:contains("Active List")',  // Weakness Active List Page Tab
    addNewWeaknessButton: 'button:contains("+ Add New Weakness")',  // Add New Weakness Button
    weaknessCalenderIconButton: 'button[aria-label="Open calendar"]',  // Calender Icon Button
    weaknessCalenderDateField: 'span.mat-calendar-body-cell-content.mat-focus-indicator.mat-calendar-body-today',  // Chooses "Today" date by default
    weaknessResponsibleFieldButton: 'mat-select[formcontrolname="responsibleUserId"]',  // Responsible Field Button
    weaknessIdentificationMethodFieldBox: 'input[formcontrolname="identificationMethod"]',  // Identification Method Field Box
    weaknessSourceNotesFieldBox: 'textarea[formcontrolname="sourceNotes"]',  // Source Notes Field Box
    weaknessSourceNotesLinkFieldBox: 'input[formcontrolname="sourceLink"]',  // Source Notes Link Field Box
    weaknessComponentFieldButton: 'mat-select[formcontrolname="component"]',  // Component Field Box
    weaknessAttackSurfaceFieldBox: 'input[formcontrolname="attackSurface"]',  // Attack Surface(s) Field box
    weaknessAssetFieldBox: 'input[formcontrolname="asset"]',  // Asset(s) Field Box
    weaknessDescriptionFieldBox: 'textarea[formcontrolname="weaknessDescription"]',  // Weakness Description(required)* Field Box
    weaknessCweIdFieldBox: 'input[formcontrolname="cweId"]',  // CWE ID Field Box
    weaknessCweWeaknessTypeFieldButton: 'mat-label:contains("CWE Weakness Type")',  // CWE Weakness Type Field Button
    weaknessCweWeaknessCategoryFieldButton: 'mat-label:contains("CWE Weakness Category")',  // CWE Weakness Category Field Button
    weaknessActiveListRefreshButton: '#refresh-weakness-list',  // Weakness Active List Tab Refresh Button
    weaknessActiveListSearchFieldBox: 'input[matinput][placeholder="Search"]',  // Weakness Active List Tab Search Box
    vulnerabilityAnalysisButton: 'div.weakness-vulnerability-analysis-status-label.vulnerability-analysis-label-not-started:contains("Not started")',
    analyzeWeaknessExploitableButton: 'mat-select[formcontrolname="exploitable"]',  // Exploitable Field Box in Analyze Weakness Dialog
    analyzeWeaknessExploitableRationaleFieldBox: 'textarea[formcontrolname="exploitableRationale"]',  // Exploitable Rationale Field Box in Analyze Weakness Dialog
    preControlRiskValueFieldBox: 'input[formcontrolname="preControlRiskValue"]',  // Pre-Control Risk Value Field Box in Analyze Weakness Dialog
    riskRationaleFieldBox: 'textarea[formcontrolname="riskRationale"]',  // Risk Rationale Field Box in Analyze Weakness Dialog

    // Weakness Archived List Page Action Buttons
    weaknessArchivedListPageTab: 'span.mdc-tab__text-label:contains("Archived List")',  // Weakness Archived List Page Tab
    weaknessArchivedListRefreshButton: '#refresh-weakness-list',  // Weakness Archived List Tab Refresh Button
    weaknessArchivedListSearchFieldBox: 'input[matinput][placeholder="Search"]',  // Weakness Archived List Tab Search Box

    // Weakness Dropdown Action Buttons
    weaknessDropDownActionButton: 'mat-icon.mat-icon-no-color:contains("more_horiz")',  // Weakness Dropdown Action Button
    deleteWeaknessButton: 'button:contains("Delete Weakness")',  // Delete Weakness Button
    confirmToDeleteWeaknessButton: 'button:contains("Delete")',  // Delete Button in Confirmation To Delete Weakness Dialog
    cancelToDeleteWeaknessButton: '.close-dialog-btn:contains("Cancel")',  // Cancel Button in Confirmation To Delete Weakness Dialog
    eventLinkingButton: 'button:contains("Event Linking")',  // Event Linking Button
    eventLinkingConfirmationToCancelYesButton: 'button:contains("Yes")',  // Yes Button in Confirmation to Discard Event Linking Changes Dialog
    vulnerabilityLinkingButton: 'button:contains("Vulnerability Linking")',  // Vulnerability Linking Button
    generateVulnerabilityFromThisWeaknessButton: 'button:contains(Generate Vulnerability from this Weakness)',  // Generate Vulnerability from this Weakness Button in Vulnerability Linking Dialog
    vulnerabilityLinkingConfirmationToCancelYesButton: 'button:contains("Yes")',  // Yes Button in Confirmation to Discard Vulnerability Linking Changes Dialog 
    highlightWeaknessButton: 'button:contains("Highlight")',  // Highlight Weakness Button   
    attachmentButton: 'button:contains(Attachments)',  // Attachments button in Dropdown action list
    weaknessAttachmentTextDialog: 'h1.global-dialog-title-style',  // Header Text in Weakness Attachments Dialog
    weaknessContentTextArea: 'textarea',
    weaknessDropDownOptionList: 'mat-option',
    snackBarMessage: 'div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]',
    globalConfirmButton: 'button:contains("Confirm")',
    globalCancelButton: 'button:contains("Cancel")',
    globalCheckBox: 'input[type="checkbox"]',
    headerRow: 'tr[mat-header-row]',
    weaknessDescriptionContentArea: 'td[class*="mat-column-weaknessDescription"]',
    weaknessPagination: 'mat-paginator',
    archiveWeaknessButton: 'button:contains("Archive Weakness")',
}