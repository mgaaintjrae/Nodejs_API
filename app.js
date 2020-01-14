const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const app = express();
const {
    success,
    error
} = require('./functions');
const bodyParser = require('body-parser');

const members = [{
        id: 1,
        name: 'John'
    },
    {
        id: 2,
        name: 'Julie'
    },
    {
        id: 3,
        name: 'Jack'
    }
]
let MembersRouter = express.Router()

app.use(morgan('dev'));
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

            let index = getIndex(req.params.id);

            if (typeof (index) == 'string') {
                res.json(error(index))
            } else {
                res.json(success(members[index]))
            }
            // res.json(success(members[(req.params.id) - 1].name))
        })

        // Modifié un membre avec son ID
        .put((req, res) => {

            let index = getIndex(req.params.id);

            if (typeof (index) == 'string') {
                res.json(error(index))
            } else {

                let same = false

                for (let i = 0; i < members.length; i++) {
                    if (req.body.name == members[i].name && req.params.id != members[i].id) {
                        same = true
                        break
                    }
                }

                if (same) {
                    res.json(error('same name'))
                } else {
                    members[index].name = req.body.name
                    res.json(success(true))
                }

            }
        })

        // Supprimer un membre avec son ID
        .delete((req, res) => {

            let index = getIndex(req.params.id);

            //on teste si le membre existe
            if (typeof (index) == 'string') {
                res.json(error(index))
            } else {
                //si pas d'erreur on supprime le membre

                members.splice(index, 1)
                res.json(success(members))
            }
        })

//remplace l'URL '/api/v1/members'
MembersRouter.route('/')
//localhost:8080/api/v1/members?max=2

// Récupère tous les membres
.get((req, res) => {

    if (req.query.max != undefined && req.query.max > 0) {
        res.json(success(members.slice(0, req.query.max)))
    } else if (req.query.max != undefined) {
        res.json(error('Wrong max value'))
    } else {
        res.json(success(members))
    }
})

// Ajouter un membre
.post((req, res) => {

    if (req.body.name) {

        let sameName = false

        for (let i = 0; i < members.length; i++) {
            if (members[i].name == req.body.name) {
                sameName = true
                break
            }
        }

        if (sameName) {
            res.json(error('Name already taken'))
        } else {
            let member = {
                id: createID(),
                name: req.body.name
            }

            members.push(member)

            res.json(success(member))

        }

    } else {
        res.json(error('No name value'))
    }

})

app.use(config.rootAPI+'members', MembersRouter)

app.listen(config.port, () => console.log('Started on port'+config.port))

//function permettant de récupérer les membres
function getIndex(id) {
    for (let i = 0; i < members.length; i++) {
        if (members[i].id == id)
            return i
    }
    return 'wrong id'
}

function createID() {
    return lastMember = members[members.length - 1].id + 1
}