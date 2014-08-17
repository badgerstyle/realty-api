var mlsRequest = require('request');
var url = require('url');
//var _ = require('underscore');
var xmlreader = require('xmlreader');

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
            'Class': 'listing_mrmls_resi',
            'Format': 'COMPACT-DECODED'
        }
    };

    listingUrlObj.query.Query =  formRETSQuery(params);
    var encoded = url.format(listingUrlObj);
    return decodeURIComponent(encoded);
}

function getListings(params, cb) {

    var loginUrl = 'http://rets.mrmlsmatrix.com/rets/login.ashx';
    var searchURL = formatURLFromParams(params);

    var request = mlsRequest.defaults({jar: true}); // jar:true enables cookies

    request.get(loginUrl, function (error) {
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
            xmlreader.read(body, function (err, res) {
                if (err) {
                    cb('Error parsing XML: ');
                    return;
                }
                var atts = res.RETS.attributes();
                if (atts.ReplyCode !== '0') {
                    cb('Failed to make RETS request: ' + atts.ReplyCode + ' ' + atts.ReplyText);
                    return;
                }

                var delimiter = '\t';
                var keys = res.RETS.COLUMNS.text().split(delimiter);
                keys.shift();
                keys.pop();

                var data = [];
                var listings = res.RETS.DATA.array || [res.RETS.DATA];
                listings.forEach(function(valueObj) {
                    var values = valueObj.text().split(delimiter);
                    values.shift();
                    values.pop();
                    var mlsObj = _.object(keys, values);
                    data.push(mlsObj);
                });
                cb(null, data);
            });
        });
    }).auth('XSWBMAINSTREET', 'AvQE5ryB', false);
}

module.exports = {
    getListings: getListings
};