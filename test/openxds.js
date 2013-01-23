var http = require("http");
var assert = require("assert");
var libxmljs = require("libxmljs");
var openxds = require("../lib/xds.js");

var xdsRepository = "http://192.168.10.65:2010/openxds/services/DocumentRepository/";

var options = {
  hostname: "192.168.10.65",
  port: 2010,
  path: "/openxds/services/DocumentRegistry/",
  patientId: "223568611^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO"
  //patientId: "223568600^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO"
};
openxds.ObjectRefsForPatientId(onError, options, function(res){
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('UTF-8');
  res.on('data', function (chunk) {
    var xml = chunk.toString();
    var doc = libxmljs.parseXmlString(xml);
    console.log("BODY: " + doc);
  });
});

function onError(err){
  console.log('problem with request: ' + err.message);
}


