// Entry Point of the API Server

const express = require('express');

/* Creates an Express application.
The express() function is a top-level
function exported by the express module.
*/
const app = express();
const Pool = require('pg').Pool;
const {gets,posts} = require('./requests');
const {openServer} = require('./websocket');



const pool = new Pool({
    user: 'ffblqtjf',
    host: 'kandula.db.elephantsql.com',
    database: 'ffblqtjf',
    password: 'WUUumjBi9nA5b-cgT39pl4pIWbu9-IKN',
    dialect: 'postgres',
    port: 5432
});


/* To handle the HTTP Methods Body Parser
is used, Generally used to extract the
entire body portion of an incoming
request stream and exposes it on req.body
*/
const bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());
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

exports.pool = pool;
gets(app,pool);
posts(app,pool);
openServer();

// Require the Routes API
// Create a Server and run it on the port 3000
const server = app.listen(3000, "localhost");
