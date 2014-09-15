var listing = require('../models/Listing');
var mlsClient = require('../MLS/MLSClient');
//var db = require('../app').db;
var Listing = require('../models/Listing.js');
var mongoose = require('mongoose');

function search(req, res) {
    mlsClient.searchListings(req.query, function(error, data) {
        console.log('search response: ' + error + ' ' + JSON.stringify(data));
        if (error) {
            res.status(500);
            res.json({'error': error});
            return;
        }
//        //var addy = data.RETS.REData.REProperties.ResidentialProperty.Listing.StreetAddress;
//        var uniqueAddress = addy.UnitNumber || 'X' + '-' + addy.StreetNumber + '-' + addy.StreetName + '-' + addy.StreetSuffix +
//            addy.City + '-' + addy.StateOrProvince + '-' + addy.County || 'X';
//
////            var uniqueAddress = addy.StreetNumber + '-' + addy.StreetName + '-' + addy.StreetSuffix +
////                addy.City + '-' + addy.StateOrProvince;
//        var listing = new Listing({ uniqueAddress: uniqueAddress, mlsData: data});
//        //new Thread({title: req.body.title, author: req.body.author}).save();
////            var listingCollection = db.collection('listings');
//        listing.save(function (err, result) {
//            if (err) {
//                console.log(err);
//            }
//        });

        res.set('Content-Type', 'application/json');
        res.json(data);
    });
}

function getImages(req, res) {
    var matrixUniqueID = req.params.id;
    if (!matrixUniqueID) {
        res.status(400);
        return res.json({'error': 'ID is a required field'});
    }
    mlsClient.getImages(matrixUniqueID, function (error, data) {
        console.log('get images response: ' + error + ' ' + JSON.stringify(data));
        if (error) {
            res.status(500);
            res.json({'error': error});
            return;
        }
        res.set('Content-Type', 'application/json');
        res.json(data);
    });
}

function getImage(req, res) {
    var matrixUniqueID = req.params.id;
    if (!matrixUniqueID) {
        res.status(400);
        return res.json({'error': 'ID is a required field'});
    }
    var imageNumber = req.params.imageNumber;
    if (!imageNumber) {
        res.status(400);
        return res.json({'error': 'image number is a required field'});
    }
    mlsClient.getImage(matrixUniqueID, imageNumber, function (error, data) {
        console.log('Get images response: ' + error);
        if (error) {
            res.status(500);
            res.json({'error': error});
            return;
        }
        res.set('Content-Type', data.contentType);
        res.send(data.body);
    });
}


module.exports = {
    search: search,
    getImages: getImages,
    getImage: getImage
};

