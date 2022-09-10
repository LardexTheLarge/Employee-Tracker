const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const menu = () => {
  return inquirer
    .prompt({
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
    })
    .then((res) => {
      let choice = res.menuList;
      start(choice);
    });
};

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

const addRoles = () => {
  db.query("SELECT * FROM department;", function (err, results) {
    let departments = results;
    inquirer
      .prompt([
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
          name: "departmentId",
          message: "Enter Role's Department:",
          type: "list",
          choices: departments.map((departmentId) => {
            return {
              name: departmentId.name,
              value: departmentId.id,
            };
          }),
        },
      ])
      .then((answers) => {
        console.log(answers);
        db.query(`INSERT INTO role SET ?`, {
          title: answers.title,
          salary: answers.salary,
          department_id: answers.departmentId,
        });
        menu();
      });
  });
};

let managers;
const setManagers = (rows) => {
  managers = rows;
  // console.log(managers);
};

const addEmployee = () => {
  db.query("SELECT * FROM employee;", function (err, results) {
    // console.log(results);
    setManagers(results);
  });

  db.query(" SELECT * FROM role;", function (err, results) {
    let roles = results;
    inquirer
      .prompt([
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
          type: "list",
          message: "Enter employee's role:",
          name: "empRole",
          choices: roles.map((role) => {
            return {
              name: role.title,
              value: role.id,
            };
          }),
        },
        {
          type: "list",
          message: "Enter employee's manager:",
          name: "empManager",
          choices: managers.map((manager) => {
            return {
              name: manager.first_name + " " + manager.last_name,
              value: manager.id,
            };
          }),
        },
      ])
      .then((answers) => {
        db.query("INSERT INTO employee SET ?", {
          first_name: answers.firstName,
          last_name: answers.lastName,
          role_id: answers.empRole,
          manager_id: answers.empManager,
        });
        menu();
      });
  });
};

const updateEmployee = () => {
  db.query("SELECT * FROM employee;", function (err, results) {
    // console.log(results);
    setManagers(results);
  });

  db.query("SELECT * FROM role;", function (err, res) {
    let roles = res;
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee do you want to update:",
          name: "selectEmp",
          choices: managers.map((employee) => {
            return {
              name: employee.first_name + " " + employee.last_name,
              value: employee.id,
            };
          }),
        },
        {
          type: "list",
          message: "Update employee's role:",
          name: "selectRole",
          choices: roles.map((role) => {
            return {
              name: role.title,
              value: role.id,
            };
          }),
        },
        {
          type: "list",
          message: "Update employee's manager:",
          name: "selectManager",
          choices: managers.map((manager) => {
            return {
              name: manager.first_name + " " + manager.last_name,
              value: manager.id,
            };
          }),
        },
      ])
      .then((ans) => {
        db.query("UPDATE employee SET ?, ? WHERE ?;", [
          { role_id: ans.selectRole },
          { manager_id: ans.selectManager },
          { id: ans.selectEmp },
        ]);
        menu();
      });
  });
};

function start(answer) {
  console.log(answer);
  {
    //VIEW departments
    if (answer === "View Departments") {
      db.query("SELECT * FROM department", function (err, results, fields) {
        console.table(results);
        menu();
      });

      //VIEW roles
    } else if (answer === "View Roles") {
      let sql = `SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id;`;
      db.query(sql, function (err, results, fields) {
        console.table(results);
        menu();
      });

      //VIEW employees
    } else if (answer === "View Employees") {
      let sql = `SELECT e.id AS ID, 
e.first_name AS First, 
e.last_name AS Last,
r.title AS Role,
r.salary AS Salary,
m.last_name AS Manager, 
d.name AS Department 
from employee e 
LEFT JOIN employee m ON e.manager_id = m.id 
LEFT JOIN role r ON e.role_id = r.id 
LEFT JOIN department d
ON r.department_id = d.id;`;
      db.query(sql, function (err, results, fields) {
        console.table(results);
        menu();
      });

      //ADD department
    } else if (answer === "Add a Department") {
      inquirer
        .prompt({
          type: "input",
          message: "Add the department you want:",
          name: "addDep",
        })
        .then((depAnswers) => {
          const depResults = JSON.stringify(depAnswers.addDep);
          db.query(
            `INSERT INTO department(name) VALUES(${depResults});`,
            function () {
              menu();
            }
          );
        });

      //ADD role
    } else if (answer === "Add a Role") {
      addRoles();

      //ADD employee
    } else if (answer === "Add an Employee") {
      addEmployee();

      //UPDATE employee
    } else if (answer === "Update Existing Employee") {
      updateEmployee();

      //QUIT
    } else {
      process.exit(0);
    }
  }
}

menu();
