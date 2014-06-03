var express = require('express'),
	mockups = require('./routes/mockups'),
	layers = require('./routes/layers'),
	files = require('./routes/files'),

	generator = require('./routes/generator'),
	http = require('http'),
	path = require('path'),
	fs = require('fs');
	js2xmlparser = require("js2xmlparser");
	xslt = require('node_xslt');
    phantom = require('node-phantom');


var app = express();


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:9000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-requested-with');
    next();
}

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(allowCrossDomain);
	app.use(app.router);
	app.use(express.json({limit: '50mb'}));
	app.use(express.urlencoded({limit: '50mb'}));
});


app.get('/mockups', mockups.findAll);
app.get('/mockups/:id', mockups.findById);
app.post('/mockups', mockups.saveMockup);
//app.put('/mockups/:id', mockups.updateMockup);
app.delete('/mockups/:id', mockups.deleteMockup);


app.get('/mockupLayers/:id', layers.findByMockupId);
app.delete('/mockupLayers/:id', layers.deleteByMockupId);

app.get('/layers', layers.findAll);
app.post('/layers', layers.saveLayers);


app.get('/files/:id', files.findById);
app.post('/files', files.addFiles);

app.get('/generator/:id', generator.getByMockupId);

app.listen(3000);
console.log('Listening on port 3000');