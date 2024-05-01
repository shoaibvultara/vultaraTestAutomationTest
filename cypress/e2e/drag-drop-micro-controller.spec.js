
describe('Micro-Controller and Common Line Execution Scenarios', () => {

    before(() => {
        cy.clearLocalStorageSnapshot();
    });

    it("Run Micro-Controller and Common Line and Verify Run Api Response", () => {

        //Visit login URL
        const frontEndUrlLocal = Cypress.env("frontEndUrlLocal");
        cy.visit(`${frontEndUrlLocal}/login`);

        //Enter login details and login to app.
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        cy.get('[type="text"]').clear().type(username);
        cy.get('[type="password"]').clear().type(password).type('{enter}');
        // cy.get('[name="userLoginBtn"]').click();

        //Select Project
        //cy.get('button.mat-focus-indicator.quickAccessBtnHorizontalMargin').eq(0).click();
        cy.get('span.mat-button-wrapper').eq(0).click();
        cy.get('[role="menuitem"]').eq(0).click();
        cy.wait(3000);

        //Create new project.
        const d = new Date();
        var string = d.toString();
        // let ProjectID = "";
        var date = string.substr(0, (string.indexOf('G') - 1));
        cy.get('div>input').type("Test_Automation" + date.replace(/ /g, "_"));
        cy.get('span.mat-button-wrapper').eq(15).click();
        //cy.xpath("//button//span[contains(text(),'Create New Project')]").click();

        cy.wait(6000);

        //Drag and Drop Micro-Controller and Common Line
        const dataTransfer = new DataTransfer();
        cy.get('div.sideTools>a.item').eq(0)
            .trigger('dragstart', { dataTransfer, force: true });

        cy.get('#modelViewContent>#drawingCanvas')
            .trigger('drop', { dataTransfer, force: true, clientX: 400, clientY: 400 });

        cy.get('div.sideTools>a.item').eq(0)
            .trigger('dragend', { force: true, clientX: 400, clientY: 400 });

        cy.get('div.sideTools>a.item').eq(0)
            .trigger('dragstart', { dataTransfer, force: true });

        cy.get('#modelViewContent>#drawingCanvas')
            .trigger('drop', { dataTransfer, force: true, clientX: 600, clientY: 500 });

        cy.get('div.sideTools>a.item').eq(0)
            .trigger('dragend', { force: true, clientX: 550, clientY: 550 });


        cy.get('div.sideTools>a.item').eq(2)
            .trigger('dragstart', { dataTransfer, force: true });

        cy.get('#modelViewContent>#drawingCanvas')
            .trigger('drop', { dataTransfer, force: true, clientX: 525, clientY: 400 });

        cy.get('div.sideTools>a.item').eq(2)
            .trigger('dragend', { force: true, clientX: 525, clientY: 400 });

        cy.get('#drawingCanvas>div.micro-container').should('be.visible');
        cy.get('polyline').should('be.visible');

        cy.wait(3000);

        cy.get('circle.lineStartTerminal').realClick().realMouseDown().realMouseMove(-250, 0).get('#drawingCanvas>div.micro-container').eq(0).realMouseUp();
        cy.get('circle.lineEndTerminal').realClick().realMouseDown().realMouseMove(0, 50).get('#drawingCanvas>div.micro-container').eq(1).realMouseUp();

        //Micro-Controller Settings
        cy.get('#drawingCanvas>div.micro-container').eq(0).rightclick();

        cy.get('input#mat-input-0').clear().wait(2000).type("Micro Name Test");

        cy.get('input#matSelectSelectedMicro').click();
        cy.contains('NXP i.MX6 Dual').click();

        cy.get('#mat-select-0').click({ force: true });

        cy.xpath("//*[contains(text(),'ADAS Domain Controller')]").click();

        cy.get('[id=featureSubmitBtn]').eq(0).click();

        cy.xpath("//*[contains(text(),'Add New')]").click();

        cy.get("input#mat-input-2").clear().type("SBOM Product Test");

        cy.get("input#mat-input-3").clear().type("SBOM Vendor Test");

        cy.get(".sbom-property-form > .mat-form-field-type-mat-select > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix").click();

        cy.xpath("//*[contains(text(),'Application')]").click();

        cy.xpath("//span[contains(text(),'Save')]").click();
        cy.wait(3000);

        cy.get('#svgViewBox').rightclick({ force: true });

        //first micro properties assertion
        cy.get('#drawingCanvas>div.micro-container').eq(0).rightclick();

        cy.wait(3000);

        cy.xpath("//*[contains(text(),'Security Settings')]").click();

        cy.get("mat-checkbox#microPhysicalAccessCheckbox").eq(0).click();

        cy.get('#modelViewContent>#drawingCanvas').eq(0).rightclick({ force: true });

        cy.xpath("//*[contains(text(),'Component Spec')]").click();
        cy.wait(3000);

        //Micro-Controller static text assertions
        cy.get(".module-text").invoke("text").then((text) => {
            expect(text).contains("Micro Name Test")
        })

        cy.wait(3000);
        cy.xpath("//*[contains(text(),'Micro Name Test')]").eq(0).invoke("text").then((text) => {
            expect(text).contains("Micro Name Test")
        })

        cy.get('input#matSelectSelectedMicro').clear().type('NXP i.MX6 Dual')

        cy.wait(3000);
        cy.xpath("//*[contains(text(),'NXP i.MX6 Dual')]").invoke("text").then((text) => {
            expect(text).contains("NXP i.MX6 Dual")
        })

        //second micro properties assertion
        cy.get('#drawingCanvas>div.micro-container').eq(1).rightclick();

        cy.get('input#mat-input-15').clear().wait(2000).type("Micro Name Test ");

        cy.get('input#matSelectSelectedMicro').click();
        cy.contains('NXP i.MX6 Dual').click();

        cy.get('.mat-select-placeholder').click({ force: true });

        cy.xpath("//*[contains(text(),'ADAS Domain Controller')]").click();
        
        cy.get('[id=featureSubmitBtn]').eq(0).click();
        cy.xpath("//*[contains(text(),'Add New')]").click();

        cy.get("div.mat-form-field-infix").eq(5).type("SBOM Product Test");

        cy.get("div.mat-form-field-infix").eq(6).type("SBOM Vendor Test");

        cy.get(".sbom-property-form > .mat-form-field-type-mat-select > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix").click();

        cy.xpath("//*[contains(text(),'Application')]").click();

        cy.xpath("//span[contains(text(),'Save')]").click();
        cy.wait(3000);;

        cy.get('#svgViewBox').rightclick({ force: true });

        cy.get('#drawingCanvas>div.micro-container').eq(1).rightclick();

        cy.wait(3000);

        cy.xpath("//*[contains(text(),'Security Settings')]").click();

        cy.get("mat-checkbox#microPhysicalAccessCheckbox").eq(0).click();

        cy.get('#modelViewContent>#drawingCanvas').eq(0).rightclick({ force: true });

        cy.xpath("//*[contains(text(),'Component Spec')]").click();
        cy.wait(3000);

        //Micro-Controller static text assertions
        cy.get(".module-text").invoke("text").then((text) => {
            expect(text).contains("Micro Name Test")
        })

        cy.wait(3000);
        cy.xpath("//*[contains(text(),'Micro Name Test')]").eq(0).invoke("text").then((text) => {
            expect(text).contains("Micro Name Test")
        })

        cy.get('input#matSelectSelectedMicro').clear().type('NXP i.MX6 Dual')

        cy.wait(3000);
        cy.xpath("//*[contains(text(),'NXP i.MX6 Dual')]").invoke("text").then((text) => {
            expect(text).contains("NXP i.MX6 Dual")
        })

        cy.get('#modelViewContent>#drawingCanvas').eq(0).rightclick({ force: true });
        cy.get('#modelViewContent>#drawingCanvas').eq(0).rightclick({ force: true });

        //communication Line Settings
        cy.get('polyline').eq(0).rightclick({ force: true });

        cy.get('div>input.mat-input-element').eq(0).clear().wait(2000).type("Comm Name Test");

        cy.get("div>span.mat-select-placeholder").eq(0).click();

        cy.xpath("//*[contains(text(),'Physical Wire')]").click();
        cy.wait(2000);

        cy.get('mat-select[role="combobox"]').eq(1).click();

        cy.xpath("//*[contains(text(),'Ethernet')]").click();
        cy.wait(5000);

        cy.get('#drawingCanvas>div.micro-container').eq(0).rightclick();

        cy.get('#modelViewContent>#drawingCanvas').eq(0).rightclick({ force: true });
        cy.get('#modelViewContent>#drawingCanvas').eq(0).rightclick({ force: true });

        cy.get("span.mat-button-wrapper").eq(9).click();
        cy.wait(2000);

        //Local Storage NewDesgin Assertions

        cy.getLocalStorage("newDesign").then(response => {
            const newDesign = JSON.parse(response);
            let microController= newDesign.micro
            
            for (let i = 0; i < microController.length; i++) {
            
            expect(microController[i].manufacturerName).eq("NXP");
            expect(microController[i].model).contains("i.MX6 Dual")
            expect(microController[i].module).eq("ADAS Domain Controller")
            expect(microController[i].featureConfirmed).eq(true)
            expect(microController[i].type).eq("micro")
            expect(microController[i].sbom[0].cpe23).eq("cpe:2.3:a:sbom_vendor_test:sbom_product_test:*:*:*:*:*:*:*:*")
            expect(microController[i].sbom[0].product).eq("sbom_product_test")
            expect(microController[i].sbom[0].part).eq("a")
            expect(microController[i].sbom[0].vendor).eq("sbom_vendor_test")
            expect(microController[i].attackSurface).eq(true)
            expect(microController[i].lineId[0]).eq(newDesign.commLine[0].id)
            expect(newDesign.commLine[0].nickName).contains("Comm Name Test")
            expect(newDesign.commLine[0].transmissionMedia).eq("physicalWire")
            expect(newDesign.commLine[0].baseProtocol).eq("Ethernet")
            expect(newDesign.commLine[0].terminalComponentId[i]).eq(microController[i].id)

            }
        //removing of the second micro
        cy.get('#drawingCanvas>div.micro-container').eq(1).rightclick();
        cy.get('#microRemoveBtn > .mat-button-wrapper').click();
        cy.get('.mat-dialog-actions > .mat-warn > .mat-button-wrapper').click();
        cy.get("span.mat-button-wrapper").eq(9).click();

        cy.wait(10000);


        })
        const appServerLocalRootHttpUrl = Cypress.env("appServerLocalRootHttpUrl");
        //Intercept Apis and Assertions
        cy.intercept('POST', `${appServerLocalRootHttpUrl}/projects/run`).as('runApi');
        // cy.intercept('GET', `${appServerLocalRootHttpUrl}/user/auth`).as('authApi');
        // cy.intercept('GET', `${appServerLocalRootHttpUrl}/config/systemconfig`).as('systemConfig');
        cy.intercept('POST', `${appServerLocalRootHttpUrl}/projects/projectDb`).as('projectApi');

        cy.get("span.mat-button-wrapper").eq(9).click();


        cy.wait('@projectApi').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            let projectResponseData = response.body;
            let projectId = projectResponseData.projectId



            //Save Project button click
            cy.get("span.mat-button-wrapper").eq(10).click();

            //Run and Result Api Assertions
            let runResponseData = "";

            cy.wait('@runApi').then(({ response }) => {
                expect(response.statusCode).to.eq(200);
                runResponseData = response.body;

            })

            cy.intercept('GET', `${appServerLocalRootHttpUrl}/projects/threatsDb?id=${projectId}&page=1&order=&filter=undefined&search=null&searchFlag=undefined`).as('threatApi');

            cy.wait('@threatApi').then(({ response }) => {
                expect(response.statusCode).to.eq(200);
                let threatCollection = response.body.threats;
                // cy.getLocalStorage("result").then(results => {
                //     const result = JSON.parse(results);
                for (let i = 0; i < threatCollection.length; i++) {

                    expect(threatCollection[i].MITM).eq(runResponseData[i].MITM);
                    // expect(threats[i].appProtocol).eq(runResponseData[i].appProtocol)
                    expect(threatCollection[i].asset).eq(runResponseData[i].asset)
                    expect(threatCollection[i].assetId).eq(runResponseData[i].assetId)
                    expect(threatCollection[i].assetType).eq(runResponseData[i].assetType)
                    expect(threatCollection[i].attackFeasibility).eq(runResponseData[i].attackFeasibility)
                    expect(threatCollection[i].attackFeasibilityAttackVector).eq(runResponseData[i].attackFeasibilityAttackVector)
                    expect(threatCollection[i].attackFeasibilityCVSSComplexity).eq(runResponseData[i].attackFeasibilityCVSSComplexity)
                    expect(threatCollection[i].attackFeasibilityCVSSPrivilege).eq(runResponseData[i].attackFeasibilityCVSSPrivilege)
                    expect(threatCollection[i].attackFeasibilityCVSSUser).eq(runResponseData[i].attackFeasibilityCVSSUser)
                    expect(threatCollection[i].attackFeasibilityCVSSVector).eq(runResponseData[i].attackFeasibilityCVSSVector)
                    expect(threatCollection[i].attackFeasibilityElapsed).eq(runResponseData[i].attackFeasibilityElapsed)
                    expect(threatCollection[i].attackFeasibilityEquipment).eq(runResponseData[i].attackFeasibilityEquipment)
                    expect(threatCollection[i].attackFeasibilityExpertise).eq(runResponseData[i].attackFeasibilityExpertise)
                    expect(threatCollection[i].attackFeasibilityKnowledge).eq(runResponseData[i].attackFeasibilityKnowledge)
                    expect(threatCollection[i].attackFeasibilityLevel).eq(runResponseData[i].attackFeasibilityLevel)
                    expect(threatCollection[i].attackFeasibilityWindow).eq(runResponseData[i].attackFeasibilityWindow)
                    expect(threatCollection[i].attackPath[0]).eq(runResponseData[i].attackPath[0])
                    expect(threatCollection[i].attackPathName).eq(runResponseData[i].attackPathName)
                    expect(threatCollection[i].attackSurface).eq(runResponseData[i].attackSurface)
                    expect(threatCollection[i].attackSurfaceSensorInput).eq(runResponseData[i].attackSurfaceSensorInput)
                    expect(threatCollection[i].baseProtocol).eq(runResponseData[i].baseProtocol)
                    expect(threatCollection[i].componentId).eq(runResponseData[i].componentId)
                    expect(threatCollection[i].cybersecurityClaim).eq(runResponseData[i].cybersecurityClaim)
                    expect(threatCollection[i].damageScenario).eq(runResponseData[i].damageScenario)
                    expect(threatCollection[i].endOfChainModuleIdInDb).eq(runResponseData[i].endOfChainModuleIdInDb)
                    expect(threatCollection[i].featureRole).eq(runResponseData[i].featureRole)
                    expect(threatCollection[i].featureType).eq(runResponseData[i].featureType)
                    expect(threatCollection[i].fromFeature).eq(runResponseData[i].fromFeature)
                    expect(threatCollection[i].fromFeatureId).eq(runResponseData[i].fromFeatureId)
                    // expect(threatCollection[i].fromFeatureIndex).eq(runResponseData[i].fromFeatureIndex)
                    expect(threatCollection[i].highlight).eq(runResponseData[i].highlight)
                    expect(threatCollection[i].id).eq(runResponseData[i].id)
                    expect(threatCollection[i].impactF).eq(runResponseData[i].impactF)
                    expect(threatCollection[i].impactFLevel).eq(runResponseData[i].impactFLevel)
                    expect(threatCollection[i].impactO).eq(runResponseData[i].impactO)
                    expect(threatCollection[i].impactOLevel).eq(runResponseData[i].impactOLevel)
                    expect(threatCollection[i].impactOriginCompAssFea[0]).eq(runResponseData[i].impactOriginCompAssFea[0])
                    expect(threatCollection[i].impactOriginCompAssFea[1]).eq(runResponseData[i].impactOriginCompAssFea[1])
                    expect(threatCollection[i].impactOriginCompAssFea[2]).eq(runResponseData[i].impactOriginCompAssFea[2])
                    expect(threatCollection[i].impactP).eq(runResponseData[i].impactP)
                    expect(threatCollection[i].impactPLevel).eq(runResponseData[i].impactPLevel)
                    expect(threatCollection[i].impactS).eq(runResponseData[i].impactS)
                    expect(threatCollection[i].impactSLevel).eq(runResponseData[i].impactSLevel)
                    expect(threatCollection[i].isExpanded).eq(runResponseData[i].isExpanded)
                    expect(threatCollection[i].module).eq(runResponseData[i].module)
                    expect(threatCollection[i].moduleId).eq(runResponseData[i].moduleId)
                    expect(threatCollection[i].moduleIdInDb).eq(runResponseData[i].moduleIdInDb)
                    expect(threatCollection[i].nickName).eq(runResponseData[i].nickName)
                    expect(threatCollection[i].notes).eq(runResponseData[i].notes)
                    expect(threatCollection[i].reviewStatusForFilter).eq(runResponseData[i].reviewStatusForFilter)
                    expect(threatCollection[i].reviewed).eq(runResponseData[i].reviewed)
                    // expect(threatCollection[i].riskLevel).eq(runResponseData[i].riskLevel)
                    expect(threatCollection[i].riskScore).eq(runResponseData[i].riskScore)
                    // expect(threatCollection[i].secureProtocol).eq(runResponseData[i].secureProtocol)
                    expect(threatCollection[i].securityPropertyCia).eq(runResponseData[i].securityPropertyCia)
                    expect(threatCollection[i].securityPropertyStride).eq(runResponseData[i].securityPropertyStride)
                    expect(threatCollection[i].subType).eq(runResponseData[i].subType)
                    expect(threatCollection[i].threatFeaLibAdvId).eq(runResponseData[i].threatFeaLibAdvId)
                    expect(threatCollection[i].threatRowNumber).eq(runResponseData[i].threatRowNumber)
                    expect(threatCollection[i].threatRuleEngineId).eq(runResponseData[i].threatRuleEngineId)
                    expect(threatCollection[i].threatScenario).eq(runResponseData[i].threatScenario)
                    expect(threatCollection[i].threatSource).eq(runResponseData[i].threatSource)
                    expect(threatCollection[i].transmissionMedia).eq(runResponseData[i].transmissionMedia)
                    expect(threatCollection[i].treatment).eq(runResponseData[i].treatment)
                    expect(threatCollection[i].treatmentVal).eq(runResponseData[i].treatmentVal)
                    expect(threatCollection[i].type).eq(runResponseData[i].type)
                    expect(threatCollection[i].validateStatusForFilter).eq(runResponseData[i].validateStatusForFilter)
                }
                // })
            })
        })


        // //Auth Api Status Code Assertions
        // cy.wait('@authApi').then(({ response }) => {
        //     expect(response.statusCode).to.eq(200)
        // })

        // //System Config Status code Assertions
        // cy.wait('@systemConfig').then(({ response }) => {
        //     expect(response.statusCode).to.eq(200)
        // })

        //Add New Threat
        cy.wait(5000);

        cy.xpath("//*[contains(text(),'more_horiz')]").eq(3).click();

        cy.xpath("//*[contains(text(),'Add New Threat')]").click();
        //cy.get('input[type="number"]').eq(4).type(9);
        cy.wait(2000);
        cy.get('textarea[property="asset"]').eq(4).type('Threat Asset Test');
        cy.get('.threatUpdateIcon').click();
        cy.get('mat-select[role="combobox"]').eq(4).click();
        cy.get('span[class="mat-option-text"]').eq(0).click();
        cy.get('textarea[property="threatScenario"]').eq(4).type("Threat Scenario Test");
        cy.get('.threatUpdateIcon').click();
        cy.get('textarea[property="attackPathName"]').eq(4).type("Threat Attack Path Test");
        cy.get('.threatUpdateIcon').click();
        cy.get('textarea[property="damageScenario"]').eq(4).type("Threat Damage Scenario Test");
        cy.get('.threatUpdateIcon').click();
        cy.get('td[role="gridcell"]>button').eq(8).click();

        cy.get('select.attack-feasibility').eq(0).select(0);

        cy.get('select.attack-feasibility').eq(1).select(1);

        cy.get('select.attack-feasibility').eq(2).select(2);

        cy.get('select.attack-feasibility').eq(3).select(2);

        cy.get('select.attack-feasibility').eq(4).select(3);

        cy.get('select.risk-impact-notreatment-container').eq(0).select(0);

        cy.get('select.risk-impact-notreatment-container').eq(1).select(1);

        cy.get('select.risk-impact-notreatment-container').eq(2).select(2);

        cy.get('select.risk-impact-notreatment-container').eq(3).select(3);

        // cy.get('textarea[id="notesTextArea"]').type("Notes Test");
        cy.get('.notes-column > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click().type("Notes Test");
        cy.get('.threatUpdateIcon').click();
        cy.get("span.mat-button-wrapper").eq(9).click();

        cy.wait(3000);
        //NewThreat validation
        cy.getLocalStorage("result").then(results => {
            const result = JSON.parse(results);

            // expect(result[4].threatRowNumber).eq(99);
            expect(result[4].asset).eq("Threat Asset Test");
            expect(result[4].securityPropertyCia).eq("c");
            expect(result[4].threatScenario).eq("Threat Scenario Test");
            expect(result[4].attackPathName).eq("Threat Attack Path Test");
            expect(result[4].damageScenario).eq("Threat Damage Scenario Test");
            expect(result[4].attackFeasibility).eq(23);
            expect(result[4].attackFeasibilityElapsed).eq(0);
            expect(result[4].attackFeasibilityEquipment).eq(9);
            expect(result[4].attackFeasibilityExpertise).eq(3);
            expect(result[4].attackFeasibilityKnowledge).eq(7);
            expect(result[4].attackFeasibilityLevel).eq("Low");
            expect(result[4].attackFeasibilityWindow).eq(4);
            expect(result[4].impactF).eq(1);
            expect(result[4].impactFLevel).eq("Major");
            expect(result[4].impactO).eq(1);
            expect(result[4].impactOLevel).eq("Moderate");
            expect(result[4].impactP).eq(1);
            expect(result[4].impactPLevel).eq("Negligible");
            expect(result[4].impactS).eq(1);
            expect(result[4].impactSLevel).eq("Severe");
            expect(result[4].riskLevel).eq(3);
            expect(result[4].notes).eq("Notes Test");
        })
    })
})