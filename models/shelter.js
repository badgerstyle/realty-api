var mongoose = require('mongoose'),
    Address = require('./address'),
    Schema = mongoose.Schema;

var ShelterSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    location : Number,
    _primaryAdminId : Schema.Types.ObjectId,
    website : String,
    email : String,
    phoneNumbers : [],

    address : [Address]




//    address: {
//        type: Schema.ObjectId,
//        ref: 'Address'
//    }

//    address:
//    {
//        type: address,
//        unique: true,
//        required: true
//    }
}, {strict : true});

module.exports = mongoose.model('Shelter', ShelterSchema);
