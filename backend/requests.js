const { response } = require("express");

const user_exists = async (user, pool) => {
    let statement = "Select * from users where username = $1";
    let values = [user];
    let resp, error;
    try {
        resp = await pool.query(statement, values)
    } catch (err) {
        error = err;
    }
    return {
        resp,
        error
    }
}
const user_authenticate = async (user, password, pool) => {
    let statement = "Select * from users where username = $1 and password = $2";
    let values = [user, password];
    try {
        resp = await pool.query(statement, values)
        return !!resp.rows[0];
    } catch (err) {
        return false;
    }
}
const getUserID = async (user_id, pool) => {
    let statement = "Select user_id from users where username = $1";
    let values = [user_id];
    let resp, error;
    try {
        resp = await pool.query(statement, values)
    } catch (err) {
        error = err;
    }
    return {
        resp,
        error
    }
}

const getUserIDbySession = async (sessionkey, pool) => {
    let statement = "Select user_id from sessions where sessionkey = $1";
    let values = [sessionkey];
    let resp, error;
    try {
        resp = await pool.query(statement, values)
    } catch (err) {
        error = err;
    }
    return {
        resp,
        error
    }
}

const getUserName = async (sessionkey, pool) => {
    let statement = "Select username from users, sessions where sessions.user_id = users.user_id and sessions.sessionkey = $1";
    let values = [sessionkey];
    let resp, error;
    try {
        resp = await pool.query(statement, values)
    } catch (err) {
        error = err;
    }
    return {
        resp,
        error
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const getSession = async (user, pool) => {
    let statement = "Select * from sessions as sess, users where sess.user_id = users.user_id and sess.user_id = $1";
    let values = [user];
    try {
        resp = await pool.query(statement, values)
        if (resp.rows[0]) {
            const date = new Date(resp.rows[0].creationDate);
            if (date.getTime() + (1000 * 60 * 60 * 24) > new Date().getTime()) {
                return resp.rows[0];
            } else {
                let uuid = uuidv4();
                let statement = "INSERT INTO sessions (sessionkey, user_id) VALUES ($1, $2)";
                let values = [uuid, response.resp.rows[0].user_id];
                pool.query(statement, values)
                    .then(() => {
                        res.send(uuid); // hier euer cookie
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).send();
                    })
            }
        }
    } catch (err) {
        return false;
    }
}

const gets = (app, pool) => {
    app.get('/loginuser', (req, res, next) => {
        console.log("Login User :");
        pool.query('Select * from users')
            .then(Users => {
                console.log(Users.rows[0].user_id);
                res.send(Users.rows);

            })
    })
}

const posts = (app, pool) => {
    app.post('/login', (req, res) => {
        let user_name = req.body.user;
        let password = req.body.password;

        user_authenticate(user_name, password, pool).then((bool) => {
            if (bool) {
                getUserID(user_name, pool).then((user_id) => {
                    getSession(user_id.resp.rows[0].user_id, pool).then((session) => {
                        res.send(session.rows[0].sessionkey);
                    }).catch((err) => {
                        res.send(err);
                    })
                }
                ).catch((err) => {
                    res.send(err);
                })
            } else {
                res.status(404).send();
            }
        });

    });

    app.post('/getName', (req, res) => {
        let sessionkey = req.body.sessionkey;
        getUserName(sessionkey, pool).then((user) => {
            res.send(user.resp.rows[0].username);
        }).catch((err) => {
            res.send(err);
        });
    });

    app.post('/register', (req, res) => {

        let user_name = req.body.user;
        let password = req.body.password;

        user_exists(user_name, pool).then((response) => {
            if (response.error) {
                res.status(400).send();
            } else {
                if (response.resp.rows[0]) {
                    res.status(406).send(); // STATUS 406, Username existiert bereits
                } else { // User anlegen
                    let statement = "INSERT INTO users (username, password) VALUES ($1, $2)";
                    let values = [user_name, password];
                    pool.query(statement, values)
                        .then(() => {
                            getUserID(user_name, pool).then((response) => {
                                if (response.error) {
                                    console.log(response.error);
                                    res.status(400).send();
                                }
                                else {
                                    let uuid = uuidv4();
                                    let statement = "INSERT INTO sessions (sessionkey, user_id) VALUES ($1, $2)";
                                    let values = [uuid, response.resp.rows[0].user_id];
                                    pool.query(statement, values)
                                        .then(() => {
                                            res.send(uuid); // hier euer cookie
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            res.status(400).send();
                                        })
                                }
                            })
                        })
                        .catch((err) => {
                            res.status(500).send();
                        })
                }
            }
        });


    });
}

module.exports = {
    gets,
    posts,
    getUserName
}