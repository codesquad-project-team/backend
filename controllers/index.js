const controllers = {};
module.exports = (models) => {
    controllers.post = require('./post')
    controllers.auth = require('./auth')(models)

    return controllers;
}