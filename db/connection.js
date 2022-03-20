const mysql = require('mysql2');

// code that will connect the application to the MySql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySql username
        user: 'root',
        // your MySQL password
        password: 'Foskco420!',
        database: 'employee_tracker'
    },
    console.log('Connected to the election database')
);

module.exports = db;