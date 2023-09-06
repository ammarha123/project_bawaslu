const mysql = require('mysql');

const dbConnection = mysql.createConnection({
  host: 'localhost', // XAMPP server host (usually 'localhost')
  user: 'root',      // XAMPP MySQL username (default is 'root')
  password: '',      // XAMPP MySQL password (empty by default)
  database: 'bawaslu' // Your specific database name
});

dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = dbConnection;
