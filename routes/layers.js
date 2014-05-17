var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('mockup', server);

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

exports.saveLayers = function(req, res) {
    var layers = req.body;
    db.collection('layers', function(err, collection) {
        console.log('Adding layers: ' + JSON.stringify(layers));
        var length = layers.length;
        for(var i = 0; i < length; i++) {
            console.log("layer", layers[i]);
            collection.save(layers[i], function(err, result, update) {
                // if (err) {
                //     res.send({'error':'An error has occurred'});
                // } else {
                //     console.log('Success: ' + JSON.stringify(results));
                //     res.send(results);
                // }
            });
            res.send(layers);
        }
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

exports.deleteByMockupId = function(req, res) {
    var mockupId = req.params.id;
    console.log('Deleting layers: ' + mockupId);
    db.collection('layers', function(err, collection) {
        collection.remove({ mockup_id: mockupId}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};


