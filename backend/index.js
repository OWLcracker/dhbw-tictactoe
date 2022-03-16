// Entry Point of the API Server

const express = require('express');

/* Creates an Express application.
The express() function is a top-level
function exported by the express module.
*/
const app = express();
const Pool = require('pg').Pool;
const geter = require('gets');

const pool = new Pool({
    user: 'zroexyid',
    host: 'rogue.db.elephantsql.com',
    database: 'zroexyid',
    password: 'VOXcZ3LZgiX4BaWBHGogFC_MDmdawuGB',
    dialect: 'postgres',
    port: 5432
});


/* To handle the HTTP Methods Body Parser
is used, Generally used to extract the
entire body portion of an incoming
request stream and exposes it on req.body
*/
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            'Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error(
                'Error executing query', err.stack)
        }
        console.log("Connected to Database !")
    })
})

//wie funktioniert der müll?
geter.defineGetRoutes(app);

// Require the Routes API
// Create a Server and run it on the port 3000
const server = app.listen(3000, "localhost");
