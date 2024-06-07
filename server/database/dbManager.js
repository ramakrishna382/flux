const connections = require('./db');

async function query(connectionName, sql, params) {
    const connection = connections[connectionName];
    if (!connection) {
        throw new Error(`No connection found with name: ${connectionName}`);
    }
    const [results] = await connection.execute(sql, params);
    return results;
}

module.exports = {
    query
};
