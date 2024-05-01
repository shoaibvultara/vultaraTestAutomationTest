module.exports = {
    modelingViewCanvas: '[id=drawingCanvas]',//drawing canvas(board)

    componentLibraryMicrocontroller: 'a[id=microcontroller]',//microcontroller image
    componentLibraryModule: '[id=generalModule]',//module image
    componentLibraryCommunicationLine: '[id=communicationPolyline]',//communication line image
    componentLibrarySensorInput: '[id="sensorInput"]',//sensor input component
    componentLibraryUserAttacker: '[id=userAttacker]',//User/Attacker image
    componentLibraryModuleBoundary: '[id="moduleBoundary"]',//module boundary component
    componentLibraryDfdProcess: '[id=process]',//DFD-process
    componentLibraryFloatingBar: 'div[id="floating-bar"]',
    componentLibraryMemoryChip: 'a[id="memory"]',

    modelingViewMilestoneNameDiv: 'div[class="floating-save-panel ng-star-inserted"]',
    modelingViewProjectNameDiv: '#modelViewContent > div.floating-save-panel.project-name-and-save-button-container',//project name
    modelingViewSaveIcon: 'mat-icon:contains("save")',//save icon
    modelingViewComponentSettingsTab: 'div[class*="mat-mdc-tab-body-content"]',

    drawingCanvasMicrocontroller: '#drawingCanvas > .micro-container',//created microcontroller
    drawingCanvasModule: '#drawingCanvas > .control-unit-container',//created module
    drawingCanvasCommunicationLine: 'polyline',//created module
    drawingCanvasLineStartCircle: 'circle.lineStartTerminal',//start point(circle) of communication line
    drawingCanvasLineEndCircle: 'circle.lineEndTerminal',//end point(circle) of communication line
    drawingCanvasModuleText: 'text[class="module-text"]',//module name
    drawingCanvasSensorInput: 'line[class="commLine"]',//created sensor input
    drawingCanvasSensorInputProtocolTextOCHV: 'text:contains(Optical Camera Human Vision)',//protocol text above the sensor input

    componentSpecComponentNameInput: 'input[formcontrolname="formLimit"]',//component name input field
    componentSpecComponentModelInput: '[id=matSelectSelectedMicro]',//
    propertyPanelModelingResultTab: 'div[role="tab"]:contains(Modeling Results)',
    propertyPanelModelingResultTabPaginator: 'div.mat-mdc-paginator-range-label',
    propertyPanelModelingResultTabTableRow: 'tr[mattooltipclass="modelingResultInfoTooltip"]',

    communicationLineSpecNameInput: 'input[formcontrolname=formLimit]',
    communicationLineSpecTransmissionSelect: '[id=transmission-media-field]',
    communicationLineSpecBaseProtocolSelect: '[id=base-protocol-field]',

    transmissionMediaPhysicalWireOption: 'mat-option[ng-reflect-value=physicalWire]',
    transmissionMediaLogicalLineOption: 'mat-option[ng-reflect-value=logicalLine]',
    transmissionMediaShortRangeWirelessOption: 'mat-option[ng-reflect-value=shortWireless]',

    baseProtocolLogicalLineOption: 'mat-option[ng-reflect-value="Logical Line"]',
    baseProtocolBluetoothOption: 'mat-option[ng-reflect-value="Bluetooth"]',
    baseProtocolBluetoothLeOption: 'mat-option[ng-reflect-value="Bluetooth LE"]',

    moduleSelectBatteryOption: 'mat-option[ng-reflect-value=Battery]',

    // Security Setting tab
    securitySettingTab: 'span.mdc-tab__text-label:contains("Security Settings")',  // Security Settings tab in modeling view
    assetComponentSearchBox: 'input[placeholder="New asset..."]',  // Assets in the Components Search Box
    assetComponentSpinner: '.mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left',  // Asset Component Spinner in Security Settings tab
    assetComponentDropdownList: 'mat-option[role="option"]',  // Assets Dropdown list in the Components Search Box
    assetPropertiesFeatureButtonField: 'mat-label:contains(Feature)',  // Feature Field Button in Asset Properties Dialog
    assetPropertiesFeatureDropdownList: 'mat-option' ,  // Feature Field Dropdown List in Asset Properties Dialog
    assetPropertiesConfirmButton: 'button:contains(Confirm)',  // Confirm button in Asset Properties Dialog
    assetComponentContentTextArea: 'div[role="presentation"]',  // Assets in the Component Content Text Area

    componentSpecFeatureSettingsModuleSelect: 'mat-select[role="combobox"]',
    componentSpecFeatureSettingsModuleTextarea: 'textarea[role="combobox"]',
    componentSpecFeatureSettingsModuleTestOption: '[id=mat-option-3]',
    componentSpecFeaturesSettingsFeaturesSelect: 'input[id="microFeatureInput"]',
    componentSpecFeaturesSettingsFeaturesDropdownList: 'mat-option' ,
    addFeatureRoleFieldButton: 'mat-label:contains(Feature Role)',
    addFeatureRoleDropdownList: 'mat-option',
    addFeatureConfirmButton: 'button:contains(Confirm)', 
    componentSpecFeatureSettingTestOption: 'mat-option[ng-reflect-value=Tested]',
    componentSpecFeatureSettingFrontFacingCameraOption: 'mat-option[ng-reflect-value="Front Facing Camera"]',
    componentSpecFeatureSettingsSubmitButton: 'button:contains("Confirm Features")',
    componentSpecFeatureDropDownArrow: '.accessibleFeatureContent > .featureDirection > mat-icon:contains(arrow_drop_down)',
    componentSpecFeatureSettingsFeatureChainButton: 'button:contains(Feature Chain)',
    componentSpecFeatureSettingsFeatureChip: 'mat-chip-row',
    componentSpecSensorInputMediaLabel: 'label:contains("Sensor Input Media (Required)")',
    componentSpecSensorInputTypeLabel: 'label:contains("Sensor Input Type (Required)")',
    componentSpecSensorInputMediaShortRange: 'mat-option:contains(Short-Range Contactless)',
    componentSpecSensorInputTypeOCHV: 'mat-option:contains(Optical Camera Human Vision)',
    componentSpecSensorDisplayProtocolLabel: 'label:contains(Display protocol text)',

    componentSpecRemoveMicroButton: 'button:contains("Remove Micro")',//right bar remove button
    componentSpecRemoveModuleButton: 'button:contains("Remove Module")',//right bar remove button
    componentSpecRemoveLineButton: 'button:contains("Remove Communication Line")',//right bar remove button

    componentSpecSoftwareBomLabel: 'mat-label:contains(Component SBOM...)',
    componentSpecSoftwareBomOption: 'mat-option',
    componentSpecSoftwareBomChipDialog: 'mat-chip-grid',

    communicationLineAccessibleFeatureComponent: 'h3.micro-chip-span',
    communicationLineRemoteDiagnosticsLabel: 'label:contains(Remote Diagnostics)',
    communicationLineEthernetCommunicationLabel: 'label:contains(Ethernet Communication)',
    communicationLineAntiSlipRegulationLabel: 'label:contains(Anti-Slip Regulation)',
    communicationLineSoftwareUpdateLabel: 'label:contains(Software Update)',
    communicationLineAutoEmergencyBrakeLabel: 'label:contains(Automatic Emergency Brake)',
    communicationLineLaneDepartureAlertMessageLabel: 'label:contains(Lane Departure Alert message)',
    communicationLineLaneDepartureAlertSwCodeLabel: 'label:contains(Lane Departure Alert Software code)',
    communicationLineLaneDepartureAlertSwProcessLabel: 'label:contains(Lane Departure Alert Software process)',

    modelingViewSnackBar: '.mat-mdc-snack-bar-label'//message snack bar
}