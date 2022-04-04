const gets = (app, pool) => {
    app.get('/loginuser', (req, res, next) => {
        console.log("Login User :");
        pool.query('Select * from Users')
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

    let statement = "Select * from users where username = $1 and password = $2";
    let values = [user_name, password];

    pool.query(statement, values, (err, resp) => {
        if (err) {
            console.log(err.stack)
            res.end("fail");
        } else {
            console.log(resp.rows[0])
            if(resp.rows[0]){
                res.end("ok");
            } else res.end("fail");

        }
    })
});
}

module.exports = {
    gets,
    posts
}