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

const getUserBySession = async (sessionkey, pool) => {
    let statement = "Select users.user_id, username from users, sessions where sessions.user_id = users.user_id and sessions.sessionkey = $1";
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

const addNewGame = async (p_win, p_loose, is_draw, pool) => {
    let statement = "INSERT INTO games (p_win, p_loose, is_draw) VALUES ($1, $2, $3)";
    let values = [p_win, p_loose, is_draw];
    console.log(values);
    pool.query(statement, values);
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const getSession = async (user, pool) => {
    let statement = "Select * from sessions as sess natural join users where sess.user_id = $1";
    let values = [user];
    let resp, error;
    try {
        resp = await pool.query(statement, values);
        if (resp.rows[0]) {
            const date = new Date(resp.rows[0].creation_date);
            if (date.getTime() + (1000 * 60 * 60 * 24) > new Date().getTime()) { 
                return resp;
            } else {
                let uuid = uuidv4();
                let statement = "UPDATE sessions SET sessionkey = $1, creation_date = $3 WHERE user_id = $2 RETURNING *";
                let values = [uuid, resp.rows[0].user_id, new Date()];
                resp = await pool.query(statement, values)
                    .catch((err) => {
                        console.log(err);
                    });
                return resp;
            }
        }
    } catch (err) {
        error = err;
    }
    return {
        resp,
        error
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
                    console.log(user_id.resp.rows[0]);
                    getSession(user_id.resp.rows[0].user_id, pool).then((session) => {
                        res.send(session.rows[0]);
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
    addNewGame,
    getUserBySession
}