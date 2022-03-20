INSERT INTO department (department_name)
VALUES 
    ('Sales'),
    ('Legal'),
    ('Finance'),
    ('Engineering');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Salesperson', 60000.00, 1),
    ('Lawyer', 100000.00, 2),
    ('Accountant', 100000.00, 3),
    ('Developer', 80000.00, 4);

INSERT INTO employee (first_name, last_name, email, roles_id, manager_id)
VALUES
    ('Iggy', 'Merino', 'iggy@gmail.com', 1, NULL),
    ('Felipe', 'Merino', 'felipe@gmail.com', 2, 1),
    ('Nelly', 'Merino', 'nelly@gmail.com', 3, 1),
    ('Dylan', 'Cook', 'dylan@gmail.com', 4, 1);


