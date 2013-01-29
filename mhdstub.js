var express = require("express");
var fs = require("fs");
var xds = require("./test/stub/xdsAdapter.js");
var server = require("./lib/server.js");

xds["registry"] = {
		hostname: "192.168.10.99",
		port: 2010,
		path: "/openxds/services/DocumentRegistry/"};
		
xds["repository"] = {
		hostname: "192.168.10.99",
		port: 2010,
		path: "/openxds/services/DocumentRepository/"
		};
 
var config = {
	name: "Mobile access to Health Documents (MHD) service [stub only]",
	port: 1337,
	options: {
	  key: fs.readFileSync("key.pem"),
	  cert: fs.readFileSync("cert.pem")
	},
	xds: xds,
    authentication:express.basicAuth(function (user, pass, callback) {
        var result = (user === 'Aladdin' && pass === 'open sesame');
        callback(null, result);
    }),
    patientIdPattern:"^[0-9]{9}[\^]{3}[&]2.16.840.1.113883.2.1.3.9.1.0.0&ISO$" //open XDS test system patient identifier
  };

server.start(config);
