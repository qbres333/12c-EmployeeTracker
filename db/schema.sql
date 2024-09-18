-- Drops the inventory_db if it exists currently --
DROP DATABASE IF EXISTS employee_db;
-- Creates the employee_db database --
CREATE DATABASE employee_db;

-- Connect to the database --
\c inventory_db;

DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS emp_role;
DROP TABLE IF EXISTS employee;

-- Create the tables in the database --
CREATE TABLE department (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE emp_role (
    role_id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY department_id REFERENCES department(dept_id)
    ON DELETE SET NULL
);

-- might not be needed if the manager is added with a query..........

CREATE TABLE manager (
    manager_id INTEGER PRIMARY KEY,
    employee_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES employee(emp_id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    emp_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY role_id REFERENCES emp_role(role_id)
    ON DELETE SET NULL 
);