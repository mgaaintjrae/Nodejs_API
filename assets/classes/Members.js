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
}