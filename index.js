//load .env file from dotenv package
require("dotenv").config();

const express = require("express");
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
const { Pool } = require("pg");
// import prompts file
// const {
//   roleList,
//   employeeList,
//   departmentList,
//   promptNewEmployee,
//   promptNewRole,
//   promptNewDepartment,
//   promptUpdateRole,
//   executePrompts,
// } = require("./prompts/prompts"); 

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
    // Start the prompts after displaying the ascii art
    executePrompts();
  }),
  
);

pool.connect();

/** ------------------------------ INSERT PROMPT FILE DATA HERE ------------------------------- */
/* ------------------- create functions to generate lists for prompts of type "list" ----------------------- */
// generate list of roles from the emp_role table
async function roleList() {
  try {
    // retrieve id and title, but only list the titles. Can the id be used when saving to the database?
    const list = await pool.query("SELECT role_id, title FROM emp_role");
    // const roles = list.rows.map((row) => ({
    //   role_id: row.role_id,
    //   title: row.title,
    // }));
    // return roles;
    return list.rows;

  } catch (err) {
    console.error(`Error fetching role list:`, err);
  }
};

//add "None" option that makes the manager field null in the employee table
// generate list of employees from the employee table
async function employeeList() {
  try {
    const list = await pool.query(
      "SELECT emp_id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee"
    );
    // const employees = list.rows.map((row) => ({
    //   emp_id: row.emp_id,
    //   full_name: row.full_name,
    // }));
    // return employees;
    return list.rows;
  
  } catch (err) {
    console.error(`Error fetching employee list:`, err);
  }
};

// generate department list from the department table
async function departmentList() {
  try {
    const list = await pool.query("SELECT dept_id, dept_name FROM department");
    // const departments = list.rows.map(row => ({
    //   dept_id: row.dept_id,
    //   dept_name: row.dept_name,
    // }));
    // return departments;
    // console.log(list.rows); //prints department list when "Add Role" is selected
    return list.rows;

  } catch (err) {
    console.error(`Error fetching department list:`, err);
  }
}; 

// main prompt in terminal;
const mainPrompt = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "chooseOption",
    choices: [
      "Add Employee",
      "Add Role",
      "Add Department",
      "Update Employee Role",
      "View All Employees",
      "View All Roles",
      "View All Departments",
      "Quit", // pool.end(); test that this is the default case
    ],
  },
];

// new employee prompts 
async function promptNewEmployee() {
  try {
    // store function calls in variables
    const roles = await roleList();
    const employees = await employeeList();

    /* map roles to choices for the prompt; the name is displayed to the user, 
    the value (id) is returned/saved to the DB */
    const rChoices = roles.map((role) => ({
      name: role.title,
      value: role.role_id,
    }));
    
    const eChoices = employees.map((emp) => ({
      name: emp.full_name,
      value: emp.emp_id,
    }));
    // add "None" option for new employees without managers
    eChoices.push({
      name: "None",
      value: null
    })

    const addNewEmployee = [
      {
        type: "input",
        message: "Enter the employee's first name: ",
        name: "firstName",
        validate: (input) => {
          const isText = /^[a-zA-Z\s]{1,30}$/;
          if (!isText.test(input)) {
            return "Employee name must contain only letters and be less than 30 characters long.";
          }
          return true;
        },
      },
      {
        type: "input",
        message: "Enter the employee's last name",
        name: "lastName",
        validate: (input) => {
          const isText = /^[a-zA-Z\s]{1,30}$/;
          if (!isText.test(input)) {
            return "Employee name must contain only letters and be less than 30 characters long.";
          }
          return true;
        },
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "empRole",
        choices: rChoices, //dynamically generate list
      },
      {
        type: "list",
        message: "who is the employee's manager?",
        name: "empManager",
        choices: eChoices, //dynamically generate list
      },
    ];

    // prompt the user
    const answers = await inquirer.prompt(addNewEmployee);
    // return answers in an object
    return {
      firstName: answers.firstName,
      lastName: answers.lastName,
      empRole: answers.empRole, //this is the role id
      empManager: answers.empManager, //this is the manager id
    };

  } catch(err) {
    console.error("Error in 'New Employee' prompts:", err);
  }
};

/** --------------------------------------------- all prompts --------------------------------------------- */
// new role prompts 
async function promptNewRole() {
  try {
    const departments = await departmentList();
    // map departments to choices for prompt; name displays to user, id is stored
    const dChoices = await departments.map((dept) => ({
      name: dept.dept_name,
      value: dept.dept_id,
    }));


    const addNewRole = [
      {
        type: "input",
        message: "What is the name of the role? ",
        name: "newRoleName",
        validate: (input) => {
          const isText = /^[a-zA-Z\s]{1,30}$/;
          if(!isText.test(input)) {
            return "Role name must contain only letters and be less than 30 characters long."
          }
          return true;
        }
      },
      {
        type: "list",
        message: "What department does the role belong to?",
        name: "newRoleDept", //must be role id
        choices: dChoices, //dynamically generate list
      },
      {
        type: "input",
        message: "What is the salary of the role? ",
        name: "newRoleSalary",
        validate: (input) => {
          //check that the input is a number using isNAN
          const isNumber = !isNaN(parseFloat(input)) && parseFloat(input) > 0;
          if (!isNumber) {
            return "Please enter a valid number";
          }
          return true;
        },
      },
    ];

    // prompt the user
    const answers = await inquirer.prompt(addNewRole);
    // return answers in an object
    return {
      newRoleName: answers.newRoleName,
      newRoleDept: answers.newRoleDept,
      newRoleSalary: answers.newRoleSalary,
    };

  } catch (err) {
    console.error("Error in 'New Role' prompts:", err);
  }
};


// new department prompt 
async function promptNewDepartment() {
  try {
    const addDepartment = [
      {
        type: "input",
        message: "What is the name of the department? ",
        name: "deptName",
        validate: (input) => {
          const isText = /^[a-zA-Z\s]{1,30}$/;
          if (!isText.test(input)) {
            return "Department name must contain only letters and be less than 30 characters long.";
          }
          return true;
        },
      },
    ];

    // prompt the user
   const answers = await inquirer.prompt(addDepartment);
  //  return answer in an object
   return { deptName: answers.deptName };

  } catch (err) {
    console.error("Error in 'New Department' prompt:", err);
  }
};


// update employee role
async function promptUpdateRole() {
  try {
    // const [roles, employees] = await Promise.all([roleList(), employeeList()]);
    // store function calls in variables
    const roles = await roleList();
    const employees = await employeeList();

    /* map roles to choices for the prompt; the name is displayed to the user, 
    the value (id) is returned/saved to the DB */
    const rChoices = roles.map((role) => ({
      name: role.title,
      value: role.role_id,
    }));

    const eChoices = employees.map((emp) => ({
      name: emp.full_name,
      value: emp.emp_id,
    }));

    const updateRole = [
      {
        type: "list",
        message: "Which employee's role do you want to update?",
        name: "empName",
        choices: eChoices, //dynamically generate list
      },
      {
        type: "list",
        message: "Which role do you want to assign the selected employee?",
        name: "updatedRole",
        choices: rChoices, //dynamically generate list
      },
    ];

    // prompt the user
    const answers = await inquirer.prompt(updateRole);
    // return answers in an object
    return {
      empName: answers.empName,
      updatedRole: answers.updatedRole
    };

  } catch(err) {
    console.error("Error in 'Update Role' prompts:", err);
  }
};


/** ------------------------------ send collected prompt data to API endpoints ---------------------------- */
async function executePrompts() {
  try {
    const answer = await inquirer.prompt(mainPrompt);

    // switch/cases here
    switch (answer.chooseOption) {
      case "Add Employee":
        (async () => {
          try {
            const newEmployee = await promptNewEmployee();
            const response = await fetch(
              `http://localhost:${PORT}/api/new-employee`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newEmployee),
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            console.log(
              `Added ${newEmployee.firstName} ${newEmployee.lastName} to the database`
            );
            
          } catch (err) {
            console.error(`Error adding employee:`, err);
          }
        })();
        break;

      case "Add Role":
        (async () => {
          try {
            const newRole = await promptNewRole();
            const response = await fetch(
              `http://localhost:${PORT}/api/new-role`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newRole),
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            console.log(`Added ${newRole.newRoleName} to the database`)
            
          } catch (err) {
            console.error(`Error adding role:`, err);
          }
        })();
        break;

      case "Add Department":
        (async () => {
          try {
            const newDepartment = await promptNewDepartment();
            const response = await fetch(
              `http://localhost:${PORT}/api/new-department`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newDepartment),
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
              
            }

            await response.json();
            console.log(`Added ${newDepartment.deptName} to the database`);
            
          } catch (err) {
            console.error(`Error adding department:`, err);
          }
        })();
        break;

      case "Update Employee Role":
        (async () => {
          try {
            const updatedEmpRole = await promptUpdateRole();
            const response = await fetch(
              `http://localhost:${PORT}/api/update-role`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedEmpRole),
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            console.log(`Updated employee's role`);
            
          } catch (err) {
            console.error(`Error updating employee role:`, err);
          }
        })();
        break;

      case "View All Employees":
        (async () => {
          try {
            const response = await fetch(
              `http://localhost:${PORT}/api/view-employees`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            
          } catch (err) {
            console.error(`Error fetching all employees:`, err);
          }
        })();
        break;

      case "View All Roles":
        (async () => {
          try {
            const response = await fetch(
              `http://localhost:${PORT}/api/view-roles`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            
          } catch (err) {
            console.error(`Error fetching all roles:`, err);
          }
        })();
        break;

      case "View All Departments":
        (async () => {
          try {
            const response = await fetch(
              `http://localhost:${PORT}/api/view-depts`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            // console.log(showDepts);

          } catch (err) {
            console.error(`Error fetching all departments:`, err);
          }
        })();
        break;

      default:
        (async () => {
          try {
            const exitMessage = "You have exited from the database.";
            console.log(exitMessage);
            await pool.end();
            
          } catch (err) {
            console.error(`Error exiting database:`, err);
          }
        })();
    }
    // returns to mainPrompt if "Quit" is not selected; causing repeated mainPrompts in terminal
    //when to return to mainPrompt???
    // if(answer.chooseOption !== "Quit") {
    //   await executePrompts();
    // }
  } catch (err) {
    console.error("Error executing prompts:", err);
  }
};

// call prompts function
// executePrompts();

/** ------------------------------ END OF PROMPT FILE DATA ------------------------------------ */

// --------------CHECK SPELLING IN QUERIES ---------------------
// view all employees joined with manager, role, department tables
app.get("/api/view-employees", (req, res) => {
  const sql = `SELECT employee.emp_id, employee.first_name, employee.last_name, emp_role.title, department.dept_name, emp_role.salary, CONCAT(COALESCE(manager.first_name, ''), ' ', COALESCE(manager.last_name, '')) AS manager FROM employee JOIN emp_role ON employee.role_id = emp_role.role_id JOIN department ON emp_role.dept_id = department.dept_id LEFT JOIN employee AS manager ON employee.manager_id = manager.emp_id ORDER BY emp_id ASC`;

  pool.query(sql, (err, { rows }) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "GET successful",
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
      message: "GET successful",
      data: rows,
    });
  });
});

// view all roles
app.get("/api/view-roles", (req, res) => {
  const sql = `SELECT emp_role.role_id, emp_role.title, department.dept_name, emp_role.salary FROM emp_role JOIN department ON emp_role.dept_id = department.dept_id`;

  pool.query(sql, (err, { rows }) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "GET successful",
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
      console.error(err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `POST successful`,
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
      message: `POST successful`,
      data: body,
    });
  });
});

// add new department
app.post("/api/new-department", ({ body }, res) => {
  const sql = `INSERT INTO department (dept_name) VALUES ($1)`;
  // params collects data from the prompts
  const params = [body.deptName];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `POST successful`,
      data: body,
    });
  });
});

// update employee role  /api/update-role
app.put("/api/update-role/", ({ body }, res) => {
  const sql = `UPDATE employee SET role_id = $1 WHERE emp_id = $2`;
  // params collects data from the prompts
  const params = [body.updatedRole, body.empName];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!result.rowCount) {
      res.json({message: "Employee not found!"})
    } else {
      res.json({
        message: `Update (PUT) successful`,
        data: body,
        changes: result.rowCount
      });
    }
  });
});


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
