\c employee_db;

SELECT 
    department.id AS department_id,
    department.name AS department,
    role.id AS role_id,
    role.title AS title,
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