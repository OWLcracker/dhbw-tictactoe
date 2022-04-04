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
console.log("User name = "+user_name+", password is "+password);
res.end('yes');
});
}

module.exports = {
    gets,
    posts
}