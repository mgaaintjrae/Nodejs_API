console.log('Debut');
getMember((member) => {
    console.log(member);
    getArticles(member, (articles) => {
        console.log(articles)
    })
})
console.log('Fin');

//Callback (fnction exécuté dès que la tâche est fini)
function getMember(next) {
    setTimeout(() => {
        next('Member 1');
    }, 1500)
}
//gérer plusieurs callback en même temps
function getArticles(member, next) {
    setTimeout(() => {
        next([1, 2, 3])
    }, 1500)
}