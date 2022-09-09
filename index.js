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
  password: "L@rdexTheL@rge22",
  database: "employee_db",
});

// const managers = db.query("SELECT * FROM employee");
// const roles = db.query("SELECT * FROM role");

const addRoles = () => {
  db.query("SELECT * FROM department;", function (err, results) {
    let departments = results;
    console.log(results);
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

const prompts = {
  addDep: {
    type: "input",
    message: "Enter New Department Name:",
    name: "addDep",
  },
  // addRole: [
  //   {
  //     type: "input",
  //     message: "Enter Role's Title:",
  //     name: "title",
  //   },
  //   {
  //     type: "input",
  //     message: "Enter Role's Salary:",
  //     name: "salary",
  //   },
  //   {
  //     name: "departmentId",
  //     message: "Enter Role's Department:",
  //     type: "list",
  //     choices: departments,
  //   },
  // ],
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
  updateEmp: [
    {
      type: "input",
      message: "Which employee do you want to update:",
      name: "selectEmp",
    },
    {
      type: "input",
      message: "Update employee's role:",
      name: "selectRole",
    },
    {
      type: "input",
      message: "Update employee's manager:",
      name: "selectManager",
    },
  ],
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
      let sql =
        "SELECT employee.id AS id, employee.first_name AS first, employee.last_name AS last, role.title AS role, employee.manager_id AS manager FROM employee JOIN role ON employee.role_id = role.id;";
      db.query(sql, function (err, results, fields) {
        console.table(results);
        menu();
      });

      //ADD department
    } else if (answer === "Add a Department") {
      inquirer.prompt(prompts.addDep).then((depAnswers) => {
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
      inquirer.prompt(prompts.addEmp).then((empAnswers) => {
        db.query(
          `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("${empAnswers.firstName}", "${empAnswers.lastName}", ${empAnswers.empRole},${empAnswers.empManager});`
        );
      });

      //UPDATE employee
    } else if (answer === "Update Existing Employee") {
      inquirer.prompt(prompts.updateEmp).then((updateAns) => {
        db.query(
          `UPDATE employee SET role_id = ${updateAns.selectRole}, manager_id = ${updateAns.selectManager} WHERE id = ${updateAns.selectEmp} `
        );
      });

      //QUIT
    } else {
      process.exit(0);
    }
  }
}

menu();
