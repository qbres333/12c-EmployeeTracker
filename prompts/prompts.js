const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

// create functions to generate lists for prompts of type "list"; they all return promises
// generate list of roles
async function roleList() {
  try {
    const list = await pool.query("SELECT title FROM emp_role");
    return list.rows.map((row) => row.title);
  } catch (err) {
    console.error(`Error fetching role list:`, err);
  }
};

//add "None" option that makes the manager field null in the employee table
// generate list of employees
async function employeeList() {
  try {
    const list = await pool.query(
      "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employee"
    );
    return list.rows.map((row) => row.full_name);
  } catch (err) {
    console.error(`Error fetching employee list:`, err);
  }
};

// generate department list
async function departmentList() {
  try {
    const list = await pool.query("SELECT dept_name FROM department");
    return list.rows.map(row => row.dept_name);
  } catch (err) {
    console.error(`Error fetching department list:`, err);
  }
}; //

// main prompt in terminal
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
      "Quit", // pool.end();
    ],
  },
];

/* ------------- When do I call the non-main prompt functions?? --------- */
// new employee prompts
// convert to async/await
async function promptNewEmployee() {
  try {
    /* assign values of resolved promises from roleList and employeeList functions to roles, 
    employees variables respectively */
    const [roles, employees] = await Promise.all([roleList(), employeeList()]);

    const addNewEmployee = [
      {
        type: "input",
        message: "Enter the employee's first name: ",
        name: "firstName",
      },
      {
        type: "input",
        message: "Enter the employee's last name",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "empRole",
        choices: roles, //dynamically generate list
      },
      {
        type: "list",
        message: "who is the employee's manager?",
        name: "empManager",
        choices: employees, //dynamically generate list
      },
    ];

    // prompt the user
    await inquirer.prompt(addNewEmployee);

  } catch(err) {
    console.error("Error in 'New Employee' prompt:", err);
  }
};




// new role prompts
const addNewRole = [
  {
    type: "input",
    message: "What is the name of the role? ",
    name: "newRoleName",
  },
  {
    type: "input",
    message: "What is the salary of the role? ",
    name: "newRoleSalary",
    validate: (input) => {
      //check that the input is a number using isNAN
      const isNumber = !isNaN(parseFloat(input));
      if (!isNumber) {
        return "Please enter a valid number";
      }
      return true;
    },
  },
  {
    type: "list",
    message: "What department does the role belong to?",
    name: "newRoleDept",
    choices: [], //dynamically generate list
  },
];

// new department prompt
const addDepartment = [
  {
    type: "input",
    message: "What is the name of the department? ",
    name: "deptName",
  },
];

// update employee role
const updateRole = [
  {
    type: "list",
    message: "Which employee's role do you want to update?",
    name: "empName",
    choices: [], //dynamically generate list
  },
  {
    type: "list",
    message: "Which role do you want to assign the selected employee?",
    name: "updatedRole",
    choices: [], //dynamically generate list
  },
];


// send collected prompt data to API endpoints
async function executePrompts() {
  try {
    const answer = await inquirer.prompt(mainPrompt);

    // switch/cases here
    switch (answer.chooseOption) {
      case "Add Employee":
        (async () => {
          try {
            const newEmployee = await inquirer.prompt(addNewEmployee);
            const response = await fetch("/api/new-employee", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newEmployee),
            });

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            
          } catch (err) {
            console.error(`Error adding role:`, err);
          }
        })();
        break;

      case "Add Role":
        (async () => {
          try {
            const newRole = await inquirer.prompt(addNewRole);
            const response = await fetch("/api/new-role", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newRole),
            });

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            
          } catch (err) {
            console.error(`Error adding role:`, err);
          }
        })();
        break;

      case "Add Department":
        (async () => {
          try {
            const newDepartment = await inquirer.prompt(addDepartment);
            const response = await fetch("/api/new-department", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newDepartment),
            });

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            
          } catch (err) {
            console.error(`Error adding department:`, err);
          }
        })();
        break;

      case "Update Employee Role":
        (async () => {
          try {
            const updatedEmpRole = await inquirer.prompt(updateRole);
            const response = await fetch("/api/update-role", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedEmpRole),
            });

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();
            
          } catch (err) {
            console.error(`Error updating employee role:`, err);
          }
        })();
        break;

      case "View All Employees":
        (async () => {
          try {
            const response = await fetch("/api/view-employees", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

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
            const response = await fetch("/api/view-roles", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

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
            const response = await fetch("/api/view-depts", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            await response.json();

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

    if(answer.chooseOption !== "Quit") {
      await executePrompts();
    }
  } catch (err) {
    console.error("Error executing prompts:", err);
  }
};

// call prompts function
executePrompts();

// remove "await inquirer.prompt(mainPrompt);" from each case
// inquirer.prompt(mainPrompt).then((answer) => {
    
// });


        // inquirer.prompt(updateRole).then((updatedEmpRole) => {
        //   fetch("/api/update-role", {
        //     method: "PUT",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(updatedEmpRole),
        //   })
        //     .then((response) => response.json())
        //     .then(() => {
        //       //return to main prompt
        //       inquirer.prompt(mainPrompt);
        //     })
        //     .catch((err) => {
        //       console.error(`Error updating employee role:`, err);
        //     });
        // });


        // inquirer.prompt(addDepartment).then((newDepartment) => {
        //   fetch("/api/new-department", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(newDepartment),
        //   })
        //     .then((response) => response.json())
        //     .then(() => {
        //       //return to main prompt
        //       inquirer.prompt(mainPrompt);
        //     })
        //     .catch((err) => {
        //       console.error(`Error adding department:`, err);
        //     });
        // });


       // inquirer.prompt(addNewRole).then((newRole) => {
        //   fetch("/api/new-role", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(newRole),
        //   })
        //     .then((response) => response.json())
        //     .then(() => {
        //       //return to main prompt
        //       inquirer.prompt(mainPrompt);
        //     })
        //     .catch((err) => {
        //       console.error(`Error adding role:`, err);
        //     });
        // });
     // inquirer.prompt(addNewEmployee).then((newEmployee) => {
        //   fetch("/api/new-employee", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(newEmployee),
        //   })
        //     .then((response) => response.json())
        //     .then(() => {
        //       //return to main prompt
        //       inquirer.prompt(mainPrompt);
        //     })
        //     .catch((err) => {
        //       console.error(`Error adding employee:`, err);
        //     });
        // });