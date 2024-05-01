const navBarSelector = require("../../selectors/navBarSelector");
const path = require('path');
var projectName;

describe('Generate Report Management', () => {
    var projectId;
    var filePath;

    before(() => {//Creating Project
        cy.viewport(1920, 1080);
        cy.login();
        // Generate a random project name
        cy.generateProjectName().then(($generatedName) => {
            projectName = $generatedName;
            filePath = 'cypress/downloads/TARA Report.xlsx';
            cy.createProject(projectName);
        })
        cy.window().then((win) => {
            const newDesignData = JSON.parse(win.localStorage.getItem('newDesign'));
            expect(newDesignData).to.not.be.null;
            expect(newDesignData.project).to.not.be.undefined;
            // Extract the project ID from the nested structure
            projectId = newDesignData.project.id;//projectId to be used 
            expect(projectId).to.not.be.undefined;
            cy.log("Project ID is: " + projectId);
        })
    })

    beforeEach(() => {// Logging in and loading the created project
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.loadProject(projectId);
        })
    })

    it('Verify the "Export" functionality for "Generate report in Excel" (MAIN-TC-1539, MAIN-TC-1773, MAIN-TC-1774, MAIN-TC-2688, MAIN-TC-664, MAIN-TC-665, MAIN-TC-666)', () => {
        cy.generateExcelReport();
        cy.readFile(filePath).should('exist');
    })

    it('Verify the "Export" functionality for "Generate report in Word (MAIN-TC-1540, MAIN-TC-818, MAIN-TC-678)', () => {
        cy.generateWordReport();
    })

    it('Verify the "Select All" option functionality for Generate Report feature (MAIN-TC-1777, MAIN-TC-2687, MAIN-TC-667, MAIN-TC-668, MAIN-TC-669, MAIN-TC-671, MAIN-TC-672, MAIN-TC-673, MAIN-TC-674, MAIN-TC-675, MAIN-TC-678, MAIN-TC-413, MAIN-TC-862)', () => {
        cy.visit(Cypress.env('baseURL') + '/modeling').then(() => { // Go to Library Page 
            cy.wait(2000);
            cy.get(navBarSelector.navBarExportButton).click();  // Go to Feature tab
            cy.get(navBarSelector.exportListGenerateReportButton).should('exist').click();
            cy.get(navBarSelector.generateReportTextDialog).should('exist');
            cy.get(navBarSelector.generateButton).should('not.be.enabled');
            cy.get(navBarSelector.reportTypeFieldButton).click().then(() => {
                cy.get(navBarSelector.reportTypeDropDownOptionList).contains('Microsoft Word').click();
                cy.get(navBarSelector.optionsCheckBox).first().check();
                cy.get(navBarSelector.optionsCheckBox).each(($optionsCheckBox) => {
                    cy.wrap($optionsCheckBox).should('be.checked'); // Assert that each check Box in Generate Report dialog are checked successfully;
                })
            }).then(() => {
                cy.get(navBarSelector.optionsCheckBox).parent().parent().children()// 1st parent is .mdc-checkbox, 2nd is .mdc-form-field, children include label elements
                    .should('include.text', 'Project Risk Chart')
                    .and('include.text', 'Architecture Diagram')
                    .and('include.text', 'High Risk Threats')
                    .and('include.text', 'Vulnerability')
                    .and('include.text', 'All Threats')
                    .and('include.text', 'Assumptions')
                    .and('not.include.text', 'Organizational Risk Chart');
            })
        })
    })

    it('Verify that No Options can be selected in the "Options list" in Generate Report dialog before selecting the Report type (MAIN-TC-2684, MAIN-TC-2682)', () => {
        cy.visit(Cypress.env('baseURL') + '/modeling').then(() => { // Go to Library Page 
            cy.wait(2000);
            cy.get(navBarSelector.navBarExportButton).click();  // Go to Feature tab
            cy.get(navBarSelector.exportListGenerateReportButton).should('exist').click().then(() => {
                cy.get(navBarSelector.generateReportTextDialog).should('exist');
                cy.get(navBarSelector.generateButton).should('not.be.enabled');
                cy.get(navBarSelector.optionsCheckBox).each(($optionsCheckBox) => {
                    cy.wrap($optionsCheckBox).should('be.disabled'); // Assert that each check Box in Generate Report dialog are checked successfully;
                })
            })
            cy.get(navBarSelector.generateReportDialogCancelButton).should('exist').click();
        })
    })
})

describe('CLEANUP: Project Deletion', () => {

    it('delete download folder', () => {
        cy.task("isFileExist", { fileName: `.${path.sep}downloads` }).then(() => {
            cy.deleteDownloadsFolder()
        })
    })

    it('Deleting The Project If Created', () => {
        cy.viewport(1920, 1080);
        cy.login().then(() => {
            cy.deleteProject(projectName);
        })
    })
})
