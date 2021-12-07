const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");

const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");


const render = require("./src/page-template.js");

const teamMembers = [];
const idArray = [];

function appMenu() {

  function createManager() {
    console.log("\x1b[32m", "Create your team.");
    inquirer.prompt([
      {
        type: "input",
        name: "managerName",
        message: "What is the manager's name?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "Enter at least one character(letter or number)";
        }
      },
      {
        type: "input",
        name: "managerId",
        message: "What is the manager's id?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            return true;
          }
          return "Please enter a positive integer number ex: 34, 755, 1020";
        }
      },
      {
        type: "input",
        name: "managerEmail",
        message: "What is the manager's email?",
        validate: answer => {
          const pass = answer.match(
            /\S+@\S+\.\S+/
          );
          if (pass) {
            return true;
          }
          return "Please enter a valid email address.";
        }
      },
      {
        type: "input",
        name: "managerOfficeNumber",
        message: "What is the manager's office number?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "Enter at least one character(letter or number)";
        }
      },
    ]).then(answers => {
      const manager = new Manager(answers.managerName, answers.managerId, answers.managerEmail, answers.managerOfficeNumber);
      teamMembers.push(manager);
      idArray.push(answers.managerId);
      createTeam();
    });
  }



  function createTeam() {
    inquirer.prompt([
      {
        type: "list",
        name: "memberAddition",
        message: "Which type of member would you like to add to the team?",
        choices: [
          "Engineer",
          "Intern",
          "There are no more team members"
        ]
      }
    ]).then(userChoice => {
      if (userChoice.memberAddition == "Engineer") {
        return addEngineer();
      } else if (userChoice.memberAddition == "Intern") {
        return addIntern();
      } else {
        buildTeam();
      }
    }
    );
  }



  function addEngineer() {
    inquirer.prompt([
      {
        type: "input",
        name: "engineerName",
        message: "What is the engineer's name?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "Please enter at least one character.";
        }
      },
      {
        type: "input",
        name: "engineerId",
        message: "What is the engineer's id?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            if (idArray.includes(answer)) {
              return "This ID is already in use. Please enter a different number.";
            } else {
              return true;
            }

          }
          return "Please enter a positive integer number greater than zero.";
        }
      },
      {
        type: "input",
        name: "engineerEmail",
        message: "What is the engineer's email?",
        validate: answer => {
          const pass = answer.match(
            /\S+@\S+\.\S+/
          );
          if (pass) {
            return true;
          }
          return "Please enter a valid email address.";
        }
      },
      {
        type: "input",
        name: "engineerGithub",
        message: "What is the engineer's GitHub username?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "Please enter at least one character.";
        }
      }
    ]).then(answers => {
      const engineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.engineerGithub);
      teamMembers.push(engineer);
      idArray.push(answers.engineerId);
      createTeam();
    });
  }



  function addIntern() {
    inquirer.prompt([
      {
        type: "input",
        name: "internName",
        message: "What is the intern's name?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "Please enter at least one character.";
        }
      },
      {
        type: "input",
        name: "internId",
        message: "What is the intern's id?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            if (idArray.includes(answer)) {
              return "This ID is already in use. Please enter a different number.";
            } else {
              return true;
            }

          }
          return "Please enter a positive number greater than zero.";
        }
      },
      {
        type: "input",
        name: "internEmail",
        message: "What is the intern's email?",
        validate: answer => {
          const pass = answer.match(
            /\S+@\S+\.\S+/
          );
          if (pass) {
            return true;
          }
          return "Please enter a valid email address.";
        }
      },
      {
        type: "input",
        name: "internSchool",
        message: "What is the intern's university name?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "Please enter at least one character.";
        }
      }
    ]).then(answers => {
      const intern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.internSchool);
      teamMembers.push(intern);
      idArray.push(answers.internId);
      createTeam();
    });
  }
  function buildTeam() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8");
  }

  createManager();

}

appMenu();
