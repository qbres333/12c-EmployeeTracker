-- Drop the employee_db if it exists currently --
DROP DATABASE IF EXISTS employee_db;
-- Create the employee_db database --
CREATE DATABASE employee_db;

-- Connect to the database --
\c employee_db;

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

CREATE TABLE employee (
    emp_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES emp_role(role_id)
    ON DELETE SET NULL
    -- FOREIGN KEY (manager_id) REFERENCES employee(emp_id) --self-referencing key
    -- ON DELETE SET NULL
);

-- CREATE TABLE manager (
--     manager_id SERIAL PRIMARY KEY,
--     FOREIGN KEY (manager_id) REFERENCES employee(emp_id),
--     first_name VARCHAR(30),
--     last_name VARCHAR(30)
-- );






