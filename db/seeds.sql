INSERT INTO department(name)
VALUES
("Engineering"),
("Sales"),
("Kitchen"),
("Management");

INSERT INTO role(title, salary, department_id)
VALUES
("Lead Pencil Designer", 50000, 1),
("Pencil Maker", 10000, 1),
("Head Chef", 100000, 3),
("CEO", 300000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
("Gabe", "Vee", 3, 2),
("Jordin","Lew", 4, NULL),
("Bryelle", "Diaz", 1, 2);