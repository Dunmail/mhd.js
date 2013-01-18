var server = require("./lib/server.js");
var xds = require("./test/stub/xdsdocumentconsumer.js");

server.start("Mobile access to Health Documents (MHD) service", 1337, xds);
