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

// connect database here
// can I create the database from here?....
pool.connect();

// view all employees joined with roles table
app.get('/api/view-employees', ({ body }, res) => {
    const sql = ``;

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
})

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
// add new role
// add new department
// 






app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
