var server = require("./lib/server.js");
var fs = require("fs");
var xds = require("./lib/xdsAdapter.js");
xds["registry"] = {
		hostname: "192.168.10.65",
		port: 2010,
		path: "/openxds/services/DocumentRegistry/"};
		
xds["repository"] = {
		hostname: "192.168.10.65",
		port: 2010,
		path: "/openxds/services/DocumentRepository/"
		};
 
var config = {
	name: "Mobile access to Health Documents (MHD) service",
	port: 1337,
	options: {
	  key: fs.readFileSync("key.pem"),
	  cert: fs.readFileSync("cert.pem")
	},
	xds: xds,
	patientIdPattern: "^[0-9]{9}$" //open XDS patient identifier
  };

server.start(config);
