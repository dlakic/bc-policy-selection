const UserModel = require('../models/user');

function getUserByName(username) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({'username': username})
            .then(queriedUser => {
                resolve(queriedUser)
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

function createUser(username) {
    return new Promise((resolve, reject) => {
        UserModel.create({'username': username})
            .then(savedPolicy => {
                resolve(savedPolicy)
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

module.exports = {
    getUserByName,
    createUser,
};