var users = require('../controllers/users');

module.exports = function(app) {
    //app.get('/users', users.list); // todo: remove, this is an example only
    app.post('/users/register', users.register);
    app.post('/users/login', users.login);
};
