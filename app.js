// Set-up Hook
var settings = require('./settings')
  , hookio = require('hook.io');
var twilioReceiverHook = hookio.createHook({
  "name": "twilioreceiverhook",
});

// Set-up Web Server
var express = require('express');
var webserver = module.exports = express.createServer();
webserver.configure(function(){
  webserver.use(express.bodyParser());
  webserver.use(express.methodOverride());
  webserver.use(webserver.router);
  webserver.use(express.static(__dirname + '/public'));
});
webserver.configure('development', function(){
  webserver.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
webserver.configure('production', function(){
  webserver.use(express.errorHandler());
});

// Routes
var createReceiver = function(hook){
    return function(req,res){
        var payload = req.query;
        console.log("Received request:");
        console.log(payload);
        hook.emit("recvSms",{message:payload.Body,from:payload.From});
        res.send(200);
    };
};

var receiverController = createReceiver(twilioReceiverHook);
webserver.get('/', receiverController);


// Start hook and server
twilioReceiverHook.on('hook::ready', function(){
    webserver.listen(settings.port, function(){
        console.log("Webserver listening on %d in %s mode", webserver.address().port, webserver.settings.env);
    });
});
twilioReceiverHook.start();

