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
            var bindings = layers[i].bindings;
            layers[i].bindings = undefined;
            layers[i].mockup_id = new ObjectID(layers[i].mockup_id);
            if(layers[i]._id != undefined) {
                layers[i]._id = new ObjectID(layers[i]._id);
            }

            var l = layers[i];
            console.log("l", l);

            collection.save(layers[i], {safe:true}, function(err, result, update) {
                 if (err) {
                     res.send({'error':'An error has occurred'});
                 } else {
                    var layer = update == undefined ? result : l;
                    db.collection('bindings', function(err, collection) {
                        console.log("layer", layer);
                        //delete all bindings of the layers
                        collection.remove({ layer_id: layer._id}, {safe:true}, function(err, result) {
                            console.log("err remove", err);
                            if (err) {
                                res.send({'error':'An error has occurred - ' + err});
                            } else {
                                //foreach layers save bindings
                                var length = layers.length;
                                console.log("err layer", layers);

                                for(var i = 0; i < length; i++) {
                                    if (Array.isArray(bindings)) {
                                        for(var j = 0; j < bindings.length; j++) {
                                            console.log("binding", bindings[j]);

                                            bindings[j].layer_id = layer._id;
                                            if(bindings[j]._id != undefined) 
                                                bindings[j]._id = new ObjectID(String(bindings[j]._id));
                                            collection.save(bindings[j], function(err, result, update) {
                                                 if (err) {
                                                     res.send({'error':'An error has occurred'});
                                                 } else {
                                                     console.log('Success: ' + JSON.stringify(result));
                                                 }
                                            });
                                        }
                                    }
                                }
                            }
                        });
                    });
                 }
            });
        }
    });


    res.send(layers);

};

exports.findByMockupId = function(req, res) {
    var mockupId = req.params.id;
    console.log('Retrieving layer by mockup: ' + mockupId);
    db.collection('layers', function(err, collection) {
        collection.find({ mockup_id: new ObjectID(mockupId)}).toArray(function(err, layers) {
            var ids = [];
            for(var i = 0; i < layers.length; i++) {
                var test = new ObjectID(String(layers[i]._id));
                ids.push(test);
            }
            console.log("find bindings", ids);
            db.collection('bindings', function(err, collection) {
                collection.find({ layer_id: {$in: ids}}).toArray(function(err, bindings) {
                    for(var i = 0; i < layers.length; i++) {
                        layers[i].bindings = [];
                        for(var j = 0; j < bindings.length; j++) {
                            if(layers[i]._id.toString() == bindings[j].layer_id.toString()) {
                                layers[i].bindings.push(bindings[j]);
                            }
                        }
                    }
                    res.send(layers);                
                });
            });
                
        });
    });
};

exports.deleteByMockupId = function(req, res) {
    var mockupId = req.params.id;
    console.log('Deleting layers: ' + mockupId);
    db.collection('layers', function(err, collection) {
        collection.remove({ mockup_id: new ObjectID(mockupId)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};


