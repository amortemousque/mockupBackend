var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('layers', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'layers' database");
        db.collection('layers', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'layers' collection doesn't exist. Creating it with sample data...");
                //populateDB();
            }
        });
    }
});

exports.findAll = function(req, res) {
    db.collection('layers', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addLayers = function(req, res) {
    var layers = req.body;
    console.log('Adding layers: ' + JSON.stringify(layers));
    db.collection('layers', function(err, collection) {
        collection.insert(layers, {safe:true}, function(err, results) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(results));
                res.send(results);
            }
        });
    });
};

exports.findByMockupId = function(req, res) {
    var mockupId = req.params.id;
    console.log('Retrieving layer by mockup: ' + mockupId);

    db.collection('layers', function(err, collection) {
        collection.find({ mockup_id: mockupId}).toArray(function(err, items) {
            console.log("items",items);
            res.send(items);
        });
    });
};
