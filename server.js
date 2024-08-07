const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');
require('console.table');

const app = express ();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Connect to databse
const pool = new Pool (
    {
        user: '',
        password: '',
        host: 'localhost',
        database: 'employee_db'
    },
    console.log('Connected to employee_db!')
)

pool.connect();

const mainMenu = async () => {
    const { action } = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit'
      ],
    });
  
    switch (action) {
      case 'View All Departments':
        return viewDepartments();
      case 'View All Roles':
        return viewRoles();
      case 'View All Employees':
        return viewEmployees();
      case 'Add a Department':
        return addDepartment();
      case 'Add a Role':
        return addRole();
      case 'Add an Employee':
        return addEmployee();
      case 'Update an Employee Role':
        return updateEmployeeRole();
      case 'Exit':
        return process.exit();
    }
  };
  
  const viewDepartments = async () => {
    const res = await pool.query('SELECT * FROM departments');
    console.table(res.rows);
    mainMenu();
  };
  
  const viewRoles = async () => {
    const res = await pool.query(`
      SELECT roles.id, roles.title, roles.salary, departments.name AS department 
      FROM roles 
      JOIN departments ON roles.department_id = departments.id
    `);
    console.table(res.rows);
    mainMenu();
  };
  
  const viewEmployees = async () => {
    const res = await pool.query(`
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, manager.first_name AS manager 
      FROM employees 
      JOIN roles ON employees.role_id = roles.id 
      JOIN departments ON roles.department_id = departments.id 
      LEFT JOIN employees manager ON manager.id = employees.manager_id
    `);
    console.table(res.rows);
    mainMenu();
  };
  
  const addDepartment = async () => {
    const { name } = await inquirer.prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
    });
  
    await pool.query('INSERT INTO departments (name) VALUES ($1)', [name]);
    console.log(`Added ${name} to the database`);
    mainMenu();
  };
  
  const addRole = async () => {
    const departments = await pool.query('SELECT * FROM departments');
    const { title, salary, department_id } = await inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the name of the role:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary of the role:',
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Select the department:',
        choices: departments.rows.map(department => ({ name: department.name, value: department.id })),
      }
    ]);
  
    await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added ${title} to the database`);
    mainMenu();
  };
  
  const addEmployee = async () => {
    const roles = await pool.query('SELECT * FROM roles');
    const employees = await pool.query('SELECT * FROM employees');
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter the first name of the employee:',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter the last name of the employee:',
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the role:',
        choices: roles.rows.map(role => ({ name: role.title, value: role.id })),
      },
      {
        name: 'manager_id',
        type: 'list',
        message: 'Select the manager:',
        choices: employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })).concat([{ name: 'None', value: null }]),
      }
    ]);
  
    await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added ${first_name} ${last_name} to the database`);
    mainMenu();
  };
  
  const updateEmployeeRole = async () => {
    const employees = await pool.query('SELECT * FROM employees');
    const roles = await pool.query('SELECT * FROM roles');
    const { employee_id, role_id } = await inquirer.prompt([
      {
        name: 'employee_id',
        type: 'list',
        message: 'Select the employee to update:',
        choices: employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the new role:',
        choices: roles.rows.map(role => ({ name: role.title, value: role.id })),
      }
    ]);
  
    await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log(`Updated employee's role`);
    mainMenu();
  };
  
  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    mainMenu();
  });
