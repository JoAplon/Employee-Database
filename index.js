// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const { error } = require('console');
// TODO: Create an array of questions for user input

inquirer
    .prompt([
        {
            // Title for project
            type: 'list',
            name: 'title',
            message: 'Pick from the Following Options:',
            choices: [
                
                    'View all departments',
                    'View all roles',
                    'view all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',                
            ]
        },
        {
            // Description for project
            type: 'input',
            name: 'description',
            message: 'Enter the description of your project:',
        },
        {
            // Installation directions
            type: 'input',
            name: 'installation',
            message: 'Enter the installation instructions for your project:',
        },
        {
            // Uses for project
            type: 'input',
            name: 'usage',
            message: 'Enter the usage information for your project:',
        },
        {
            // Contributers
            type: 'input',
            name: 'contributing',
            message: 'Enter the contribution guidlines for your project:',
        },
        {
            // How to test the application
            type: 'input',
            name: 'tests',
            message: 'Enter the test instructions for your project:',
        },
        {
            // Applying a license
            type: 'list',
            name: 'license',
            message: 'Choose a license for your project:',
            choices: [
                {
                    name: 'MIT',
                    value: 'MIT'
                }
            ]
        },
        {
            // Questions about the project
            type: 'input',
            name: 'questions',
            message: 'Enter your github username.',
            validate: function (answer) {
                if (answer.length < 1) {
                    return console.log('You must enter a valid username.');
                }
                return true;
            }
        },
        {
            // Questions about the project
            type: 'input',
            name: 'email',
            message: 'Enter your email address.',
            validate: function (answer) {
                if (answer.length < 1) {
                    return console.log('You must enter a valid email.');
                }
                return true;
            }
        },
    ])

    // TODO: Create a function to write README file
    .then((data) => {
        const readmeContent = generateMarkdown({
            title: data.title,
            description: data.description,
            installation: data.installation,
            usage: data.usage,
            license: data.license,
            contributing: data.contributing,
            tests: data.tests,
            questions: data.questions,
            email: data.email
        });

        fs.writeFile('README.md', readmeContent, (error) => {
            if (error) {
                console.log(error)
            } else {
                console.log('README.md file has been created!')
            }
        });
    })
    .catch((error) => {
        console.error(error);
    });
