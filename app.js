const express = require('express');
const morgan = require('morgan')('dev')
const config = require('./assets/config');

const {
    success,
    error
} = require('./assets/functions');
const mysql = require('mysql');
const bodyParser = require('body-parser');


//paramètre de connexion à la BDD
const db = mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
})

//Gestion erreur et connexion à la BDD
db.connect((err) => {

    if (err)
        console.log(err.message)
    else {

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

        //ajout d'un middelware avec les app.get pour avoir un debug avec l'url dans la console
        // app.use((req, res, next) => {
        //     console.log('URL : ' + req.url);
        //     next()
        // })

        // app.get('/api', (req, res) => {
        //     res.send('Root API')
        // })

        // app.get('/api/v1', (req, res) => {
        //     res.send('API Version 1')
        // })

        // app.get('/api/v1/books/:id', (req, res) => {
        //     res.send(req.params)
        // })

        //rooting
        // app.get('/api/v1/members/:id', (req, res) => {
        //     res.send(members[(req.params.id)-1])
        // })

        // //localhost:8080/api/v1/members?max=2
        // app.get('/api/v1/members', (req, res) => {
        //     if (req.query.max != undefined && req.query.max > 0) {
        //         res.send(members.slice(0, req.query.max))
        //     } else {
        //         res.send(members)
        //     }    
        // })

        //remplace l'URL '/api/v1/members/:id'
        MembersRouter.route('/:id')
            // Récupère un membre avec son ID
            .get((req, res) => {

                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                    if (err) {
                        res.json(error(err.message))
                    } else {

                        if (result[0] != undefined) {
                            res.json(success(result[0]))
                        } else {
                            res.json(error('Wrong id'))
                        }
                    }
                })
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
            .get((req, res) => {

                if (req.query.max != undefined && req.query.max > 0) {

                    db.query('SELECT * FROM members LIMIT 0, ?', [req.query.max], (err, result) => {
                        if (err)
                            res.json(error(err.message))
                        else
                            res.json(success(result))
                    })


                } else if (req.query.max != undefined) {
                    res.json(error('Wrong max value'))
                } else {

                    db.query('SELECT * FROM members', (err, result) => {
                        if (err)
                            res.json(error(err.message))
                        else
                            res.json(success(result))
                    })
                }
            })

            // Ajouter un membre avec son nom
            .post((req, res) => {

                if (req.body.name) {


                    db.query('SELECT * FROM members WHERE name = ?', [req.body.name], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {

                            if (result[0] != undefined) {
                                res.json(error('Name already taken'))
                            } else {
                                db.query('INSERT INTO members(name) VALUES(?)', [req.body.name], (err, result) => {
                                    if (err) {
                                        res.json(error(err.message))
                                    } else {

                                        db.query('SELECT * FROM members WHERE name = ?', [req.body.name], (err, result) => {

                                            if (err) {
                                                res.json(error(err.message))
                                            } else {
                                                res.json(success({
                                                    id: result[0].id,
                                                    name: result[0].name
                                                }))
                                            }
                                        })
                                    }
                                })
                            }

                        }
                    })


                } else {
                    res.json(error('No name value'))
                }

            })

        app.use(config.rootAPI + 'members', MembersRouter)

        app.listen(config.port, () => console.log('Started on port' + config.port))


    }
})

// const members = [{
//         id: 1,
//         name: 'John'
//     },
//     {
//         id: 2,
//         name: 'Julie'
//     },
//     {
//         id: 3,
//         name: 'Jack'
//     }
// ]

