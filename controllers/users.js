
var v = require('./validation');

function register(req, res) {
    var h = v.hasKeys('email', 'password');
    var regInputCheck  = v.checker(h);
    var errors = regInputCheck(req);
    if (errors.length > 0) {
        res.statusCode = 400;
        return res.json(errors);
    }
}

function login(req, res) {

}

module.exports = {
    register: register,
    login: login
};
