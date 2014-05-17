var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('mockup', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'mockups' database");
        db.collection('mockups', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'mockups' collection doesn't exist. Creating it with sample data...");
                //populateDB();
            }
        });
    }
});

//find all employees
exports.findAll = function(req, res) {
    db.collection('mockups', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving mockups: ' + id);
    db.collection('mockups', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.saveMockup = function(req, res) {
    var mockup = req.body;
    console.log('Adding mockups: ' + JSON.stringify(mockup));
    db.collection('mockups', function(err, collection) {
        collection.save(mockup, {safe:true}, function(err, result, update) {
            if(update == undefined) { //update
                res.send(result); 
            } else { //insert
                res.send(mockup);
            }
        });
    });
};

exports.updateMockup = function(req, res) {
    var id = req.params.id;
    var mockup = req.body;
    console.log('Updating mockup: ' + id);
    console.log(JSON.stringify(mockup));
    db.collection('mockups', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, mockup, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating mockup: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(mockup);
            }
        });
    });
}

exports.deleteMockup = function(req, res) {
    var idMockup = req.params.id;
    console.log('Deleting mockup: ' + idMockup);
    db.collection('mockups', function(err, collection) {
        console.log('Deleting mockup: ' + new ObjectID(idMockup));
        collection.remove({'_id':new ObjectID(idMockup)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(idMockup);
            }
        });
    });
};
