INSERT INTO department(id, name)
VALUES
(1, "Engineering"),
(2, "Sales"),
(3, "Kitchen"),
(4, "Management");

INSERT INTO role(id, title, salary, department_id)
VALUES
(1, "Lead Pencil Designer", 50000, 1),
(2, "Pencil Maker", 10000, 1),
(3, "Head Chef", 100000, 3),
(4, "CEO", 300000, 4);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Gabe", "Vee", 3, 2),
(2, "Jordin","Lew", 4, NULL),
(3, "Bryelle", "Diaz", 1, 2);