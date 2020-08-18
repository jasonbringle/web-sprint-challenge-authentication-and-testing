const db = require('../database/dbConfig.js');

module.exports = {
    register,
    findUser,
    remove
}


function register(user){
    return db('users')
        .insert(user)
        .then(val =>{
            return db("users")
                .where({id:val[0]})
        })
}

function findUser(user){
    return db('users')
        .where({username:user.username})
        .then(found => {
            return found[0]})
}

function remove(id){
    return db('users').where("id", id).del()
}


