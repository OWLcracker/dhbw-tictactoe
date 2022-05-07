const {response} = require("express");

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

const getSession = async (user, pool) => {
    let statement = "Select * from sessions as sess, users where sess.user_id = users.user_id and sess.user_id = $1";
    let values = [user];
    try {
        resp = await pool.query(statement, values)
        if(resp.rows[0]){
           // if(resp.rows[0].creationDate > now?); // hier weiter machen
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

    user_authenticate(user_name, password, pool).then((bool)=>{
        if(bool){
            //generate session key and set it in db
            res.send("generated session key");
        }else{
            res.status(404).send();
        }
    });

});
}

module.exports = {
    gets,
    posts
}