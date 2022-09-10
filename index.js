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

// const addEmployee = async () => {
//   try {
//     console.log("Employee Add");

//     let roles = await db.query("SELECT * FROM role;");

//     let managers = await db.query("SELECT * FROM employee;");

//     let answer = await inquirer.prompt([
//       {
//         name: "firstName",
//         type: "input",
//         message: "What is the first name of this Employee?",
//       },
//       {
//         name: "lastName",
//         type: "input",
//         message: "What is the last name of this Employee?",
//       },
//       {
//         name: "employeeRoleId",
//         type: "list",
//         choices: roles.map((role) => {
//           return {
//             name: role.title,
//             value: role.id,
//           };
//         }),
//         message: "What is this Employee's role id?",
//       },
//       {
//         name: "employeeManagerId",
//         type: "list",
//         choices: managers.map((manager) => {
//           return {
//             name: manager.first_name + " " + manager.last_name,
//             value: manager.id,
//           };
//         }),
//         message: "What is this Employee's Manager's Id?",
//       },
//     ]);

//     let result = await db.query("INSERT INTO employee SET ?", {
//       first_name: answer.firstName,
//       last_name: answer.lastName,
//       role_id: answer.employeeRoleId,
//       manager_id: answer.employeeManagerId,
//     });

//     console.log(`${answer.firstName} ${answer.lastName} added successfully.\n`);
//     menu();
//   } catch (err) {
//     console.log(err);
//     menu();
//   }
// };

const addEmployee = () => {
  var employee = db.query("SELECT * FROM employee;");
  console.log(employee);
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
          choices: roles.map((manager) => {
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

const prompts = {
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
      addEmployee();

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
