/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , settings = require('./settings')
  , hookio = require('hook.io');

// Configure Hook
var twilioReceiverHook = hookio.createHook({
  "name": "twilioreceiverhook",
});

// Configure Web Server
var app = module.exports = express.createServer();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
var receiverController = function(req,res){
    console.log("hello!");
    twilioReceiverHook.emit("hello",{stuff:"stuff",moreStuff:"moreStuff"});
    res.send(200);
};
app.get('/', receiverController);


// Start hook and server
twilioReceiverHook.on('hook::ready', function(){
    app.listen(settings.port, function(){
        console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
        
    });
});

twilioReceiverHook.start();

