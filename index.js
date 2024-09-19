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

// connect to the default postgres database before connecting to the real db
// database must exist before connection
const initialPool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: "postgres",
});

// custom employee database
const dbName = process.env.PG_DATABASE;

async function createDB() {
    let client; // a client from the connection pool; used to interact with db for queries
    try {
        // connect to default postgres database
        client = await initialPool.connect();

        // create database
        await client.query(`CREATE DATABASE ${dbName}`); //error: db exists
    } catch (err) {
        console.error('Error creating database', err);
    } finally {
      // release client back to the connection pool after database is created
      if(client) {
        client.release();
      }
      initialPool.end(); //close this connection to the db
    }

    // connect to custom database
    const pool = new Pool(
      {
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: process.env.PG_HOST,
        database: dbName,
      },

      figlet("Employee\n\nDatabase", (err, data) => {
        if (err) {
          console.log("Could not load image");
          console.dir(err);
          return;
        }
        console.log(data);
      })
    );

    try {
      client = await pool.connect();
      // read schema file
      const schema = await fs.readFile("../db/schema.sql", "utf8", (err,data) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(data);
      });
      await client.query(schema);

      // read seeds file
      const seeds = await fs.readFile("../db/seeds.sql", "utf8", (err,data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(data);
      });
      await client.query(seeds);

    } catch (err) {
        console.error("Error creating database", err);
    } finally {
        if (client) {
          client.release();
        }
    }

};

createDB();

// const pool = new Pool(
//   {
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     host: process.env.PG_HOST,
//     database: dbName,
//   },

//   figlet("Employee Database", (err, data) => {
//     if (err) {
//       console.log("Could not load image");
//       console.dir(err);
//       return;
//     }
//     console.log(data);
//   })
// );



// // connect to actual database here, and build it
// pool.connect(async (err, client, release) => {
//     if(err) {
//         console.error('Error connecting to the database', err);
//         return;
//     }
//         try {
//             // read schema file
//             const schema = await fs.readFile("../db/schema.sql", "utf8");
//             await client.query(schema);

//             // read seeds file
//             const seeds = await fs.readFile("../db/seeds.sql", "utf8");
//             await client.query(seeds);

//         } catch (error) {
//             console.error('Error creating database', error)
//         } finally {
//           // release client back to the connection pool after database is created
//           release();
//         }
//     }
// );

// view all employees joined with manager, role, department tables
app.get("/api/view-employees", (req, res) => {
  const sql = `SELECT employee.emp_id, employee.first_name, employee.last_name, emp_role.title, department.dept_name, emp_role.salary, CONCAT(manager.first_name, ' ', COALESCE(manager.last_name, '')) AS manager FROM employee JOIN emp_role ON employee.role_id = emp_role.role_id JOIN department ON emp_role.dept_id = department.dept_id LEFT JOIN manager ON employee.manager_id = manager.manager_id`;

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
// add new role
// add new department
// update employee role







app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
