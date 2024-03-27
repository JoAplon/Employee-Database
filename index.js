// Include packages needed for this application
const inquirer = require('inquirer');
const { Pool } = require('pg');
const fs = require('fs');
const { error } = require('console');

const pool = new Pool(
    {
        // TODO: Enter PostgreSQL username
        user: 'postgres',
        // TODO: Enter PostgreSQL password
        password: 'password',
        host: 'localhost',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);
pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Error connecting to database', err.stack));


function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the new department:'
    }).then((answer) => {
        // function to add department with sql
        const query = 'INSERT INTO department (name) VALUES ($1)';
        const values = [answer.departmentName];
        pool.query(query, values, (err, res) => {
            if (err) {
                console.err('Error adding department:', err.stack);
            } else {
                console.log(`Department "${answer.departmentName}"added!`);
            }
        })
        promptUser();
    });
}


function addRole() {
    inquirer.prompt({
        type: 'input',
        name: 'roleName',
        message: 'Enter the new role:'
    }).then((answer) => {
        // function to add role with sql
        console.log(`Role "${answer.roleName}"added!`);
        promptUser();
    });
}


function addEmployee() {
    const roles = [
        'Publishing Oversight',
        'Lead Editor',
        'Legal Head',
        'Managing Staff',
        'Sales Lead'
    ];
    const managerId = [
        1,
        2,
        3,
        4,
        5,
        NULL
    ];

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
                    console.log('Please enter a first name.');
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
                    console.log('Please enter a last name.');
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
                if (addRole || NULL) {
                    return true;
                } else {
                    console.log('Please choose a role.');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'manager',
            message: "Enter employee's manager id.",
            choices: managerId,
            validate: addmanagerId => {
                if (addmanagerId || NULL) {
                    return true;
                } else {
                    console.log('Please enter an id.');
                    return false;
                }
            }
        }
    ]).then(answer => {
        console.log('Employee added!');
        promptUser();
    });
}

function updateEmployeeRole() {
    const query = 'SELECT id, CONCAT(first_name, last_name) AS full_name FROM employees';
    pool.query(query, (err, res) => {
        if (err) {
            console.err('Error fetching employee:', err.stack);
            promptUser();
        } else {
            const employeeChoices = res.rows.map(employee => ({
                name: employee.full_name,
                value: employee.id
            }));

            inquirer.prompt({
                type: 'list',
                name: 'employee',
                message: 'Select the employee to update:',
                choices: employeeChoices
            }).then(answer => {
                const employee = answer.employee;
                inquirer.prompt({
                    type: 'list',
                    name: 'newRole',
                    message: 'Pick the new role:',
                    choices: ['First Name', 'Last Name', 'Role', 'Manager']
                }).then(newRoleAnswer => {
                    const newRole = roleAnswer.newRole;
                    const updateQuery = 'UPDATE employee SET role = $1 WHERE id = $2';
                    const values = [newRole, employeeId];
                    pool.query(updateQuery, values, (err, result) => {
                        if (err) {
                            console.err('Error updating role:', err.stack);
                        } else {
                            console.log('Role updated successfuly!');
                        }
                        promptUser();
                    });
                });
            });
        }
    });
}

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
            addDepartment();
        } else if (answer.choice === 'Add a role') {
            addRole();
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


promptUser();
