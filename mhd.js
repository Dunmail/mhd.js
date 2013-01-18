var server = require("./lib/server.js");
var xds = require("./test/stub/xdsdocumentconsumer.js");

server.start("IHE MHD service", 1337, xds);
