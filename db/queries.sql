-- Build queries here

-- concatenate manager names and insert into the manager table
-- this should insert the new employee into the manager table 
-- manager table does not need to be updated BUT:
    -- IF employee table has 2 more rows than the manager table, a new employee was 
    -- added. The MAX emp_id is the person to add to the manager table
-- add arguments to SELECT
-- INSERT INTO manager (employee_id, full_name)
-- SELECT 
--     employee.emp_id,
--     CONCAT(employee.first_name, ' ', employee.last_name)
-- FROM employee
-- WHERE employee.manager_id IS NOT NULL;

-- view all employees joined with emp_role table
SELECT employee.emp_id,
    employee.first_name,
    employee.last_name,
    emp_role.title,
    emp_role.department_id,
    emp_role.salary,
    employee.manager
FROM employee
JOIN emp_role
ON employee.role_id = emp_role.role_id;

-- view all roles
SELECT * FROM emp_role;

-- view all departments
SELECT * FROM department;

