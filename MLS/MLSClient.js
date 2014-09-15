var url = require('url');
var fs = require('fs');

var Promise = require('bluebird');
var request = require('request');
var xmlReader = require('xmlreader');
var fields = require('./fields.json');

var APIToRETSQuery = {
    listprice: 'ListPrice',
    status: 'Status',
    streetnumber: 'StreetNumber',
    streetname: 'StreetName',
    city: 'City',
    zipcode: 'ZipCode'
};

var defaults = {
    status: 'A'
};

function formatSingleRETSQuery(name, value) {
    return '(' + name + '=' + value + ')';
}

function setDefaults(orgParams) {
    var params = _.clone(orgParams);
    Object.keys(defaults).forEach(function(defaultKey) {
        if (!(defaultKey in params)) {
            params[defaultKey] = defaults[defaultKey];
        }
    });
    return params;
}

function formRETSQuery(params) {
    var pairs = [];
    Object.keys(params).forEach(function (param) {
        param = param.toLowerCase();
        if (param in APIToRETSQuery) {
            pairs.push(formatSingleRETSQuery(APIToRETSQuery[param], params[param]));
        }
    });
    return pairs.join(',');
}

function formatURLFromParams(params) {
    var query = {
        SearchType: 'Property',
            Class: 'listing_mrmls_resi',
            Format: 'COMPACT-DECODED',
            Count: '1',
            Limit: params['pagesize'] || 50
    };
    if (params['page']) {
        query.Offset = params['page'];
    }
    params = setDefaults(params);
    query.Query = formRETSQuery(params);
    query.Select = fields.join(',');
    var listingUrlObj = {
        protocol: 'http:',
        hostname: 'rets.mrmlsmatrix.com',
        pathname: '/rets/search.ashx',
        query: query
    };
    var encoded = url.format(listingUrlObj);
    return decodeURIComponent(encoded);
}

function loginToRETS(defaults) {
    return new Promise(function(resolve, reject) {
        var loginUrl = 'http://rets.mrmlsmatrix.com/rets/login.ashx';
        var mlsRequest = request.defaults(defaults); // jar:true enables cookies
        mlsRequest.get(loginUrl, function (error, data) {
            if (error || data && data.statusCode / 100 !== 2) {
                reject(new Error(error || ('ERROR! return status was ' + data.statusCode)));
                return;
            }
            console.log('logged in');
            resolve(mlsRequest);
        }).auth('XSWBMAINSTREET', 'AvQE5ryB', false);
    });
}

function makeListingsCall(mlsRequest, params) {
    return new Promise(function(resolve, reject) {
        var searchURL = formatURLFromParams(params);
        console.log('search url: ' + searchURL);
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
                var data = {};

                var countAtts = res.RETS.COUNT.attributes();
                data.count = parseInt(countAtts.Records);

                var delimiter = '\t';
                var keys = res.RETS.COLUMNS.text().split(delimiter);
                // shift and pop since there are extra leading and trailing tabs
                keys.shift();
                keys.pop();

                var theListings = [];
                if (res.RETS.DATA) {
                    var listings = res.RETS.DATA.array || [res.RETS.DATA];
                    listings.forEach(function (valueObj) {
                        var values = valueObj.text().split(delimiter);
                        values.shift();
                        values.pop();
                        var mlsObj = _.object(keys, values);
                        theListings.push(mlsObj);
                    });
                }
                data.returnedCount = theListings.length;
                data.listings = theListings;
                resolve(data);
            });
        });
    });
}

//function fetchFile(mlsRequest, uri, filename, promise) {
//    mlsRequest.get(uri, function (error, response, body) {
//        if (error || response.statusCode !== 200) {
//            promise.resolve(error);
//            return;
//        }
//        data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
//        console.log(data);
//    });
//}

//function makeImagesCall(mlsRequest, matrixUniqueID) {
//    return new Promise(function (resolve, reject) {
//        var uri = 'http://rets.mrmlsmatrix.com/rets/GetObject.ashx?Resource=Property&Type=LargePhoto&ID=' + matrixUniqueID + ':*&Location=0';
////        fetchFile(mlsRequest, uri, 'realEstate.png', {resolve:resolve, reject:reject});
//        request(uri).pipe(fs.createWriteStream('realEstate.jpg'));
//    });
//}

function makeImageCall(mlsRequest, matrixUniqueID, imageNumber) {
    return new Promise(function(resolve, reject) {
        var uri = 'http://rets.mrmlsmatrix.com/rets/GetObject.ashx?Resource=Property&Type=LargePhoto&ID=' + matrixUniqueID + ':' + imageNumber + '&Location=0';
        mlsRequest.get(uri, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log(error);
                reject(new Error(error));
                return;
            }
            return resolve({contentType:response.headers['content-type'], body:body});
            //data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        });
    });
}

function searchListings(params, cb) {
    loginToRETS({jar: true})
        .then(function (mlsRequest) {
            return makeListingsCall(mlsRequest, params);
        })
        .then(function (data) {
            cb(null, data);
        })
        .catch(function (error) {
            cb(error);
        });
}

//function getImages(matrixUniqueID, cb) {
//    loginToRETS({jar: true, encoding:null})
//        .then(function (mlsRequest) {
//            return makeImagesCall(mlsRequest, matrixUniqueID);
//        })
//        .then(function (data) {
//            cb(null, data);
//        })
//        .catch(function (error) {
//            cb(error);
//        });
//}

function getImage(matrixUniqueID, imageNumber, cb) {
    loginToRETS({jar: true, encoding:null})
        .then(function (mlsRequest) {
            return makeImageCall(mlsRequest, matrixUniqueID, imageNumber);
        })
        .then(function (data) {
            cb(null, data);
        })
        .catch(function (error) {
            cb(error);
        });
}

module.exports = {
    searchListings: searchListings,
    //getImages: getImages,
    getImage: getImage
};
