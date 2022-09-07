const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const menu = {
  type: "list",
  message: "What would you like to do?",
  choices: [
    "View Departments",
    "View Roles",
    "View Employees",
    "Add a Department",
    "Add a Role",
    "Add an Employee",
    "Update Existing Employee",
    "Quit",
  ],
  name: "menuList",
};

const prompts = {
  addDep: {
    type: "input",
    message: "Enter New Department Name:",
    name: "addDep",
  },
  addRole: [
    {
      type: "input",
      message: "Enter Role's Title:",
      name: "title",
    },
    {
      type: "input",
      message: "Enter Role's Salary:",
      name: "salary",
    },
    {
      type: "input",
      message: "Enter Role's Department:",
      name: "depRole",
    },
  ],
  addEmp: [
    {
      type: "input",
      message: "Enter employee's first name:",
      name: "firstName",
    },
    {
      type: "input",
      message: "Enter employee's last name:",
      name: "lastName",
    },
    {
      type: "input",
      message: "Enter employee's role:",
      name: "empRole",
    },
    {
      type: "input",
      message: "Enter employee's manager:",
      name: "empManager",
    },
  ],
  updateEmp: {
    type: "input",
    message: "Update employee's role:",
    name: "update",
  },
};

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

function start() {
  inquirer.prompt(menu).then((answer) => {
    if (answer.menuList === "View Departments") {
      db.query("SELECT * FROM department", function (err, results, fields) {
        console.table(results);
      });
      start();
    } else if (answer.menuList === "View Roles") {
      db.query("SELECT * FROM role", function (err, results, fields) {
        console.table(results);
      });
    } else if (answer.menuList === "View Employees") {
      db.query("SELECT * FROM employee", function (err, results, fields) {
        console.table(results);
      });
    } else if (answer.menuList === "Add a Department") {
      //TODO: add department
      inquirer.prompt(prompts.addDep).then((depAnswers) => {
        const depResults = JSON.stringify(depAnswers.addDep);
        console.log(depAnswers.addDep);
        db.query(`INSERT INTO department(name) VALUES(${depAnswers.addDep});`);
      });
    } else if (answer.menuList === "Add a Role") {
      //TODO: add role
    } else if (answer.menuList === "Add an Employee") {
      //TODO: add employee
    } else if (answer.menuList === "Update Existing Employee") {
      //TODO: update employee
    } else {
      process.exit(0);
    }
  });
}

start();
