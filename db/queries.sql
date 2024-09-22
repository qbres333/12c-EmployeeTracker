-- Build queries here

-- view all employees joined with emp_role, department, and managers tables
SELECT employee.emp_id,
    employee.first_name,
    employee.last_name,
    emp_role.title,
    department.dept_name,
    emp_role.salary,
    CONCAT(COALESCE(manager.first_name, ''), ' ', COALESCE(manager.last_name, '')) AS manager
FROM employee
JOIN emp_role ON employee.role_id = emp_role.role_id
JOIN department ON emp_role.dept_id = department.dept_id
LEFT JOIN employee AS manager ON employee.manager_id = manager.emp_id
ORDER BY emp_id ASC;

-- view all roles
SELECT emp_role.role_id, emp_role.title, department.dept_name, emp_role.salary 
FROM emp_role
JOIN department ON emp_role.dept_id = department.dept_id;


-- view all departments
SELECT * FROM department;

