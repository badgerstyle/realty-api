var users = require('../controllers/users');

module.exports = function(app) {
    app.get('/users', users.list); // todo: remove, this is an example only
    app.post('/user/register', users.register);
    app.post('/user/login', users.login);
};
