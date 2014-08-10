var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VaccineSchema = new Schema({
    name: String,
    group: String,
    daysFromBirth : Number
});

console.log('setting up vaccine schema');
mongoose.model('Vaccine', VaccineSchema);