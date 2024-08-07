-- Select all departments
SELECT * FROM departments;

-- Select all roles with department names
SELECT roles.id, roles.title, roles.salary, departments.name AS department
FROM roles
JOIN departments ON roles.department_id = departments.id;

-- Select all employees with role, department, and manager names
SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, manager.first_name AS manager
FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees manager ON manager.id = employees.manager_id;

-- Insert a new department
INSERT INTO departments (name) VALUES ('New Department Name');

-- Insert a new role
INSERT INTO roles (title, salary, department_id) VALUES ('New Role Title', 50000, 1);

-- Insert a new employee
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('First Name', 'Last Name', 1, NULL);

-- Update an employee's role
UPDATE employees SET role_id = 2 WHERE id = 1;