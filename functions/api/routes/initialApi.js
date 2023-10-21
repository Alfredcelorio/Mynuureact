

module.exports.controller = (app) => { 
    app.get('/hello', (req, res) => {
    res.status(200).json({message: "hello"})
})
}