Test cases under all the pipelines of web services are running in the github-CI/CD environment for continuous testing, whenever the developers make changes and push the code to the main branch, all the test cases will automatically start running. 

Changes Commit in Code —> Code deployment completed —> Automation Suite triggered on Jenkins —> Code deployment started —> Execution for test cases started —> Execution completed —> Jenkins build status shared via Email with reports.

Once developer will push the code.
Automatic Jenkins pipeline will trigger.
Automatically all the code will be cloned for test suite.
Once code clone is completed and all code is available on jenkins.
Following command will execute.
npx cypress run -e user=** ,password=**
Automation suite will start executing.
Once Automation suite is completed we will get html report along with screenshots.
HTML report can be sent to anyone through email.

If you want to set environment variables on Jenkins, follow below steps:
Manage Jenkins -> Configure System -> Global Properties -> Environment Variables -> Add

Once you are on Add screen, 
Add name of variable and value of variable.

For example if I want to use user and password.
My values will be:
Name : user
value: **
Name: password
value: **

Steps to run file in CI mode
npx cypress run -e user=username,password=password

Steps to run file while reading from anyother.
npx cypress run --config-file=config.json
