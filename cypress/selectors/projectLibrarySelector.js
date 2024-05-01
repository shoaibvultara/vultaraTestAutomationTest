module.exports = {
    //side nav bar
    librarySideNavModuleAnchor: 'mat-nav-list > a:contains(Module)',
    librarySideNavFeatureAnchor: 'mat-nav-list > a:contains(Feature)',
    librarySideNavAssetAnchor: 'mat-nav-list > a:contains(Asset)',
    librarySideNavGoalClaimAnchor: 'mat-nav-list > a:contains(Goal & Claim)',
    librarySideNavControlAnchor: 'mat-nav-list > a:contains(Control)',
    librarySideNavRequirementAnchor: 'mat-nav-list > a:contains(Requirement)',
    librarySideNavPolicyAnchor: 'mat-nav-list > a:contains(Policy)',
    librarySideNavAttackActionAnchor: 'mat-nav-list > a:contains(Attack Action)',
    librarySideNavDamageScenarioAnchor: 'mat-nav-list > a:contains(Damage Scenario)',

    //more button drop down options
    libraryMoreOptionsButton: 'button:contains(more_horiz)',
    projectLibraryCreateNewButton: 'button:contains(Create New)',
    linkingDialogShowAllButton: 'button[role="switch"]',
    linkingDialogCheckboxInput: 'input[type="checkbox"]',

    //control library
    moreOptionsLinkedRequirementsButton: 'button:contains(Linked Requirements)',
    moreOptionsDeleteControlButton: 'button:contains(Delete Control)',

    //requirement library
    requirementLibraryDeleteButton: 'button:contains(delete)',
    requirementLibraryDescriptionCell: 'textarea[class*="requirement-page-description"]',
    reqLibraryAddUpdateRequirementDialog: 'add-update-requirement',
    requirementLibraryDeleteIcon: 'mat-icon:contains(delete)',

    //goal library
    cybersecurityGoalTab: 'div[mattablabelwrapper]:contains(Cybersecurity Goal)',
    moreOptionsDeleteGoalButton: 'button:contains(Delete Goal)',
    moreOptionsLinkedControlsButton: 'button:contains(Linked Controls)',
    searchForGoalInput: 'input[placeholder="Search Available Goals"]',

    //claim library
    cybersecurityClaimTab: 'div[mattablabelwrapper]:contains(Cybersecurity Claim)',
    moreOptionsDeleteClaimButton: 'button:contains(Delete Claim)',

    //policy library
    createNewPolicyButton: 'button:contains(Create New Policy)',
    deletePolicyIcon: 'mat-icon:contains(delete)',
    policyNumberTableCell: 'td[class*="mat-column-no"]',
    policyEnabledCheckbox: 'input[type="checkbox"]',
    policyComparisonOperatorSelect: 'mat-form-field:contains(When risk is)',
    //comparison operator options
    policyLibraryLessThanOperator: 'mat-option:contains(less than)',
    policyLibraryLessThanOrEqualToOperator: 'mat-option:contains(less than or equal to)',
    policyLibraryEqualToOperator: 'mat-option:contains(equal to)',
    policyLibraryGreaterThanOrEqualToOperator: 'mat-option:contains(greater than or equal to)',
    policyLibraryGreaterThanOperator: 'mat-option:contains(greater than)',

    //attack action library
    attackActionLibraryDeleteButton: 'mat-icon:contains(delete)',

    //damage scenario library
    damageScenarioLibraryDeleteButton: 'mat-icon:contains(delete)',
}