-- Insert departments
INSERT INTO departments (name) VALUES 
('Engineering'),
('Finance'),
('Legal'),
('Sales');

-- Insert roles
INSERT INTO roles (title, salary, department_id) VALUES 
('Software Engineer', 80000, 1),
('Lead Engineer', 100000, 1),
('Accountant', 60000, 2),
('Account Manager', 70000, 2),
('Legal Team Lead', 90000, 3),
('Lawyer', 85000, 3),
('Salesperson', 50000, 4),
('Sales Lead', 75000, 4);

-- Insert employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Mike', 'Johnson', 3, NULL),
('Emily', 'Davis', 4, 3),
('Sarah', 'Brown', 5, NULL),
('Chris', 'Wilson', 6, 5),
('Jake', 'Snake', 7, 2),
('Steve', 'Rodgers', 8, NULL);