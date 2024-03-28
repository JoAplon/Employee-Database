\c employee_db;

SELECT 
    department.id AS department_id,
    department.name AS department,
    role.id AS role_id,
    role.title AS role_title,
    role.salary,
    employee.first_name,
    employee.last_name,
    employee.role_id,
    employee.manager_id
FROM 
    employee
JOIN 
    role ON employee.role_id = role.id
JOIN 
    department ON role.department_id = department.id;

-- Shows employee full name, role, salary, department, and manager
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


-- Only shows role, department, and salary
SELECT 
    role.title AS role_title,
    role.salary,
    department.name AS department
FROM 
    employee
JOIN 
    role ON employee.role_id = role.id
JOIN 
    department ON role.department_id = department.id;