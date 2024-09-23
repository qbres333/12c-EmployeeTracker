# 12c-EmployeeTracker

## Description

The Employee Tracker is a command-line application designed to simplify the management of a company's employee information. Built from scratch using Node.js, Inquirer, and PostgreSQL, this tool provides an intuitive interface that allows users—regardless of their technical expertise—to easily view, add, and update employee records.

## Installation

This app was developed to be deployed from the command line interface. It requires the installation of the following:
    - Node.js
    - PostgreSQL (to create database on your personal machine)

A demo of the app can be found here:
https://drive.google.com/file/d/1ZdRs2wNQsCBJSwO-kOYUY4tPabpzDoJH/view?usp=drive_link

The online repository with all code files can be accessed here:
https://github.com/qbres333/12c-EmployeeTracker

## Features

Users can efficiently navigate the employee database through a series of guided prompts, making it easy to manage vital employee data. Whether you're tracking employee roles, salaries, or department assignments, this application ensures that all information is accessible and manageable right from the command line.

## Usage

To begin using the Employee Tracker app, download and install Node.js and postgreSQL. Clone the project repo to your desired location. To query the default database, right-click on the "db" folder in the project directory, and select "Open in Integrated Terminal". Type "psql -U postgres" into the terminal, then enter your password when prompted. Use postgreSQL command "\i" to setup the schema.sql file, followed by the seeds.sql file. You can then close this terminal window, or leave it open to enter your custom queries directly into that terminal. 

To dynamically change the database, right-click on the index.js file in the project directory, and select "Open in Integrated Terminal". Enter the command "node index" and press enter on your keyboard. Select any of the prompts and enjoy! 

Note: In order for your changes to be saved in the directory, you must select "Quit" from the prompt choices after you've made all of your changes. If "Quit" is not selected, all changes will be lost.

## Credits 

Drawing text in the terminal:
https://www.npmjs.com/package/figlet

Creating tables in the terminal:
https://www.npmjs.com/package/cli-table3

Express with Async/Await:
https://node-postgres.com/guides/async-express

npm inquirer SELECT (for lists):
https://github.com/SBoudrias/Inquirer.js/tree/main/packages/select

## License

MIT License (located in root directory):
https://github.com/qbres333/12c-EmployeeTracker