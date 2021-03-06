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
                        next(new Error(config.errors.wrongID))

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
                next(new Error(config.errors.wrongMaxValue))
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

            //si le nom est différent d'undefined et que son trim est différent de rien
            if (name != undefined && name.trim() != '') {
                name = name.trim() 
                //La méthode trim () supprime les espaces des deux côtés d'une chaîne.

                db.query('SELECT * FROM members WHERE name = ?', [name])
                    .then((result) => {
                        //Vérifie si il y a déjà un membre
                        if (result[0] != undefined) {
                            //si oui on balance l'erreur
                            next(new Error(config.errors.nameAlreadyTaken))
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
                next(new Error(config.errors.noNameValue))
            }
        })
    }

    //Modifier un membre
    static edit(id, name) {

        return new Promise((next) => {

            if (name != undefined && name.trim() != '') {
                name = name.trim()

                //Vérifie si le membre existe
                db.query('SELECT * FROM members WHERE id = ?', [id])
                    .then((result) => {
                        //Si le membre existe
                        if (result[0] != undefined) {
                            return db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name, id])
                        } else {
                            next(new Error(config.errors.wrongID))
                        }
                    })
                    .then((result) => {
                        //Si il existe déjà un membre avec le même nom
                        if (result[0] != undefined) {
                            //alors on balance l'erreur
                            next(new Error(config.errors.sameName))
                        } else {
                            return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id])
                        }
                    })
                    .then(() => next(true))
                    .catch((err) => next(err))
            } else {
                next(new Error(config.errors.noNameValue))
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
                        next(new Error(config.errors.wrongID))
                    }
                })
                .then(() => next(true))
                .catch((err) => next(err))
        })
    }
}