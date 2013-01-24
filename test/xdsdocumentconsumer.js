var libxmljs = require("libxmljs");
var xds = require("../lib/xdsdocumentconsumer.js");

var xdsRepository = "http://192.168.10.65:2010/openxds/services/DocumentRepository/";

var options = {
  hostname: "192.168.10.65",
  port: 2010,
  path: "/openxds/services/DocumentRegistry/"
};

var query = {
  returnType: "ObjectRef",
  params: {
  	  XDSDocumentEntryPatientId: "223568611^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO",
  	  XDSDocumentEntryStatus: "('urn:oasis:names:tc:ebxml-regrep:StatusType:Approved')"
  }
}
xds.RegistryStoredQuery(onError, options, query, function(res){
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('UTF-8');
  res.on('data', function (chunk) {
    var xml = chunk.toString();
    var doc = libxmljs.parseXmlString(xml);
    console.log("BODY: " + doc);
  });
});

query = {
  returnType: "LeafClass",
  params: {
  	  XDSDocumentEntryPatientId: "223568611^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO",
  	  XDSDocumentEntryStatus: "('urn:oasis:names:tc:ebxml-regrep:StatusType:Approved')"
  }
}
xds.RegistryStoredQuery(onError, options, query, function(res){
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


