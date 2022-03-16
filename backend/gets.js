module.exports = {
    defineGetRoutes: function(app) {
        app.get('/testdata', (req, res, next) => {
            console.log("TEST DATA :");
            pool.query('Select * from test')
                .then(testData => {
                    console.log(testData);
                    res.send(testData.rows);
                })
        })
    }
}