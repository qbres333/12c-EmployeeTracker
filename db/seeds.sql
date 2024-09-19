DO $$
    DECLARE

    BEGIN

        INSERT INTO department (dept_id, dept_name)
        VALUES
            (1, 'Engineering'),
            (2, 'Finance'),
            (3, 'Legal'),
            (4, 'Sales');

        INSERT INTO emp_role (role_id, title, salary, department_id)
        VALUES
            (1, 'Sales Lead', '100000', 4),
            (2, 'Salesperson', '80000', 4),
            (3, 'Lead Engineer', '150000', 1),
            (4, 'Software Engineer', '120000', 1),
            (5, 'Account Manager', '160000', 2),
            (6, 'Accountant', '125000', 2),
            (7, 'Legal Team Lead', '250000', 3),
            (8, 'Lawyer', '190000', 3);


        INSERT INTO manager (manager_id, employee_id, full_name)
        VALUES
            (1, null, 'None'),
            (2, 1, "Jack Frost"),
            (3, 2, "Michael Myers"),
            (4, 3, "Pamela Voorhees"),
            (5, 4, "Jamie Curtis"),
            (6, 5, 'Danielle Harris'),
            (7, 6, 'Angela Merkel'),
            (8, 7, 'Sanna Marin'),
            (9, 8, 'Joe Kabob');

        INSERT INTO employee (emp_id, first_name, last_name, role_id, manager_id)
        VALUES
            (1, 'Jack', 'Frost', 1, 1),
            (2, 'Michael', 'Myers', 2, 2),
            (3, 'Pamela', 'Voorhees', 3, 1),
            (4, 'Jamie', 'Curtis', 4, 4),
            (5, 'Danielle', 'Harris', 5, 1),
            (6, 'Angela', 'Merkel', 6, 6),
            (7, 'Sanna', 'Marin', 7, 1),
            (8, 'Joe', 'Kabob', 8, 4);


RAISE NOTICE 'All tables have been updated.';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM; -- Log the error
        ROLLBACK; 
END $$;