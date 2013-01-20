var server = require("./lib/server.js");
var xds = require("./test/stub/xdsdocumentconsumer.js");

var options = {
	name: "Mobile access to Health Documents (MHD) service",
	port: 1337,
	xds: xds,
	patientIdPattern: "^[0-9]{10}$"
  }

server.start(options);
