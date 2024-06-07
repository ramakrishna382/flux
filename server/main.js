const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cluster = require('cluster');
const os = require('os');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));
const dbInit = require('./database/dbInit');

// Ensure db.js initializes the connections
require('./database/db');
// Initialize tables
// dbInit.initializeTables().then(() => {
//     console.log('Database tables initialized');
// }).catch(err => {
//     console.error('Failed to initialize database tables:', err);
// });
if (cluster.isMaster) {
    const numCPUs = config.workers || os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Restart the worker
    });


} else {
    const app = express();

    app.use(cors(config.corsOptions));
    app.use(bodyParser.json());

    app.use(session({
                        secret: config.sessionSecret,
                        resave: false,
                        saveUninitialized: false,
                        cookie: {maxAge: 1000 * 60 * 30} // 30 minutes
                    }));

    // Initialize routes
    const userRoutes = require('./routes/users');
    const loginRoutes = require('./routes/login');

    app.use('/api/users', userRoutes);
    app.use('/auth', loginRoutes);
    app.use('/check', (req, res) => {
        res.send('hai');
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(err.status || 500).send('Something Went Wrong!');
    });

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Custom-Header, Authorization');
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        next();
    });

    app.listen(config.port, () => {

        console.log(`Worker ${process.pid} started on port ${config.port}`);

    });
}
