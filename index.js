//load .env file from dotenv package
require("dotenv").config();

const express = require("express");
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
const { Pool } = require("pg");
const Table = require('cli-table3');

// allow app to run on different ports
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware for parsing JSON and urlencoded data
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

/** ------------------------------------ INSERT PROMPT FILE DATA HERE ----------------------------------- */
// generate list of roles from the emp_role table
async function roleList() {
  try {
    const list = await pool.query("SELECT role_id, title FROM emp_role");
    return list.rows;

  } catch (err) {
    console.error(`Error fetching role list:`, err);
  }
};

// generate list of employees from the employee table
async function employeeList() {
  try {
    const list = await pool.query(
      "SELECT emp_id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee"
    );
    return list.rows;
  
  } catch (err) {
    console.error(`Error fetching employee list:`, err);
  }
};

// generate department list from the department table
async function departmentList() {
  try {
    const list = await pool.query("SELECT dept_id, dept_name FROM department");
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
      "Update Employee Manager",
      "View All Employees",
      "View All Roles",
      "View All Departments",
      "Quit", // pool.end(); 
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
      value: 0,
    });

    const addNewEmployee = [
      {
        type: "input",
        message: "Enter the employee's first name: ",
        name: "firstName",
        validate: (input) => {
          // isText is a function with which we can use the .test method to test the input
          const isText = /^[a-zA-Z\s]{1,30}$/;
          if (!isText.test(input)) {
            return "Employee name must contain only letters and spaces, and be less than 30 characters long.";
          }
          return true;
        },
      },
      {
        type: "input",
        message: "Enter the employee's last name: ",
        name: "lastName",
        validate: (input) => {
          const isText = /^[a-zA-Z\s]{1,30}$/;
          if (!isText.test(input)) {
            return "Employee name must contain only letters and spaces, and be less than 30 characters long.";
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

/** ------------------------------ all prompts -------------------------------- */
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
        message: "What is the name of the role?: ",
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
        message: "What department does the role belong to?: ",
        name: "newRoleDept", //must be role id
        choices: dChoices, //dynamically generate list
      },
      {
        type: "input",
        message: "What is the salary of the role?: ",
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
        message: "What is the name of the department?: ",
        name: "deptName",
        validate: (input) => {
          const isText = /^[a-zA-Z\s]{1,30}$/;
          if (!isText.test(input)) {
            return "Department name must contain only letters and spaces, and be less than 30 characters long.";
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
    const roles = await roleList();
    const employees = await employeeList();

    /* map roles/employees to choices for the prompt; the name is displayed to the user, 
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

// update employee manager
async function promptUpdateManager() {
  try {
    const employees = await employeeList();

    /* map employees to choices for the prompt; the name is displayed to the user, 
    the value (id) is returned/saved to the DB */
    const eChoices = employees.map((emp) => ({
      name: emp.full_name,
      value: emp.emp_id,
    }));    

    const updateManager = [
      {
        type: "list",
        message: "Which employee's manager do you want to update?",
        name: "empName",
        choices: eChoices, //dynamically generate list
      },
      {
        type: "list",
        message: "Which manager do you want to assign the selected employee?",
        name: "updatedManager",
        choices: eChoices, //dynamically generate list
      },
    ];

    // prompt the user
    const answers = await inquirer.prompt(updateManager);
    // return answers in an object
    return {
      empName: answers.empName,
      updatedManager: answers.updatedManager,
    };

  } catch(err) {
    console.error("Error in 'Update Manager' prompts:", err);
  }
};


/** --------------------- send collected prompt data to API endpoints ------------------------ */
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
              `Added '${newEmployee.firstName} ${newEmployee.lastName}' to the database`
            );
            //call executePrompts to return user to mainPrompt
            await executePrompts();
          } catch (err) {
            console.error(`Error adding employee:`, err);
            //call function here to let user to select an option again after error
            await executePrompts();
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
            console.log(`Added '${newRole.newRoleName}' to the database`);
            //call executePrompts to return user to mainPrompt
            await executePrompts();
          } catch (err) {
            console.error(`Error adding role:`, err);
            //call function here to let user to select an option again after error
            await executePrompts();
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

            await response.json(); //stores response in a variable
            console.log(`Added '${newDepartment.deptName}' to the database`);
            //call executePrompts to return user to mainPrompt
            await executePrompts();
          } catch (err) {
            console.error(`Error adding department:`, err);
            //call function here to let user to select an option again after error
            await executePrompts();
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
            //call function here to let user to select an option again
            await executePrompts();
          } catch (err) {
            console.error(`Error updating employee role:`, err);
            //call function here to let user to select an option again after error
            await executePrompts();
          }
        })();
        break;

      case "Update Employee Manager":
        (async () => {
          try {
            const updatedEmpMgr = await promptUpdateManager();
            const response = await fetch(
              `http://localhost:${PORT}/api/update-manager`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedEmpMgr),
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            console.log(`Updated employee's manager`);
            //call function here to let user to select an option again
            await executePrompts();
          } catch (err) {
            console.error(`Error updating employee manager:`, err);
            //call function here to let user to select an option again after error
            await executePrompts();
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

            const data = await response.json();
            /* data.data is an array of objects, and the second property of 
            response.json (which is an object).render function works on arrays */
            renderTerminalTable(data.data);

            //call function here to let user to select an option again
            await executePrompts();
          } catch (err) {
            console.error(`Error fetching all employees:`, err);
            //call function here to let user to select an option again after error
            await executePrompts();
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

            const data = await response.json();
            /* data.data is an array of objects, and the second property of 
            response.json (which is an object).render function works on arrays */
            renderTerminalTable(data.data);

            //call function here to let user to select an option again
            await executePrompts();
          } catch (err) {
            console.error(`Error fetching all roles:`, err);
            //call function here to let user to select an option again after error
            await executePrompts();
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

            const data = await response.json();
            /* data.data is an array of objects, and the second property of 
            response.json (which is an object).render function works on arrays */
            renderTerminalTable(data.data);

            //call function here to let user to select an option again
            await executePrompts();
          } catch (err) {
            console.error(`Error fetching all departments:`, err);
            //call function here to let user to select an option again after error
            await executePrompts();
          }
        })();
        break;

      default:
        (async () => {
          try {
            //save the edited tables to the directory in case changes need to be reverted
            await saveDB("SELECT * FROM employee", "employee");
            await saveDB("SELECT * FROM department", "department");
            await saveDB("SELECT * FROM emp_role", "emp_role");
            
            const exitMessage = "Changes are saved. You have exited from the database.";
            console.log(exitMessage);
            await pool.end();
          } catch (err) {
            console.error(`Error exiting database:`, err);
          }
        })();
    }

  } catch (err) {
    console.error("Error executing prompts:", err);
  }
};

/** ---------------------------------------- END OF PROMPT FILE DATA ------------------------------------ */


// function to render GET requests in the terminal (cli-table3 package)
function renderTerminalTable(data) {
  if (data.length === 0) {
    console.log(`No data found!`)
    return;
  }

  const headers = Object.keys(data[0]);
  const columnWidths = headers.map((header) => {
    // initial column width is the header length
    let maxWidth = header.length;
    /* check the length of each value in the data by making it a string and 
    getting the length */
    data.forEach(item => {
      const valueLength = String(item[header]).length;
      // if the value is longer than the header, colWidth is the value length
      maxWidth = Math.max(maxWidth, valueLength);
    })
    return maxWidth + 2;
  });

  // create table structure
  const table = new Table({
    // headers are the first key in each data object
    head: headers,
    //specify width of each column
    colWidths: columnWidths,
    chars: {
      mid: "-",
      "mid-mid": "+",
      middle: "|",
    },
    style: {
      "padding-left": 0,
      "padding-right": 0,
      head: ["red"],
      border: ["grey"],
    },
  });
  // push non-header data into the table
  data.forEach((item) => {
    table.push(Object.values(item));
  });
  // render table
  console.log(table.toString());
  
}

// function to create a formatted timestamp for the fileName (uniqueness)
function formatTimestamp() {
  const timeNow = new Date();
  //use reg exp to replace characters for valid file name
  //replace colons, remove fractional seconds from timestamp
  return timeNow.toISOString().replace(/:/g, '-').replace(/\..+/, '');
}
// function to save changes to the database to db_history folder
async function saveDB(query, fileName) {
  try {
    const result = await pool.query(query);
    const data = result.rows;

    // call timestamp function and set file name
    const timestamp = formatTimestamp();
    const newFileName = `${fileName}_${timestamp}.json`;
    //set file path
    const filePath = path.join(__dirname, 'db_history', newFileName);
    //write to a JSON file synchronously with writeFileSync
    fs.writeFileSync(filePath, JSON.stringify(data,null,2));

  } catch (err) {
    console.error(`Error saving table to directory:`, err);
  }
}

// view all employees joined with manager, role, department tables
app.get("/api/view-employees", (req, res) => {
  const sql = `SELECT employee.emp_id, employee.first_name, employee.last_name, emp_role.title, department.dept_name, emp_role.salary, CONCAT(COALESCE(manager.first_name, ''), ' ', COALESCE(manager.last_name, '')) AS manager FROM employee JOIN emp_role ON employee.role_id = emp_role.role_id JOIN department ON emp_role.dept_id = department.dept_id LEFT JOIN employee AS manager ON employee.manager_id = manager.emp_id ORDER BY emp_id ASC`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: err.message });
      // return;
    }
    res.json({
      message: "GET successful",
      data: result.rows,
    });
  });
});

// view all departments
app.get("/api/view-depts", (req, res) => {
  const sql = `SELECT * FROM department`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: err.message });
      // return;
    }
    res.json({
      message: "GET successful",
      data: result.rows,
    });
  });
});

// view all roles
app.get("/api/view-roles", (req, res) => {
  const sql = `SELECT emp_role.role_id, emp_role.title, department.dept_name, emp_role.salary FROM emp_role JOIN department ON emp_role.dept_id = department.dept_id`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: err.message });
      // return;
    }
    res.json({
      message: "GET successful",
      data: result.rows,
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
      console.error("Error executing query:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `POST successful`,
      data: result.rows[0],
    });
  })
});

// add new role
app.post("/api/new-role", ({ body }, res) => {
  const sql = `INSERT INTO emp_role (title, dept_id, salary) VALUES ($1, $2, $3)`;
  // params collects data from the prompts
  const params = [body.newRoleName, body.newRoleDept, body.newRoleSalary];

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `POST successful`,
      data: result.rows[0],
    });
  });
});

// add new department 
app.post(`/api/new-department`, ({ body }, res) => {
  const sql = `INSERT INTO department (dept_name) VALUES ($1)`;
  // params collects data from the prompts
  const params = [body.deptName];

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: `POST successful`,
      data: result.rows[0],
    });
  });
});

// update employee role  
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

// update employee manager 
app.put("/api/update-manager", ({ body }, res) => {
  const sql = `UPDATE employee SET manager_id = $1 WHERE emp_id = $2`;
  // params collects data from the prompts
  const params = [body.updatedManager, body.empName];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!result.rowCount) {
      res.json({ message: "Employee not found!" });
    } else {
      res.json({
        message: `Update (PUT) successful`,
        data: body,
        changes: result.rowCount,
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
