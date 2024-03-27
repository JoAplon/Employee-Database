// Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const { error } = require('console');

const options = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Update an employee role',
    'Exit'
];

function promptUser() {
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Pick from the following options.',
        choices: options
    }).then((answer) => {
        console.log(`You chose: ${answer.choice}`);
// removes the selected option from the array
        const index = options.indexOf(answer.choice)
        if (index !== -1) {
            options.splice(index, 1);
        }

        if (answer.choice !== 'Exit') {
            promptUser();
        } else {
            console.log('Exiting the application.')
        }
    });
}
promptUser();

    // // TODO: Create a function to write README file
    // .then((data) => {
    //     const readmeContent = generateMarkdown({
    //         title: data.title,
    //         description: data.description,
    //         installation: data.installation,
    //         usage: data.usage,
    //         license: data.license,
    //         contributing: data.contributing,
    //         tests: data.tests,
    //         questions: data.questions,
    //         email: data.email
    //     });

    //     fs.writeFile('README.md', readmeContent, (error) => {
    //         if (error) {
    //             console.log(error)
    //         } else {
    //             console.log('README.md file has been created!')
    //         }
    //     });
    // })
    // .catch((error) => {
    //     console.error(error);
    // });
