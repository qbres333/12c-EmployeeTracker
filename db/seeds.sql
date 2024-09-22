DO $$
    DECLARE

    BEGIN

        INSERT INTO department (dept_name)
        VALUES
            ('Engineering'),
            ('Finance'),
            ('Legal'),
            ('Sales');

        INSERT INTO emp_role (title, dept_id, salary)
        VALUES
            ('Sales Lead', 4, 100000),
            ('Salesperson', 4, 80000),
            ('Lead Engineer', 1, 150000),
            ('Software Engineer', 1, 120000),
            ('Account Manager', 2, 160000),
            ('Accountant', 2, 125000),
            ('Legal Team Lead', 3, 250000),
            ('Lawyer', 3, 190000);
        
        -- first insert employees who do not have a manager
        INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES
            ('Jack', 'Frost', 1, 0),
            ('Pamela', 'Voorhees', 3, 0),
            ('Danielle', 'Harris', 5, 0),
            ('Sanna', 'Marin', 7, 0);

        -- then insert employees with a manager
        INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES
            ('Michael', 'Myers', 2, 1),
            ('Jamie', 'Curtis', 4, 2),
            ('Angela', 'Merkel', 6, 3),
            ('Joe', 'Kabob', 8, 4);


RAISE NOTICE 'All tables have been updated.';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM; -- Log the error
        ROLLBACK; 
END $$;