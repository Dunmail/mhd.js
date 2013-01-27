var server = require("./lib/server.js");
var fs = require("fs");
var xds = require("./test/stub/xdsAdapter.js"); 
var config = {
	name: "Mobile access to Health Documents (MHD) service",
	port: 1337,
	options: {
	  key: fs.readFileSync("key.pem"),
	  cert: fs.readFileSync("cert.pem")
	},
	xds: xds,
	patientIdPattern: "^[0-9]{9}$" //open XDS patient identifier
  }

server.start(config);
