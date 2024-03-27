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

        if (answer.choice === 'Add a department') {
            addData('department', 'Enter the name of the department:', 'Department');
        } else if (answer.choice === 'Add a role') {
            addData('role', 'Enter the title of the role:', 'Role');
        } else if (answer.choice === 'Add an employee') {
            addEmployee();
        } else if (answer.choice === 'Update an employee role') {
            updateEmployeeRole();
        } else if (answer.choice !== 'Exit') {
            promptUser();
        } else {
            console.log('Exiting the application.')
        }
    });
}


// function addDepartment() {
//     inquirer.prompt({
//         type: 'input',
//         name: 'departmentName',
//         message: 'Enter the new department:'
//     }).then((answer) => {
//         // function to add department with sql
//         console.log(`Department "${answer.departmentName}"added!`);
//         promptUser();
//     });
// }

function addEmployee() {
    const roles = [
        'Publishing Oversight',
        'Lead Editor',
        'Legal Head',
        'Managing Staff',
        'Sales Lead'
    ]
    // function to add employee
    inquirer.prompt([
    {
        type: 'input',
        name: 'firstName',
        message: "Enter employee's first name.",
        validate: addFirstName => {
            if (addFirstName) {
                return true;
            } else {
                console.log('Please enter a name.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'lastName',
        message: "Enter employee's last name.",
        validate: addLastName => {
            if (addLastName) {
                return true;
            } else {
                console.log('Please enter a name.');
                return false;
            }
        }
    },
    {
        type: 'list',
        name: 'role',
        message: "Enter employee's role.",
        choices: roles,
        validate: addRole => {
            if (addRole) {
                return true;
            } else {
                console.log('Please choose a role.');
                return false;
            }
        }
    }
    ])
    console.log('Employee added!');
    promptUser();

}

promptUser();
