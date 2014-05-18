var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');


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


exports.getByMockupId = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving mockups: ' + id);
    db.collection('mockups', function(err, collection) {
        collection.findOne({'_id':new ObjectID(id)}, function(err, mockup) {
            db.collection('layers', function(err, collection) {
                collection.find({ mockup_id: id}).toArray(function(err, layers) {
                    mockup._id = undefined; // on enler les ObjectId pour js2xmlparser sinon plantage
                    for (var i = 0; i < layers.length; i++) {
                        layers[i]._id = i; // on enler les ObjectId pour js2xmlparser sinon plantage

                        var style = "";
                        if(layers[i].properties.color != undefined) {
                            style += "color:" + layers[i].properties.color + "; "; 
                        }
                        if(layers[i].properties.backgroundColor != undefined) {
                            style += "background-color:" + layers[i].properties.backgroundColor + "; "; 
                        }
                        if(layers[i].properties.textShadow != undefined) {
                            style += "text-shadow:" + layers[i].properties.textShadow + "; "; 
                        }
                        if(layers[i].properties.borderStyle != undefined) {
                            style += "border-style:" + layers[i].properties.borderStyle + "; "; 
                        }
                        if(layers[i].properties.borderColor != undefined) {
                            style += "border-color:" + layers[i].properties.borderColor + "; "; 
                        }
                        if(layers[i].properties.borderWidth != undefined) {
                            style += "border-width:" + layers[i].properties.borderWidth + "px; "; 
                        }
                        if(layers[i].properties.fontSize != undefined) {
                            style += "font-size:" + layers[i].properties.fontSize + "px; "; 
                        }
                        if(layers[i].properties.fontFamily != undefined) {
                            style += "font-family:" + "'"+layers[i].properties.fontFamily+"'; "; 
                        }
                        if(layers[i].properties.textAlign != undefined) {
                            style += "text-align:" + layers[i].properties.textAlign + "; "; 
                        }
                        if(layers[i].properties.lineHeight != undefined) {
                            style += "line-height:" + layers[i].properties.lineHeight + "px; "; 
                        }
                        if(layers[i].properties.verticalAlign != undefined) {
                            style += "vertical-align:" + layers[i].properties.verticalAlign + "; "; 
                        }
                        if(layers[i].properties.textDecoration != undefined) {
                            style += "text-decoration:" + layers[i].properties.textDecoration + "; "; 
                        }
                        if(layers[i].properties.webkitTransform != undefined) {
                            style += "webkitTransform:" + layers[i].properties.webkitTransform + "; "; 
                        }
                        if(layers[i].properties.webkitFilter != undefined) {
                            style += "webkitFilter:" + layers[i].properties.webkitFilter + "; "; 
                        }
                        if(layers[i].properties.width != undefined) {
                            style += "width:" + layers[i].properties.width + "px" + "; "; 
                        }
                        if(layers[i].properties.height != undefined) {
                            style += "height:" + layers[i].properties.height + "px" + "; "; 
                        }
                        style += "top:" + layers[i].position.top + "px" + "; "; 
                        style += "left:" + layers[i].position.left + "px" + "; "; 

                        if (layers[i].type == "image"){
                            layers[i].content = "/Users/aymericmortemousque/Git/mockupBackend/contents/images/" + layers[i].content;
                        }
                        layers[i].style = style;
                    }
                    mockup.layers = layers;
                    console.log("mockup", mockup);
                    itemXml = js2xmlparser("mockup", mockup);
                    stylesheet = xslt.readXsltFile("./contents/xslt/mockup.xslt");
                    document = xslt.readXmlString(itemXml);
                    transformedString = xslt.transform(stylesheet, document, []);
                    var promiseCreate = fs.writeFile("./contents/generate.html", transformedString, function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("The file was saved!");
                            
                            phantom.create(function (error, ph) {
                                 ph.createPage(function (error, page) {
                                    console.log("page",page);
                                    page.set('paperSize', { width: mockup.canvas.width + mockup.canvas.unit.type, height: mockup.canvas.height + mockup.canvas.unit.type });
                                    page.open("./contents/generate.html", function(status) {
                                      page.render('./contents/generate.pdf', function(){
                                        console.log('Page Rendered');
                                        res.download('./contents/generate.pdf', 'generate.pdf');
                                        ph.exit();

                                      });
                                    });
                                  });
                            });

                        }
                    });


                    console.log("transformedString", transformedString);

                               // res.send(mockup);

                    // res.download('/generate.pdf', './contents/generate.pdf');
                });
            });


        });
    });
};



