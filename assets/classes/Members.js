let db, config

module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Members
}


let Members = class {

    //récupération d'un membre par son id
    //appel de la method sans l'initialisation de l'objet
    static getByID(id) {

        return new Promise((next) => {

            db.query('SELECT * FROM members WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] != undefined)
                        next(result[0])
                    else
                        next(new Error('Wrong id'))

                }).catch((err) => next(err))

        })

    }

    //récupération de tous les membres
    static getAll(max) {

        return new Promise((next) => {

            if (max != undefined && max > 0) {
                db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(max)])
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } else if (max != undefined) {
                next(new Error('Wrong max value'))
            } else {
                db.query('SELECT * FROM members')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            }
        })
    }

    //Ajouter un membre
    static add(name) {

        return new Promise((next) => {

            //si le nom est différent d'undefined et que son trim soit différent de rien
            if (name != undefined && name.trim() != '') {

                name = name.trim()

                db.query('SELECT * FROM members WHERE name = ?', [name])
                    .then((result) => {
                        //Vérifie si il y a déjà un membre
                        if (result[0] != undefined) {
                            //si oui on balance l'erreur
                            next(new Error('Name already taken'))

                        } else {
                            //sinon on renvoi la promesse qui permet d'insérer le nouveau membre
                            return db.query('INSERT INTO members(name) VALUES(?)', [name])
                        }
                    })
                    .then(() => {
                        return db.query('SELECT * FROM members WHERE name = ?', [name])

                    })
                    .then((result) => {
                        next({
                            id: result[0].id,
                            name: result[0].name
                        })
                    })
                    .catch((err) => next(err))

            } else {
                next(new Error('No name value'))
            }
        })
    }

    //Supprimer un membre
    static delete(id) {

        return new Promise((next) => {

            //On teste si l'ID existe
            db.query('SELECT * FROM members WHERE id = ?', [id])
                .then((result) => {
                    //Vérifier si il y a déjà un membre
                    if (result[0] != undefined) {
                        //Si il existe on le supprime
                        return db.query('DELETE FROM members WHERE id = ?', [id])
                    } else {
                        next(new Error('Wrong id'))
                    }
                })
                .then(() => next(true))
                .catch((err) => next(err))
        })
    }
}