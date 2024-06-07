const mysql = require('mysql2/promise');
const fs = require('fs');

// Read the config.json file
const config = require('../config.json');

const connections = {};

async function initializeConnections() {
    for (const dbConfig of config.dbConnections) {
        try {
            const connection = await mysql.createConnection({
                                                                host: dbConfig.host,
                                                                user: dbConfig.user,
                                                                password: dbConfig.password,
                                                                database: dbConfig.database
                                                            });
            connections[dbConfig.name] = connection;
            console.log(`Connected to ${dbConfig.name} database`);
        } catch (error) {
            console.error(`Error connecting to ${dbConfig.name} database: `, error);
        }
    }
}

initializeConnections();

module.exports = connections;
