DO $$
    DECLARE

    BEGIN

        INSERT INTO department (dept_id, dept_name)
        VALUES
            (1, 'Engineering'),
            (2, 'Finance'),
            (3, 'Legal'),
            (4, 'Sales');

        INSERT INTO emp_role (role_id, title, dept_id, salary)
        VALUES
            (1, 'Sales Lead', 4, 100000),
            (2, 'Salesperson', 4, 80000),
            (3, 'Lead Engineer', 1, 150000),
            (4, 'Software Engineer', 1, 120000),
            (5, 'Account Manager', 2, 160000),
            (6, 'Accountant', 2, 125000),
            (7, 'Legal Team Lead', 3, 250000),
            (8, 'Lawyer', 3, 190000);
        
        -- first insert employees who do not have a manager
        INSERT INTO employee (emp_id, first_name, last_name, role_id, manager_id)
        VALUES
            (1, 'Jack', 'Frost', 1, 0),
            (3, 'Pamela', 'Voorhees', 3, 0),
            (5, 'Danielle', 'Harris', 5, 0),
            (7, 'Sanna', 'Marin', 7, 0);

        -- then insert employees with a manager
        INSERT INTO employee (emp_id, first_name, last_name, role_id, manager_id)
        VALUES
            (2, 'Michael', 'Myers', 2, 1),
            (4, 'Jamie', 'Curtis', 4, 3),
            (6, 'Angela', 'Merkel', 6, 5),
            (8, 'Joe', 'Kabob', 8, 7);


RAISE NOTICE 'All tables have been updated.';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM; -- Log the error
        ROLLBACK; 
END $$;