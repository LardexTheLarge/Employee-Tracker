const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

db.query("SELECT * FROM department", function (err, results, fields) {
  console.table(results);
});

db.query("SELECT * FROM role", function (err, results, fields) {
  console.table(results);
});

db.query("SELECT * FROM employee", function (err, results, fields) {
  console.table(results);
});
