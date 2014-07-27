var mlsRequest = require('request');
var parser = require('xml2json');
var url = require('url');
var _ = require('underscore');

var inputs = {
    'listprice': 'ListPrice',
    'zipcode': 'ZipCode'
};

function formatSingleRETSQuery(name, value) {
    return '(' + name + '=' + value + ')';
}

function formRETSQuery(params) {
    var pairs = [];
    Object.keys(params).forEach(function (param) {
        if (param in inputs) {
            pairs.push(formatSingleRETSQuery(inputs[param], params[param]));
        }
    });
    return pairs.join(',');
}

function formatURLFromParams(params) {
    var listingUrlObj = {
        protocol: 'http:',
        hostname: 'rets.mrmlsmatrix.com',
        pathname: '/rets/search.ashx',
        query : {
            'SearchType': 'Property',
            'Class': 'listing_mrmls_resi'
        }
    };

    var RETSQuery = formRETSQuery(params);
    //listingUrlObj.query = listingUrlObj.query + '&Query' + RETSQuery;
    listingUrlObj.query.Query =  RETSQuery;
    var encoded = url.format(listingUrlObj);
    var uri_dec = decodeURIComponent(encoded);
    return uri_dec;
    //'http://rets.mrmlsmatrix.com/rets/search.ashx?Query=(ListPrice=950000-1000000),(ZipCode=90004)';
}

function getListings(params, cb) {

    var loginUrl = 'http://rets.mrmlsmatrix.com/rets/login.ashx';
    var searchURL = formatURLFromParams(params);

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
        request.get(searchURL, function (error, response, body) {
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
        });//.auth('XSWBMAINSTREET', 'AvQE5ryB', false);

    }).auth('XSWBMAINSTREET', 'AvQE5ryB', false);

}

module.exports = {
    getListings: getListings
};