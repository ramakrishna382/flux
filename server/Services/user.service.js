const dbManager = require('../database/dbManager');

module.exports.getAllEmployees = async () => {
    const sql = 'SELECT * FROM employees';
    return await dbManager.query('primary', sql);
};

module.exports.getEmployeeById = async (id) => {
    const sql = 'SELECT * FROM employees WHERE id = ?';
    return await dbManager.query('primary', sql, [id]);
};

module.exports.deleteEmployee = async (id) => {
    const sql = 'DELETE FROM employees WHERE id = ?';
    const result = await dbManager.query('primary', sql, [id]);
    return result.affectedRows;
};

module.exports.addOrEditEmployee = async (obj, id = 0) => {
    const sql = 'CALL usp_employee_add_or_edit(?, ?, ?, ?)';
    const result = await dbManager.query('primary', sql, [id, obj.name, obj.employee_code, obj.salary]);
    return result.affectedRows;
};
