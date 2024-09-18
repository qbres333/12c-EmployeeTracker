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

        INSERT INTO employee (emp_id, first_name, last_name, role_id)
        VALUES
            (1, 'Jack', 'Frost', 1,),
            (2, 'Michael', 'Myers', 2),
            (3, 'Pamela', 'Voorhees', 3),
            (4, 'Jamie', 'Curtis', 4),
            (5, 'Danielle', 'Harris', 5),
            (6, 'Angela', 'Merkel', 6),
            (7, 'Sanna', 'Marin', 7),
            (8, 'Joe', 'Kabob', 8);

        INSERT INTO manager (employee_id, full_name)
        VALUES
            (null, 'None');


RAISE NOTICE 'All tables have been updated.';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM; -- Log the error
        ROLLBACK; 
END $$;