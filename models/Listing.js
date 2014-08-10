var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListingSchema = new Schema({
    uniqueAddress : { type: String,
        index: { unique: true },
        required: true
    },
    mlsData: Object
});

console.log('setting up listing schema');

module.exports = mongoose.model('Listing', ListingSchema);