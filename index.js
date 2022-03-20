const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
// const router = express.Router();


const promptUser = () => {
    function beginApp () {
        inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                message: 'what would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add department', 'Add role', 'Add employee', 'Update employee role']
            }
        ]).then((res) => {
            switch (res.options) {
                case 'View all departments':
                    const sql = `SELECT * FROM department`;
                    db.query(sql, (err, rows) => {
                        if (err) {
                        throw err;
                        }
                        console.table(rows);
                        beginApp();
                    });
                    break;
                case 'View all roles':
                    // const sql2 = `SELECT * FROM roles`;
                    // working on adding the name of the department instead of the id
                    const sql2 = `SELECT roles.id, roles.title, roles.salary, department.department_name
                    FROM roles
                    LEFT JOIN department
                    ON roles.department_id = department.id`
                    db.query(sql2, (err, rows) => {
                        if (err) {
                        throw err;
                        }
                        console.table(rows);
                        beginApp();
                    });
                    break;
                case 'View all employees':
                    // const sql3 = `SELECT * FROM employee`;
                    // const sql3 = `SELECT employee.*, roles.title, department.department_name
                    // FROM employee
                    // LEFT JOIN roles ON employee.roles_id = roles.id
                    // LEFT JOIN department ON roles.department_id = department.department_name`
                    // const sql3 = `SELECT employee.*, roles.title, roles.salary, department.department_name, CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                    // FROM employee
                    // LEFT JOIN roles ON employee.roles_id = roles.id
                    // LEFT JOIN department ON roles.department_id = department.id
                    // LEFT JOIN employee manager ON employee.manager_id = manager.id`
                    const sql3 = `SELECT employee.id, employee.first_name, employee.last_name, employee.email, roles.title, roles.salary, department.department_name, CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                    FROM employee
                    LEFT JOIN roles ON employee.roles_id = roles.id
                    LEFT JOIN department ON roles.department_id = department.id
                    LEFT JOIN employee manager ON employee.manager_id = manager.id`
                    db.query(sql3, (err, rows) => {
                        if (err) {
                        throw err;
                        }
                        console.table(rows);
                        beginApp();
                    });
                    break;
                case 'Add department':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'department',
                            message: 'What is the name of the new department?'
                        }
                    ])
                    .then(answer => {
                        const sql4 = `INSERT INTO department (department_name)
                        VALUES (?)`;
                        const params = answer.department;
                        db.query(sql4, [params], (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log('New department added!')
                            beginApp();
                        })
                    })
                    break;
                case 'Add role':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'title',
                            message: 'What is the title of the new role?'
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'What is the salary for this role'
                        }
                    ])
                    .then(async answer => {
                        // is this where i would want to use the a Role() constructor
                        const [rows] = await loadDept();
                        console.log(rows)

                        const departmentsArr= rows.map(department => ({
                            name: department.department_name,
                            value: department.id
                        }));

                        console.log(departmentsArr)
                        inquirer.prompt(
                            {
                                message: 'What department do they belong to?',
                                name: 'departId',
                                type: 'list',
                                choices: departmentsArr
                            }
                        ).then(deptAns => {
                            const sql = `INSERT INTO roles (title, salary, department_id)
                            VALUES (?, ?, ?)`;
                            const params = [answer.title, answer.salary, deptAns.departId];
                            db.query(sql, params, (err) => {
                                if (err) {
                                    throw err;
                                }
                                console.log('New role added!')
                                beginApp();
                            })
                        })
                
                        // const sql4 = `INSERT INTO roles (title)
                        // VALUES (?)`;
                        // const params = answer.name;
                        // db.query(sql, params, (err) => {
                        //     if (err) {
                        //         throw err;
                        //     }
                        //     console.log('New role added!')
                        // })
                    })
                    break;
                case 'Add employee':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: 'What is their first name'
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: 'What is their last name'
                        },
                        {
                            type: 'input',
                            name: 'email',
                            message: 'What is their e-mail?'
                        }
                    ])
                    .then(async answer => {
                        const [rows] = await loadRoles();
                        const inquirerRes = answer;

                        const rolesArr = rows.map(roles =>({
                            name: roles.title,
                            value: roles.id
                        }))
                        // console.log(rolesArr);
                        inquirer.prompt(
                            {
                                message: 'What is their role?',
                                name: 'roleId',
                                type: 'list',
                                choices: rolesArr
                            }
                        ).then(async answer => {
                            const [rows] = await loadManager();
                            console.log(rows);
                            const managerArr = rows.map(manager => ({
                                name: manager.first_name,
                                value: manager.id
                            }))
                            inquirer.prompt(
                                {
                                    message: 'Who is their manager?',
                                    name: 'managerId',
                                    type: 'list',
                                    choices: managerArr
                                }
                            ).then(manAns => {
                                const sql = `INSERT INTO employee (first_name, last_name, email, roles_id, manager_id)
                                VALUES (?, ?, ?, ?, ?)`;
                                // console.log(rolesArr);
                                // console.log(managerArr);
                                // console.log(inquirerRes);
                                // console.log(answer);
                                const params = [inquirerRes.first_name, inquirerRes.last_name, inquirerRes.email, answer.roleId, manAns.managerId]
                                // console.log(params);
                                db.query(sql, params, (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log('New employee added!');
                                    beginApp();
                                })
                    
                            })
                            // console.log(rolesArr);
                            // console.log(managerArr);
                        })
                        
                    })
                    break;
                case 'Update employee role'

                
            }
        })
    }

    beginApp();
};
function loadDept () {
    return db.promise().query("SELECT * FROM department")
}

function loadRoles() {
    return db.promise().query("SELECT * FROM roles")
}
// ??? i have to use some sort of JOIN i believe
function loadManager() {
    return db.promise().query("SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL")
}

promptUser();