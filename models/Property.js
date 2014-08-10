var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = new Schema({
    address1: { type : String, required : true},
    address2: String,
    city: String,
    state: String,
    zip: String});


