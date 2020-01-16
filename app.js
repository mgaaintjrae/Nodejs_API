const express = require('express');
const morgan = require('morgan')('dev')
const config = require('./assets/config');

const {
    success,
    error,
    checkAndChange
} = require('./assets/functions');
const mysql = require('promise-mysql');
const bodyParser = require('body-parser');


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

    //remplace l'URL '/api/v1/members/:id'
    MembersRouter.route('/:id')

        // Récupère un membre avec son ID
        .get(async (req, res) => {
            let member = await Members.getByID(req.params.id)
            res.json(checkAndChange(member))
        })


        // Modifié un membre avec son ID
        .put((req, res) => {

            if (req.body.name) {

                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                    if (err) {
                        res.json(error(err.message))
                    } else {

                        if (result[0] != undefined) {

                            db.query('SELECT * FROM members WHERE name = ? AND id != ?', [req.body.name, req.params.id], (err, result) => {
                                if (err) {
                                    res.json(error(err.message))
                                } else {

                                    if (result[0] != undefined) {
                                        res.json(error('same name'))
                                    } else {

                                        db.query('UPDATE members SET name = ? WHERE id = ?', [req.body.name, req.params.id], (err, result) => {
                                            if (err) {
                                                res.json(error(err.message))
                                            } else {

                                                res.json(success(true))
                                            }
                                        })
                                    }
                                }
                            })

                        } else {
                            res.json(error('Wrong id'))
                        }
                    }
                })

            } else {
                res.json(error('No name value'))
            }

        })

        // Supprimer un membre avec son ID
        .delete((req, res) => {

            //On teste si l'ID existe
            db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                if (err) {
                    res.json(error(err.message))
                } else {

                    if (result[0] != undefined) {

                        db.query('DELETE FROM members WHERE id = ?', [req.params.id], (err, result) => {
                            if (err) {
                                res.json(error(err.message))
                            } else {
                                res.json(success(true))

                            }
                        })

                    } else {
                        res.json(error('Wrong id'))
                    }
                }
            })

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