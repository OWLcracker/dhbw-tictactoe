const {response} = require("express");

const user_exists = async (user, pool) => {
    let statement = "Select * from users where username = $1";
    let values = [user];
    let resp;
    let error;
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
const gets = (app, pool) => {
    app.get('/loginuser', (req, res, next) => {
        console.log("Login User :");
        pool.query('Select * from users')
            .then(Users => {
                console.log(Users);
                res.send(Users.rows);

            })
    })
}

const posts = (app, pool) => {
app.post('/login', (req, res) => {
    let user_name = req.body.user;
    let password = req.body.password;

    user_exists(user_name, pool).then((response)=>{
        if(response.error){
            res.status(400).send();
        }else{
            if(response.resp.rows[0]){
                res.send(response.resp.rows[0]);
            }else{
                res.status(404).send();
            }
        }
    });

});
}

module.exports = {
    gets,
    posts
}