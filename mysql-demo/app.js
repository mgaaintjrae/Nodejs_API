const mysql = require('mysql')

//regarder la doc de npmjs.com puis mysql et establishing connections
//afin d'établir la connexion avec la BDD

//paramètre de connexion à la BDD
const db = mysql.createConnection({
    host: 'localhost',
    database: 'nodejs',
    user: 'root',
    password: ''
})

//Gestion erreur et connexion à la BDD
db.connect((err) => {

    if(err)
    console.log(err.message)
    else {
         console.log('Connected.')

         //Création des requêtes SQL (dans performing queries dans la doc)
         db.query('SELECT * FROM members', (err, result) => {
             if(err)
             console.log(err.message)
             else
             console.log(result[0].name)
         })
    }   
})




