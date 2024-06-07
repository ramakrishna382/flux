const dbManager = require('./dbManager');

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const createEmployeesTable = `
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  employee_code VARCHAR(100) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

async function initializeTables() {
    try {
        await dbManager.query('primary', createUsersTable);
        console.log('Users table ensured.');
        await dbManager.query('primary', createEmployeesTable);
        console.log('Employees table ensured.');
    } catch (error) {
        console.error('Error initializing tables:', error);
    }
}

module.exports = {initializeTables};
