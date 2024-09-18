-- Build queries here

-- concatenate manager names
INSERT INTO manager (employee_id, full_name)
SELECT 
    e.emp_id AS employee_id,
    CONCAT(e.first_name, ' ', e.last_name)
FROM employee e
WHERE e.manager_id IS NOT NULL;
