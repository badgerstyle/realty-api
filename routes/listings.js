var listings = require('../controllers/listings');

module.exports = function(app) {
    app.get('/listings/search', listings.search);
//    app.get('/listings/images/:id', listings.getImages); // disabled for now, needs work if this will be brought back
    app.get('/listings/images/:id/:imageNumber', listings.getImage);
};
