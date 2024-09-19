DO $$
    DECLARE

    BEGIN

        INSERT INTO department (dept_id, dept_name)
        VALUES
            (1, 'Engineering'),
            (2, 'Finance'),
            (3, 'Legal'),
            (4, 'Sales');

        INSERT INTO emp_role (role_id, title, salary, dept_id)
        VALUES
            (1, 'Sales Lead', '100000', 4),
            (2, 'Salesperson', '80000', 4),
            (3, 'Lead Engineer', '150000', 1),
            (4, 'Software Engineer', '120000', 1),
            (5, 'Account Manager', '160000', 2),
            (6, 'Accountant', '125000', 2),
            (7, 'Legal Team Lead', '250000', 3),
            (8, 'Lawyer', '190000', 3);
                   
        INSERT INTO employee (emp_id, first_name, last_name, role_id, manager_id)
        VALUES
            (1, 'Jack', 'Frost', 1, 0),
            (3, 'Pamela', 'Voorhees', 3, 0),
            (5, 'Danielle', 'Harris', 5, 0),
            (7, 'Sanna', 'Marin', 7, 0);

                   
        INSERT INTO employee (emp_id, first_name, last_name, role_id, manager_id)
        VALUES
            (2, 'Michael', 'Myers', 2, 1),
            (4, 'Jamie', 'Curtis', 4, 3),
            (6, 'Angela', 'Merkel', 6, 5),
            (8, 'Joe', 'Kabob', 8, 7);


        -- INSERT INTO manager (first_name, last_name)
        -- VALUES
        --     ('Jack', 'Frost'),
        --     ('Michael', 'Myers'),
        --     ('Pamela', 'Voorhees'),
        --     ('Jamie', 'Curtis'),
        --     ('Danielle', 'Harris'),
        --     ('Angela', 'Merkel'),
        --     ('Sanna', 'Marin'),
        --     ('Joe', 'Kabob');

        -- INSERT INTO employee (emp_id, manager_id)
        -- VALUES
        --     (2, 2),
        --     (4, 4),
        --     (6, 6),
        --     (8, 4);


RAISE NOTICE 'All tables have been updated.';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM; -- Log the error
        ROLLBACK; 
END $$;