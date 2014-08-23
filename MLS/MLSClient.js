var url = require('url');
var fs = require('fs');

var Promise = require('bluebird');
var request = require('request');
var xmlReader = require('xmlreader');
var fields = require('./fields.json');

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
            'Format': 'COMPACT-DECODED',
            'Select': fields.join(',')
        }
    };

    listingUrlObj.query.Query =  formRETSQuery(params);
    var encoded = url.format(listingUrlObj);
    return decodeURIComponent(encoded);
}

function loginToRETS(params) {
    return new Promise(function(resolve, reject) {
        var loginUrl = 'http://rets.mrmlsmatrix.com/rets/login.ashx';
        var mlsRequest = request.defaults({jar: true}); // jar:true enables cookies
        mlsRequest.get(loginUrl, function (error, data) {
            console.log(data);
            if (error || data && data.statusCode / 100 !== 2) {
                reject(error || 'ERROR! return status was ' + data.statusCode);
                return;
            }
            resolve([params, mlsRequest]);
        }).auth('XSWBMAINSTREET', 'AvQE5ryB', false);
    });
}

function makeListingsCall(params, mlsRequest) {
    return new Promise(function(resolve, reject) {
        var searchURL = formatURLFromParams(params);
        mlsRequest.get(searchURL, function (error, response, body) {
            if (error) {
                console.log(error);
                reject(error);
                return;
            }
            if (response.statusCode / 100 !== 2) {
                console.log('ERROR!');
                reject('ERROR! return status was ' + response.statusCode);
                return;
            }
            xmlReader.read(body, function (err, res) {
                if (err) {
                    reject('Error parsing XML: ');
                    return;
                }
                var atts = res.RETS.attributes();
                if (atts.ReplyCode !== '0') {
                    reject('Failed to make RETS request: ' + atts.ReplyCode + ' ' + atts.ReplyText);
                    return;
                }

                var delimiter = '\t';
                var keys = res.RETS.COLUMNS.text().split(delimiter);
                keys.shift();
                keys.pop();

                var data = [];
                var listings = res.RETS.DATA.array || [res.RETS.DATA];
                listings.forEach(function (valueObj) {
                    var values = valueObj.text().split(delimiter);
                    values.shift();
                    values.pop();
                    var mlsObj = _.object(keys, values);
                    data.push(mlsObj);
                });
                resolve(data);
            });
        });
    });
}


function getImages(matrixUniqueID) {
    var download = function(uri, filename){
        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

    download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
        console.log('done');
    });
}

function getListings(params, cb) {
    loginToRETS(params)
        .spread(makeListingsCall)
        .then(function(data) {
            cb(null, data);
        }).catch(function(error) {
            cb(error);
        });
}


module.exports = {
    getListings: getListings,
    getImages: getImages
};