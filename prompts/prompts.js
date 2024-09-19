const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");


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

// new employee prompts
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
    choices: [/*choices cannot be hard-coded since 
      the database is dynamically updated */],
  },
  {
    type: "list",
    message: "who is the employee's manager?",
    name: "empManager",
    choices: [],
  },
];

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
    choices: [],
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
    choices: [],
  },
  {
    type: "list",
    message: "Which role do you want to assign the selected employee?",
    name: "updatedRole",
    choices: [],
  },
];


// store the answers to the prompts. Write directly to database?

// send collect prompt data to API endpoints

inquirer.prompt(mainPrompt).then((answer) => {
    switch (answer.chooseOption) {
      case "Add Employee":
        (async() => {
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
            await inquirer.prompt(mainPrompt);

          } catch (err) {
            console.error(`Error adding role:`, err);
          }
        })();
        break;

      case "Add Role":
        (async() => {
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
            await inquirer.prompt(mainPrompt);

          } catch (err) {
            console.error(`Error adding role:`, err);
          }
        })();
        break;

      case "Add Department":
        (async() => {
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
            await inquirer.prompt(mainPrompt);

          } catch (err) {
            console.error(`Error adding department:`, err);
          }
        })();
        break;

      case "Update Employee Role":
        (async() => {
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
            await inquirer.prompt(mainPrompt);

          } catch (err) {
            console.error(`Error updating employee role:`, err);
          }
        })();
        break;

      case "View All Employees":
        (async() => {
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
            await inquirer.prompt(mainPrompt);

          } catch (err) {
            console.error(`Error updating employee role:`, err);
          }
        })();
      
    }
});


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