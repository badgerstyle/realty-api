var listings = require('../controllers/listings');

module.exports = function(app) {
    app.get('/listings/search', listings.search);
    app.get('/listings/images/:id', listings.getImages);
    app.get('/listings/images/:id/:imageNumber', listings.getImage);
};
