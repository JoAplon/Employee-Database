INSERT INTO department (department_name)
VALUES('Publishing'),
    ('Editorial'),
    ('Legal'),
    ('Managing'),
    ('Sales');

INSERT INTO role (id, role_title, role_salary, department_id)
VALUES('Publishing Oversight', 200000, 1),
    ('Lead Editor', 300000, 2),
    ('Legal Head', 225000, 3),
    ('Managing Staff', 150000, 4),
    ('Sales Lead', 175000, 5);
      

INSERT INTO employee (employee_first_name, employee_last_name, employee_role_id, employee_manager_id)
VALUES('Kit', 'Harrington', 1, 3),
    ('Billy', 'Harris', 2, NULL),
    ('Spencer', 'Price', 3, 2),
    ('Angela', 'Montenegro', 4, 1),
    ('Jack', 'Hodgins', 5, 5);

