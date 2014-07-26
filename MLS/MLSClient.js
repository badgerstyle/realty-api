var mlsRequest = require('request');
var parser = require('xml2json');

function getListings(params, cb) {

    var loginUrl = 'http://rets.mrmlsmatrix.com/rets/login.ashx';
    var listingsUrl = 'http://rets.mrmlsmatrix.com/rets/search.ashx?SearchType=Property&Class=listing_mrmls_resi&Query=(ListPrice=950000-1000000),(ZipCode=90004)';

    var options = {
        object: false,
        reversible: false,
        coerce: true,
        sanitize: false,
        trim: true,
        arrayNotation: false
    };
    var request = mlsRequest.defaults({jar: true}); // jar enables cookies

    request.get(loginUrl, function (error, response, body) {
        if (error) {
            console.log(error);
            cb(error);
            return;
        }
        //var sessionCookie = mlsRequest
        request.get(listingsUrl, function (error, response, body) {
            if (error) {
                console.log(error);
                cb(error);
                return;
            }
            if (response.statusCode / 100 !== 2) {
                console.log('ERROR!');
                cb('ERROR! return status was ' + response.statusCode);
                return;
            }
            var json = parser.toJson(body, options); //returns a string containing the JSON structure by default
            cb(error, json);
        }).auth('XSWBMAINSTREET', 'AvQE5ryB', false);

    }).auth('XSWBMAINSTREET', 'AvQE5ryB', false);

}

module.exports = {
    getListings : getListings
};