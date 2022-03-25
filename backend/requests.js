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

module.exports = {
    gets
}