INSERT INTO department (name)
VALUES('Publishing'),
    ('Editorial'),
    ('Legal'),
    ('Managing'),
    ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES('Publishing Oversight', 200000, 1),
    ('Lead Editor', 300000, 2),
    ('Legal Head', 225000, 3),
    ('Managing Staff', 150000, 4),
    ('Sales Lead', 175000, 5);
      

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES('Kit', 'Harrington', 1, 4),
    ('Billy', 'Harris', 2, NULL),
    ('Spencer', 'Price', 3, 2),
    ('Angela', 'Montenegro', 4, 3),
    ('Jack', 'Hodgins', 5, 1);

