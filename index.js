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
                console.error('Error adding department:');
            } else {
                console.log(`Department "${answer.departmentName}"added!`);
            }

        })
        promptUser();
    });
}

// Shows all the departments with id's in table form
function showDepartments() {
    const query = 'SELECT * FROM department';
    pool.query(query, (err, res) => {
        if (err) {
            console.error('Error fetching departments', err.stack);
        } else {
            console.log('All departments:');
            console.table(res.rows);
        }
        promptUser();
    });
}

// Shows all the role titles with id's, and salaries in table form
function showRoles() {
    const query = `
SELECT 
    role.id AS role_id,
    role.title AS role_title,
    role.salary,
    department.name AS department
FROM 
    employee
JOIN 
    role ON employee.role_id = role.id
JOIN 
    department ON role.department_id = department.id;
`;
    pool.query(query, (err, res) => {
        if (err) {
            console.error('Error fetching roles', err.stack);
        } else {
            console.log('All roles:');
            console.table(res.rows);
        }
        promptUser();
    });
}

// Shows all the employee's with id's, role titles, department,managers, and salaries in table form
function showEmployees() {
    const query = `
SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title AS role_title,
    role.salary,
    department.name AS department
FROM 
    employee
JOIN 
    role ON employee.role_id = role.id
JOIN 
    department ON role.department_id = department.id;
`;
    pool.query(query, (err, res) => {
        if (err) {
            console.error('Error fetching employees', err.stack);
        } else {
            console.log('All employees:');
            console.table(res.rows);
        }
        promptUser();
    });
}


function addRole() {
    const departmentQuery = 'SELECT id, name FROM department';
    pool.query(departmentQuery, (departmentErr, departmentRes) => {
        if (departmentErr) {
            console.error('Error fetching departments');
            promptUser();
            return;
        }
        const departments = departmentRes.rows.map(row => ({
            name: row.name,
            value: row.id
        }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'Enter the new role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the new salary:'
            },
            {
                type: 'list',
                name: 'departmentName',
                message: 'Enter the department:',
                choices: departments,
            },
        ]).then((answer) => {
            // function to add role with sql
            const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
            const values = [answer.roleName, answer.salary, answer.departmentName];
            pool.query(query, values, (err, res) => {
                if (err) {
                    console.error('Error adding role:', err.stack);
                } else {
                    console.log(`Role "${answer.roleName}" added!`);
                    showRoles();

                }
                promptUser();
            });
        });
    });
}

function addEmployee() {
    const roleQuery = 'SELECT title FROM role';
    pool.query(roleQuery, (err, res) => {
        if (err) {
            console.error('Error fetching roles.');
            promptUser();
        }

        const roles = res.rows.map(row => row.title);

        const employeeQuery = 'SELECT CONCAT(first_name, last_name) AS full_name FROM employee';
        pool.query(employeeQuery, (err, res) => {
            if (err) {
                console.error('Error fetching employees:');
                promptUser();
            }

            const employees = res.rows.map(row => row.full_name);


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
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Select the employee's manager.",
                    choices: employees.concat('None'),
                }
            ]).then(answer => {
                const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
                const values = [answer.firstName, answer.lastName, answer.role, answer.manager];
                pool.query(query, values, (err, res) => {
                    if (err) {
                        console.error('Error adding employee:');
                    } else {
                        console.log('Employee added!');
                    }
                    promptUser();
                });
            });
        });
    });
}


function updateEmployeeRole() {
    const query = 'SELECT id, CONCAT(first_name, last_name) AS full_name FROM employee';
    pool.query(query, (err, res) => {
        if (err) {
            console.error('Error fetching employee:', err.stack);
            promptUser();
        } else {
            const employeeChoices = res.rows.map(employee => ({
                name: employee.full_name,
                value: employee.id
            }));

            inquirer.prompt({
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee to update:',
                choices: employeeChoices
            }).then(answer => {
                const employeeId = answer.employeeId;
                const roleQuery = 'SELECT id, title FROM role';
                pool.query(roleQuery, (err, res) => {
                    if (err) {
                        console.error('Error fetching roles:');
                        promptUser();
                        return;
                    }
                    const roleChoices = res.rows.map(role => ({
                        name: role.title,
                        value: role.id
                    }));

                    inquirer.prompt({
                        type: 'list',
                        name: 'newRoleId',
                        message: 'Pick the new role:',
                        choices: roleChoices
                    }).then(newRoleAnswer => {
                        const newRoleId = newRoleAnswer.newRoleId;
                        const updateQuery = 'UPDATE employee SET role = $1 WHERE id = $2';
                        const values = [newRoleId, employeeId];
                        pool.query(updateQuery, values, (err, result) => {
                            if (err) {
                                console.error('Error updating role:');
                            } else {
                                console.log('Role updated successfuly!');
                            }
                            promptUser();
                        });
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
    inquirer
        .prompt({
            type: 'list',
            name: 'choice',
            message: 'Pick from the following options.',
            choices: options
        })
        .then((answer) => {
            console.log(`You chose: ${answer.choice}`);

            if (answer.choice === 'Add a department') {
                addDepartment();
            } else if (answer.choice === 'Add a role') {
                addRole();
            } else if (answer.choice === 'Add an employee') {
                addEmployee();
            } else if (answer.choice === 'Update an employee role') {
                updateEmployeeRole();
            } else if (answer.choice === 'View all departments') {
                showDepartments();
            } else if (answer.choice === 'View all roles') {
                showRoles();
            } else if (answer.choice === 'View all employees') {
                showEmployees();
            } else if (answer.choice === 'Exit') {
                console.log('Exiting the application.')
                return;
            } else {
                console.log('Invalid choice!')
            }
        });
}


promptUser();
