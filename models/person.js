/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Address = require('./address')
    Schema = mongoose.Schema;

var PersonSchema = new Schema({
    firstName: String,
    lastName: String,
    email : String,
    phoneNumbers : []
    //address: address
});

/**
 * Methods
 */
//PersonSchema.methods = {
//    /**
//     * Authenticate - check if the passwords are the same
//     *
//     * @param {String} plainText
//     * @return {Boolean}
//     * @api public
//     */
//    authenticate: function (plainText) {
//        return this.encryptPassword(plainText) === this.hashed_password;
//    }
//};

console.log('setting up person schema');
mongoose.model('Person', PersonSchema);