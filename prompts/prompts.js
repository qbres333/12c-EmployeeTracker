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
  }
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



inquirer.prompt(mainPrompt).then((answer) => {
    switch (answer.chooseOption) {
        case "Add Employee":
            inquirer.prompt(addNewEmployee).then((newEmployee) => {
                console.log(
                  `Added`,
                  newEmployee.firstName,
                  newEmployee.lastName,`to the database.`
                );
                //call main prompt here
                inquirer.prompt(mainPrompt);
            });
            break;

        case "Add Role":
            inquirer.prompt(addNewRole).then((newRole) => {
                console.log(`Added`,newRole.newRoleName, `to the database`);
                inquirer.prompt(mainPrompt);
            });
            break;
    }
});


