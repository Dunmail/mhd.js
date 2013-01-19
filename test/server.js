//var http = require("http");
//var req = http.request();

var vows = require("vows");
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var zombie = require("zombie");
var assert = require("assert");
var constants = require("./config/constants.js");
var url = require("./config/url.js");

function zvisit(url, callback){
  z = new zombie();
  z.visit(url, callback);
}

//TODO: ? switch to lower level HTTP tests

vows.describe("Server behaviour").addBatch({
  "when browsing root url":{
  	  topic: function() {
  	    zvisit(constants.root, this.callback);
  	  },
  	  'the status code is 403': function(err, z) {
                assert.equal(z.statusCode, 403);
              }	 
          },
  "when browsing unknown url":{
  	  topic: function() {
  	  	zvisit(url.unknown, this.callback);
  	  },
  	  'the status code is 403': function(err, z) {
                assert.equal(z.statusCode, 403);
              }	 
          }
}).addBatch({
  "when findDocumentDossiers url is well-formed" : {
  	  topic: function() {
  	  	zvisit(url.findDocumentDossiersReq, this.callback);
  	  	},
  	  'the status code is 200': function(err, z) {
                assert.equal(z.statusCode, 200);
              },
          'the body is DocumentDossier[] json': function(err, z) {
  	  	  assert.equal(z.html("body").length, 928);
              }	 	 
          },
  "when findDocumentDossiers url has missing patientId" : {
  	  topic: function() {
  	  	zvisit(url.findDocumentDossiersReq_patientIdMissing, this.callback);
  	  	},
  	  'the status code is 400': function(err, z) {
                assert.equal(z.statusCode, 400);
              }	 	 
          },
  "when findDocumentDossiers url has empty patientId" : {
  	  topic: function() {
  	  	zvisit(url.findDocumentDossiersReq_patientIdEmpty, this.callback);
  	  	},
  	  'the status code is 400': function(err, z) {
                assert.equal(z.statusCode, 400);
              }	 	 
  	  },
  "when findDocumentDossiers url has malformed patientId" : {
  	  topic: function() {
  	  	zvisit(url.findDocumentDossiersReq_patientIdMalformed, this.callback);
  	  	},
  	  'the status code is 400': function(err, z) {
                assert.equal(z.statusCode, 400);
              }	 	 
          },
  "when findDocumentDossiers url has patientId not known to responder" : {
  	  topic: function() {
  	  	zvisit(url.findDocumentDossiersReq_patientIdNotKnown, this.callback);
  	  	},
  	  'the status code is 404': function(err, z) {
                assert.equal(z.statusCode, 404);
              }	 	 
          }
}).addBatch({
  "when GetDocumentDossier url is well-formed" : {
  	  topic: function() {
  	  	zvisit(url.getDocumentDossierReq, this.callback);
  	  	},
  	  'the status code is 200': function(err, z) {
                assert.equal(z.statusCode, 200);
              },
  	  'the body is DocumentDossier json': function(err, z) {
  	  	  assert.equal(z.html("body").length, 967);
              }	 	 
          },
  "when GetDocumentDossier url has missing uuid" : {
  	  topic: function() {
  	  	zvisit(url.getDocumentDossierReq_uuidMissing, this.callback);
  	  	},
  	  'the status code is 400': function(err, z) {
                assert.equal(z.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has malformed uuid" : {
  	  topic: function() {
  	  	zvisit(url.getDocumentDossierReq_uuidMalformed, this.callback);
  	  	},
  	  'the status code is 400': function(err, z) {
                assert.equal(z.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has missing patientId" : {
  	  topic: function() {
  	  	zvisit(url.getDocumentDossierReq_patientIdMissing, this.callback);
  	  	},
  	  'the status code is 400': function(err, z) {
                assert.equal(z.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has empty patientId" : {
  	  topic: function() {
  	  	zvisit(url.getDocumentDossierReq_patientIdEmpty, this.callback);
  	  	},
  	  'the status code is 400': function(err, z) {
                assert.equal(z.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has malformed patientId" : {
  	  topic: function() {
  	  	zvisit(url.getDocumentDossierReq_patientIdMalformed, this.callback);
  	  	},
  	  'the status code is 400': function(err, z) {
                assert.equal(z.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has uuid not known to responder" : {
  	  topic: function() {
  	  	zvisit(url.getDocumentDossierReq_uuidNotKnown, this.callback);
  	  	},
  	  'the status code is 404': function(err, z) {
                assert.equal(z.statusCode, 404);
              }
      //        ,
      //    'the reason phrase is Document Entry UUID not found': function(err, res) {
      //          assert.equal(z.statusCode, "Document Entry UUID not found");
      //        }	 	 
          }
}).addBatch({
  "when GetDocument url is well-formed" : {
  	  topic: function() {
  	  	zvisit(url.getDocumentReq, this.callback);
  	  	},
  	  'the status code is 200': function(err, z) {
                assert.equal(z.statusCode, 200);
              }	 	 
          }
}).run();
