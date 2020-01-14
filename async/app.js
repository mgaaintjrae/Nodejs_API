// console.log('Debut');
// getMember((member) => {
//     console.log(member);
//     getArticles(member, (articles) => {
//         console.log(articles)
//     })
// })
// console.log('Fin');

// //Callback (fnction exécuté dès que la tâche est fini)
// function getMember(next) {
//     setTimeout(() => {
//         next('Member 1');
//     }, 1500)
// }
// //gérer plusieurs callback en même temps
// function getArticles(member, next) {
//     setTimeout(() => {
//         next([1, 2, 3])
//     }, 1500)
// }


// les promesses

// console.log('Début');
// new Promise((resolve, reject) => {

//     setTimeout(() => {
//         resolve('All good.')
//         reject(new Error('Error during...'))
//     }, 1500)
// })

// .then(message => console.log(message))
// .catch(err => console.log(err.message))

// console.log('Fin');




// console.log('Debut');

// getMember()
//     .then(member => getArticles(member))
//     .then(articles => console.log(articles))
//     .catch(err => console.log(err.message))


// //Promesse
// function getMember() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log('Member 1')
//             resolve('Member 1');
//             // reject(new Error('Error during getMember()'))
//         }, 1500)
//     })
// }

// function getArticles(member) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             // resolve([1, 2, 3])
//             reject(new Error('Error during getArticles()'))
//         }, 1500)
//     })
// }

// console.log('Fin');


//*****Promesses en parallèle

// console.log('Début');

// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('promise 1')
//     }, 1500)
// })

// let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('promise 2')
//     }, 3000)
// })

// // .all --> attend que ttes les promesse soit faite et affiche les résultats dans un array
// Promise.all([p1, p2])
//     .then(result => console.log(result))

// // .race --> compare la vitesse de chaque promesse et afficht la plus rapide
// Promise.race([p1, p2])
//     .then(result => console.log(result))

// console.log('Fin');

// *******  AWAIT / ASYNC

console.log('Début');
//exécution d'une fonction anonyme
// (() => {
//     console.log('Milieu')
// })()

(async () => {
    try {
        let member = await getMember()
        let articles = await getArticles(member)
        console.log(articles)
    } catch (err) {
        console.log(err.message)
    }
})()

function getMember() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Member 1')
        }, 1500)
    })
}

function getArticles() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([1, 2, 3])
        }, 1500)
    })
}


console.log('Fin');