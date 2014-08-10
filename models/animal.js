
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnimalSchema = new Schema({
    name: String,
    oldNames : [],
    chipIDs: [],
    species: String,
    breed: String,
    color: String,
    gender: String,
    notes: [],
    spayedNeutered : Boolean,
    needsAdoption: Boolean
});

console.log('setting up animal schema');
mongoose.model('Animal', AnimalSchema);