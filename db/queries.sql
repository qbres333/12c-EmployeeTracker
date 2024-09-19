-- Build queries here

-- concatenate manager names and insert into the manager table
-- this should insert the new employee into the manager table 
-- manager table does not need to be updated BUT:
    -- IF employee table has 2 more rows than the manager table, a new employee was 
    -- added. The MAX emp_id is the person to add to the manager table
-- add arguments to SELECT or WHERE?
-- INSERT INTO manager (employee_id, first_name, last_name)
-- SELECT 
--     employee.emp_id, employee.first_name, employee.last_name)
-- FROM employee
-- WHERE ...

-- view all employees joined with emp_role, department, and managers tables
SELECT employee.emp_id,
    employee.first_name,
    employee.last_name,
    emp_role.title,
    department.dept_name,
    emp_role.salary,
    CONCAT(manager.first_name, ' ', COALESCE(manager.last_name, '')) AS manager
FROM employee
JOIN emp_role
ON employee.role_id = emp_role.role_id
JOIN department
ON emp_role.dept_id = department.dept_id
LEFT JOIN manager
ON employee.manager_id = manager.manager_id
ORDER BY emp_id ASC;

-- view all roles
SELECT * FROM emp_role;

-- view all departments
SELECT * FROM department;

