-- Build queries here

-- concatenate manager names and insert to the manager table
INSERT INTO manager (employee_id, full_name)
SELECT 
    e.emp_id AS employee_id,
    CONCAT(e.first_name, ' ', e.last_name)
FROM employee e
WHERE e.manager_id IS NOT NULL;

-- view all employees
SELECT * FROM employee;

-- view all roles
SELECT * FROM emp_role;

-- view all departments
SELECT * FROM department;