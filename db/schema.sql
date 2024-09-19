-- Drop the employee_db if it exists currently --
-- DROP DATABASE IF EXISTS employee_db;
-- Create the employee_db database --
CREATE DATABASE employee_db;

-- Connect to the database --
-- \c employee_db;

DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS emp_role;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS manager;

-- Create the tables in the database --
CREATE TABLE department (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE emp_role (
    role_id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    dept_id INTEGER NOT NULL,
    salary DECIMAL NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
    ON DELETE SET NULL
);

-- manager full name to be stored in the table as a concatenation of first_name, last_name
-- employees can have the same name, distinguish with emp_id
CREATE TABLE manager (
    manager_id SERIAL PRIMARY KEY,
    emp_id INTEGER,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    FOREIGN KEY (emp_id) REFERENCES employee(emp_id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    emp_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES emp_role(role_id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES manager(manager_id)
    ON DELETE SET NULL
);





