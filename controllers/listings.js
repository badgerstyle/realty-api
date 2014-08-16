var listing = require('../models/Listing');
var mlsClient = require('../MLS/MLSClient');
//var db = require('../app').db;
var Listing = require('../models/Listing.js');
var mongoose = require('mongoose');
exports.list = function (req, res) {

    mlsClient.getListings(req.query, function(error, data) {
        console.log('get listings response: ' + error + ' ' + JSON.stringify(data));
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
//            res.send('[1,2,3]');
        res.json(data);
    });
};

