module.exports = {
    attackTreeDialog: '#attack-tree-sidebar',
    attackTreeDialogHeader: '.attack-tree-navbar',
    attackTreeDialogFooter: '#blockList',
    attackTreeDialogCanvas: '#canvas',
    attackTreeDialogAttackTreeButton: 'button:contains("Attack Tree")',
    attackTreeDialogTreeButton: 'button:contains("Tree")',
    attackTreeDialogLoadedTreeButton: 'button:contains("Loaded")',
    attackTreeDialogSaveIcon: 'mat-icon:contains("save")',
    attackTreeDialogApplyAttackTreeToThreat: 'button[ng-reflect-message="Apply Attack Tree to Threat"]',
    attackTreeDialogPlayIcon: 'mat-icon:contains("play_arrow")',
    attackTreeButtonColor: '.attack-tree-button-container',
    attackTreeCanvasZoomDisplay: '.attack-tree-zoom-value',
    attackTreeCanvasZoomInButton:'button[mattooltip="zoom in"]',
    attackTreeCanvasZoomOutButton:'button[mattooltip="zoom out"]',
    attackTreeCanvasResetZoomButton:'button[mattooltip="reset zoom"]',
    attackTreeCanvasSavedIcon: 'attack-tree-button.svg',
    attackTreeCanvasUnsavedIcon: 'attack-tree-unsaved-changes-icon.svg',

    attackTreeDialogNode: '.blockIn',   //.eq(0)
    attackTreeDialogAND: '.blockIn',    //.eq(2)
    attackTreeDialogOR: '.blockIn',     //.eq(1)
    attackTreeDialogSAND: '.blockIn',   //.eq(3)

    attackTreeDialogDropDown: '.mat-mdc-menu-content',
    attackTreeDialogTreeDropDownNewTree: 'button:contains("New Tree")',
    attackTreeDialogTreeDropDownChange: 'button:contains("Change Tree Name")',
    attackTreeDialogTreeDropDownDetailsButton: 'button:contains("Attack Tree Details")',
    attackTreeDialogTreeDropDownDeleteTree: 'button:contains("Delete Tree")',
    attackTreeDialogTreeDropDownLoadTree: 'button:contains("Load Tree")',
    attackTreeDialogTreeDropDownSaveTree: 'button:contains("Save Tree As")',
    attackTreeDialogTreeDropDownLinkAttackPath: 'button:contains("Link Attack Path")',
    attackTreeDialogTreeDropDownLinkVulnerability: 'button:contains("Link Vulnerability")',

    //New Tree Popup
    attackTreeDialogNewTreePopup: '.mat-mdc-dialog-surface',
    attackTreeDialogNewTreePopupName: 'input[type="text"]',
    attackTreeDialogNewTreePopupConfirmButton: 'button:contains("Confirm")',
    attackTreeDialogNewTreePopupCancelButton: 'button:contains("Cancel")',

    //Delete Tree Popup
    attackTreeDialogDeleteTreePopup: '.mat-mdc-dialog-surface',
    attackTreeDialogSelectTree: 'mat-selection-list[role="listbox"]',
    attackTreeDialogDeleteTreePopupDeleteButton: 'button:contains("Delete")',

    //Attack Tree Details
    attackTreeDialogEditAttackTreeDetailsPopup: '.mat-mdc-dialog-surface',
    attackTreeDialogUpdateTreeNameInput: 'input[formcontrolname="name"]',
    attackTreeDialogUpdateTreeNotesTextarea: 'textarea[formcontrolname="notes"]',
    attackTreeDialogEditAttackTreeDetailsConfirmButton: 'button:contains(Confirm)',
    attackTreeDialogEditAttackTreeDetailsCancelButton: 'button:contains(Cancel)',

    //Change Tree Name Popup
    attackTreeDialogChangeTreeNamePopup: '.mat-mdc-dialog-surface',
    attackTreeDialogChangeTreeNamePopupName: '.singleInputDialogMatformField',
    attackTreeDialogChangeTreePopupConfirmButton: 'button:contains("Confirm")',
    attackTreeDialogChangeTreePopupCancelButton: 'button:contains("Cancel")',

    //Load Tree Popup
    attackTreeDialogLoadTreePopup: '.mat-mdc-dialog-surface',
    attackTreeDialogLoadTreeSelectTree: 'mat-selection-list[role="listbox"]',
    attackTreeDialogLoadTreePopupConfirmButton: 'button:contains("Confirm")',
    attackTreeDialogLoadTreePopupCancelButton: 'button:contains("Cancel")',
    attackTreeDialogLoadTreeEmptyMessage: 'simple-snack-bar',

    //Save Tree As Popup
    attackTreeDialogSaveTreeAsPopup: '.mat-mdc-dialog-surface',
    attackTreeDialogSaveTreeAsPopupName: 'input[type="text"]',
    attackTreeDialogSaveTreeAsPopupConfirmButton: 'button:contains("Confirm")',
    attackTreeDialogSaveTreeAsPopupCancelButton: 'button:contains("Cancel")',
    attackTreeDialogCanvasElement: '.blockElementAfterDrag',

    //Link Tree Popup
    attackTreeDialogLinkAttackPathPopup: '.mat-mdc-dialog-surface',
    attackTreeDialogLinkAttackPathPopupShowAllButton: '.mdc-switch__icons',
    attackTreeDialogLinkAttackPathPopupThreatNumber: "td[class='mat-mdc-cell mdc-data-table__cell cdk-cell cdk-column-rowNumber mat-column-rowNumber ng-star-inserted']",
    attackTreeDialogLinkAttackPathPopupLinkThreatCheckbox: "div.mat-mdc-dialog-surface.mdc-dialog__surface input",
    attackTreeDialogLinkAttackPathPopupYesButton: "button:contains('Yes')",

    //Link Vulnerability Popup
    attackTreeDialogLinkVulnerabilityPathPopup: '.mat-mdc-dialog-surface',
    attackTreeDialogLinkVulnerabilityPopupShowAllButton: '.mdc-switch__icons',
    attackTreeDialogLinkVulnerabilityPopupVulnerabilityNumber: "td[class='mat-mdc-cell mdc-data-table__cell cdk-cell cdk-column-rowNumber mat-column-rowNumber ng-star-inserted']",
    attackTreeDialogLinkVulnerabilityPopupLinkThreatCheckbox: "div.mat-mdc-dialog-surface.mdc-dialog__surface input",
    attackTreeDialogLinkVulnerabilityPopupYesButton: "button:contains('Yes')",

    //Component on Canvas
    attackTreeDialogCanvasComponentLogo: '.blockLogo',
    attackTreeDialogCanvasComponentName: '.blockName',
    attackTreeDialogCanvasComponent3Dots: '.moreButton',
    attackTreeDialogCanvasComponentNodeText: '.nodeText',

    //3 dot options
    attackTreeCanvasComponentMenuDropDown: '#blockDropDown',
    attackTreeCanvasComponentMenuNodeTextOption: '.nodeUserText',
    attackTreeCanvasComponentMenuChangeTypeOption: '.changeType',
    attackTreeCanvasComponentMenuDeleteTypeOption: '.deleteNode',
    attackTreeCanvasComponentMenuControlOption: '.addControl',
    attackTreeCanvasComponentMenuLinkChildTreeOption: '.linkChildTree',
    attackTreeCanvasComponentMenuAssignValueOption: '.customFieldOption',

    //Dragging the child component
    attackTreeCanvasDragChildComponentConfirmationDialog: '.cdk-overlay-pane',
    attackTreeCanvasDragChildComponentConfirmationDialogText: '.confirmation-dialog-message',

    //Change Node Type Option
    attackTreeCanvasComponentMenuChangeNodeOROption: '.orOptionType',
    attackTreeCanvasComponentMenuChangeNodeNodeOption: '.nodeOptionType',

    //Apply Attack Tree to Threat 
    attackTreeDialogApplyAttackTreePopup: '.mat-mdc-dialog-surface',
    attackTreeDialogApplyAttackPopupHeading: '.mdc-dialog__title',

    //Control 
    attackTreeCanvasControlPopup: '.mat-mdc-dialog-surface',
    attackTreeCanvasControlPopupHeading: '.global-dialog-title-style',
    attackTreeCanvasControlAddNewControlButton: 'button:contains("+ New Control")',
    attackTreeCanvasControlAddNewControlNameTextarea: 'textarea[class*="mat-mdc-input-element"]',
    attackTreeCanvasControlConfirmButton: 'button:contains("Confirm")',

    //When Control is added, Shield Icon added
    attackTreeCanvasControlShieldIcon: '.controlShieldIcon',
    attackTreeCanvasControlAnimation: '.blockWithAnimation',
    attackTreeCanvasControlPopupHeading: '.global-dialog-title-style'
}