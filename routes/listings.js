
var mlsClient = require('../MLS/MLSClient')

exports.list = function (req, res) {

    mlsClient.getListings(req.query, function(error, data) {
        //var dataJSON = JSON.stringify(data);
        console.log(error + ' ' + data);
        if (!error) {
            res.set('Content-Type', 'application/json');
//            res.send('[1,2,3]');
            res.send(data);
            return;
        }
        res.send(error);
    });
};

