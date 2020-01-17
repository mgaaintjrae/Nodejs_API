const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')('dev')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger.json');
const config = require('./assets/config');


const {
    success,
    error,
    checkAndChange
} = require('./assets/functions');
const mysql = require('promise-mysql');



//paramètre de connexion à la BDD
mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
}).then((db) => {

    //application encapsulé à la connexion de la BDD
    console.log('Connected.')

    const app = express();   

    let MembersRouter = express.Router()
    let Members = require('./assets/classes/Members')(db, config)
    // console.log(Members);
    //permet de voir les requête HTTP
    app.use(morgan);
    app.use(bodyParser.json()) // for parsing application/json
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(config.rootAPI+'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    //remplace l'URL '/api/v1/members/:id'
    MembersRouter.route('/:id')

        // Récupère un membre avec son ID
        .get(async (req, res) => {
            let member = await Members.getByID(req.params.id, req.body.name)
            res.json(checkAndChange(member))
        })


        // Modifier un membre avec son ID
        .put(async (req, res) => {
            let editMember = await Members.edit(req.params.id, req.body.name)
            res.json(checkAndChange(editMember))           
        })

        // Supprimer un membre avec son ID
        .delete(async (req, res) => {
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))
        })

    //remplace l'URL '/api/v1/members'
    MembersRouter.route('/')
        //localhost:8080/api/v1/members?max=2

        // Récupère tous les membres
        .get(async (req, res) => {
            let allMembers = await Members.getAll(req.query.max)
            res.json(checkAndChange(allMembers))
        })

        // Ajouter un membre avec son nom
        .post(async (req, res) => {
            let addMember = await Members.add(req.body.name)
            res.json(checkAndChange(addMember))
        })

    app.use(config.rootAPI + 'members', MembersRouter)

    app.listen(config.port, () => console.log('Started on port' + config.port))



}).catch((err) => {
    console.log('Error during database connection')
    console.log(err.message)
})