//load .env file from dotenv package
require("dotenv").config();

const express = require("express");
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
const { Pool } = require("pg");

// allow app to run on different ports
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const pool = new Pool(
  {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
  },

  figlet("Employee Database", (err, data) => {
    if (err) {
      console.log("Could not load image");
      console.dir(err);
      return;
    }
    console.log(data);
  })
);

pool.connect();

// view all employees joined with manager, role, department tables
app.get("/api/view-employees", (req, res) => {
  const sql = `SELECT employee.emp_id, employee.first_name, employee.last_name, emp_role.title, department.dept_name, emp_role.salary, CONCAT(manager.first_name, ' ', COALESCE(manager.last_name, '')) AS manager FROM employee JOIN emp_role ON employee.role_id = emp_role.role_id JOIN department ON emp_role.dept_id = department.dept_id LEFT JOIN manager ON employee.manager_id = manager.manager_id ORDER BY emp_id ASC`;

  pool.query(sql, (err, { rows }) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// view all departments
app.get("/api/view-depts", (req, res) => {
  const sql = `SELECT * FROM department`;

  pool.query(sql, (err, { rows }) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// view all roles
app.get("/api/view-roles", (req, res) => {
  const sql = `SELECT * FROM department`;

  pool.query(sql, (err, { rows }) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// add new employee
app.post('/api/new-employee', ({body}, res) => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ($1, $2, $3, $4)`;
  // params collects data from the prompts
  const params = [body.firstName, body.lastName, body.empRole, body.empManager];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `success`,
      data: body
    })
  })
});

// add new role
app.post("/api/new-role", ({ body }, res) => {
  const sql = `INSERT INTO emp_role (title, dept_id, salary)
    VALUES ($1, $2, $3)`;
  // params collects data from the prompts
  const params = [body.newRoleName, body.newRoleDept, body.newRoleSalary];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `success`,
      data: body,
    });
  });
});

// add new department
// update employee role







app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
