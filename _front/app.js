// Modules
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')('dev')

// Variables globales
const app = express()
const port = 8081

// Middlewares
app.use(morgan);
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({
    extended: true
}))

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/views/index.html')
})

// Lancement de l'application
app.listen(port, () => console.log('Started on port ' + port))
