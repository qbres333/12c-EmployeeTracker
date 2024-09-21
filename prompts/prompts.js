const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

// create functions to generate lists for prompts of type "list"; they all return promises
// generate list of roles from the emp_role table
async function roleList() {
  try {
    // retrieve id and title, but only list the titles. Can the id be used when saving to the database?
    const list = await pool.query("SELECT role_id, title FROM emp_role");
    const roles = list.rows.map((row) => ({
      role_id: row.role_id,
      title: row.title,
    }));
    return roles;

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
    const employees = list.rows.map((row) => ({
      emp_id: row.emp_id,
      full_name: row.full_name,
    }));
    return employees;
  
  } catch (err) {
    console.error(`Error fetching employee list:`, err);
  }
};

// generate department list from the department table
async function departmentList() {
  try {
    const list = await pool.query("SELECT dept_id, dept_name FROM department");
    const departments = list.rows.map(row => ({
      dept_id: row.dept_id,
      dept_name: row.dept_name,
    }));
    return departments;

  } catch (err) {
    console.error(`Error fetching department list:`, err);
  }
}; //

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

// new employee prompts   ADD TEXT VALIDATION
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
          const isText = /^[a-zA-Z]{1,30}$/;
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
          const isText = /^[a-zA-Z]{1,30}$/;
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


// new role prompts 
async function promptNewRole() {
  try {
    const departments = await departmentList();
    // map departments to choices for prompt; name displays to user, id is stored
    const dChoices = departments.map((dept) => ({
      name: dept.dept_name,
      value: dept.dept_id,
    }));


    const addNewRole = [
      {
        type: "input",
        message: "What is the name of the role? ",
        name: "newRoleName",
        validate: (input) => {
          const isText = /^[a-zA-Z]{1,30}$/;
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
          const isNumber = !isNaN(parseFloat(input));
          if (!isNumber.test(input)) {
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
          const isText = /^[a-zA-Z]{1,30}$/;
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


// send collected prompt data to API endpoints
async function executePrompts() {
  try {
    const answer = await inquirer.prompt(mainPrompt);

    // switch/cases here
    switch (answer.chooseOption) {
      case "Add Employee":
        (async () => {
          try {
            const newEmployee = await promptNewEmployee();
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
            console.error(`Error adding employee:`, err);
          }
        })();
        break;

      case "Add Role":
        (async () => {
          try {
            const newRole = await promptNewRole();
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
            const newDepartment = await promptNewDepartment();
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
            const updatedEmpRole = await promptUpdateRole();
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
