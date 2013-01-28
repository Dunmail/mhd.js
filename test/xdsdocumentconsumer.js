/*
Server setup to test routing against stub xdsdocumentconsumer
Requires openxds services prepopulated with documents

node mhd.js

*/

var vows = require("vows");
var assert = require("assert");
var libxmljs = require("libxmljs");
var constants = require("./config/constants.js");
var xds = require("../lib/xdsdocumentconsumer.js");
var parse = require("../lib/parseHttp.js");

var registryOptions = {
  hostname: "192.168.10.65",
  port: 2010,
  path: "/openxds/services/DocumentRegistry/"
};

function RegistryStoredQuery(registryOptions, query, cb){
  xds.RegistryStoredQuery(registryOptions, query, function(err, res) {
    res.setEncoding("UTF-8");
    var body = "";
    res.on("data", function (chunk) {	       
      body = body + chunk.toString();
    });
    res.on("end", function() {
      cb(err, res, body);
    });
  });
}


var repositoryOptions = {
  hostname: "192.168.10.65",
  port: 2010,
  path: "/openxds/services/DocumentRepository/"
};

function RetrieveDocumentSet(registryOptions, query, cb){
  xds.RetrieveDocumentSet(registryOptions, query, function(err, res) {
      parse.splitMultipart(res, function(parts){
          cb(err, res, parts);
      });
  });
}


vows.describe("xdsDocumentConsumer functional tests").addBatch({
  "when searching for ObjectRef by patientId and patient has documents":{
  	  topic: function() {
  	    var query = {
  	      returnType: "ObjectRef",
              params: [{name: "XDSDocumentEntryPatientId", value: constants.wellformedPatientId + "^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO"},
                       {name: "XDSDocumentEntryStatus", value: ["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}]
            }

  	    RegistryStoredQuery(registryOptions, query, this.callback);
  	  },
  	  'the status code is 200': function(err, res, body) {
                assert.equal(res.statusCode, 200);
              },
  	  'the SOAP action is urn:ihe:iti:2007:RegistryStoredQueryResponse': function(err, res, body) {
                assert.isTrue(res.headers["content-type"].indexOf("action=\"urn:ihe:iti:2007:RegistryStoredQueryResponse\"") > 0);
              },
          'the body contains at least 1 ObjectRef': function(err, res, body) {
                  var xml = libxmljs.parseXmlString(body);
                  assert.isTrue(xml.find("//rim:ObjectRef", {"rim":"urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"}).length > 0);
  	      }
            },
  "when searching for ObjectRef by patientId and patient has no documents":{
  	  topic: function() {
  	    var query = {
  	      returnType: "ObjectRef",
              params: [{name: "XDSDocumentEntryPatientId", value: constants.noDocumentsPatientId + "^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO"},
                       {name: "XDSDocumentEntryStatus", value: ["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}]
            }

  	    RegistryStoredQuery(registryOptions, query, this.callback);
  	  },
  	  'the status code is 200': function(err, res, body) {
                assert.equal(res.statusCode, 200);
              },
  	  'the SOAP action is urn:ihe:iti:2007:RegistryStoredQueryResponse': function(err, res, body) {
                assert.isTrue(res.headers["content-type"].indexOf("action=\"urn:ihe:iti:2007:RegistryStoredQueryResponse\"") > 0);
              },
          'the body contains no ObjectRef': function(err, res, body) {
                  var xml = libxmljs.parseXmlString(body);
                  assert.isTrue(xml.find("//rim:ObjectRef", {"rim":"urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"}).length == 0);
  	      }
  }
}).addBatch({
  "when searching for LeafClass by patientId entry exists":{
  	  topic: function() {
  	    var query = {
  	      returnType: "LeafClass",
              params: [{name: "XDSDocumentEntryPatientId", value: constants.wellformedPatientId + "^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO"},
                       {name: "XDSDocumentEntryStatus", value: ["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}]
            }

  	    RegistryStoredQuery(registryOptions, query, this.callback);
  	  },
  	  'the status code is 200': function(err, res, body) {
                assert.equal(res.statusCode, 200);
              },
  	  'the SOAP action is urn:ihe:iti:2007:RegistryStoredQueryResponse': function(err, res, body) {
                assert.isTrue(res.headers["content-type"].indexOf("action=\"urn:ihe:iti:2007:RegistryStoredQueryResponse\"") > 0);
              },
          'the body contains at least 1 ExtrinsicObject': function(err, res, body) {
                var xml = libxmljs.parseXmlString(body);
                var objCount = xml.find("//rim:ExtrinsicObject", {"rim":"urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"}).length;
                if (objCount == 0) { console.log(body); }
                assert.isTrue(objCount > 0);
  	      }
            },
  "when searching for LeafClass by patientId and entry does not exist":{
  	  topic: function() {
  	    var query = {
  	      returnType: "LeafClass",
              params: [{name: "XDSDocumentEntryPatientId", value: constants.noDocumentsPatientId + "^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO"},
                       {name: "XDSDocumentEntryStatus", value: ["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}]
            }

  	    RegistryStoredQuery(registryOptions, query, this.callback);
  	  },
  	  'the status code is 200': function(err, res, body) {
                assert.equal(res.statusCode, 200);
              },
  	  'the SOAP action is urn:ihe:iti:2007:RegistryStoredQueryResponse': function(err, res, body) {
                assert.isTrue(res.headers["content-type"].indexOf("action=\"urn:ihe:iti:2007:RegistryStoredQueryResponse\"") > 0);
              },
          'the body contains no ExtrinsicObject': function(err, res, body) {
                  var xml = libxmljs.parseXmlString(body);
                  assert.isTrue(xml.find("//rim:ExtrinsicObject", {"rim":"urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"}).length == 0);
              }
  }
}).addBatch({
  "when fetching a document":{
  	  topic: function() {
            var query = {
              RepositoryUniqueId: "2.16.840.1.113883.2.1.3.9.1.2.0",
              DocumentUniqueId: "2.16.840.1.113883.2.1.3.9.105035065001189118.1358955547866.1"
            }

  	    RetrieveDocumentSet(repositoryOptions, query, this.callback);
  	  },
  	  "the status code is 200": function(err, res, parts) {
                assert.equal(res.statusCode, 200);
              },
  	  "the SOAP action is urn:ihe:iti:2007:RegistryStoredQueryResponse": function(err, res, body) {
  	        assert.isTrue(res.headers["content-type"].indexOf("action=\"urn:ihe:iti:2007:RetrieveDocumentSetResponse\"") > 0);
              },
          "the response contains 2 parts": function(err, res, parts) {
          	 assert.equal(parts.length, 2);
            },   
          "the first part is an ebXml success": function(err, res, parts) {
                 assert.isTrue(parts[0].data.indexOf("urn:oasis:names:tc:ebxml-regrep:ResponseStatusType:Success") > 0);            	    
            },   
          "the second part is a ClinicalDocument ": function(err, res, parts) {
                 assert.isTrue(parts[1].data.indexOf("<ClinicalDocument") > 0);            	    
            },          
  }
}).run();


