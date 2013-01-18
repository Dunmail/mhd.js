var vows = require("vows");
var zombie = require("zombie");
var assert = require("assert");
var url = require("./config/url.js");

function zvisit(url, callback){
  z = new zombie();
  z.visit(url, callback);
}

vows.describe("Server behaviour").addBatch({
  "when browsing root url":{
  	  topic: function() {
  	    zvisit(url.Root, this.callback);
  	  },
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              }	 
          },
  "when browsing unknown url":{
  	  topic: function() {
  	  	zvisit(url.Unknown, this.callback);
  	  },
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              }	 
          }
}).addBatch({
  "when GetDocumentDossier url is well-formed" : {
  	  topic: function() {
  	  	zvisit(url.GetDocumentDossierReq, this.callback);
  	  	},
  	  'the status code is 200': function(err, res) {
                assert.equal(res.statusCode, 200);
              }	 	 
          },
  "when GetDocumentDossier url has missing uuid" : {
  	  topic: function() {
  	  	zvisit(url.GetDocumentDossierReq_uuidMissing, this.callback);
  	  	},
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              }	 	 
          },
  "when GetDocumentDossier url has malformed uuid" : {
  	  topic: function() {
  	  	zvisit(url.GetDocumentDossierReq_uuidMalformed, this.callback);
  	  	},
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              }	 	 
          },
  "when GetDocumentDossier url has missing patientId" : {
  	  topic: function() {
  	  	zvisit(url.GetDocumentDossierReq_patientIdMissing, this.callback);
  	  	},
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              }	 	 
          },
  "when GetDocumentDossier url has empty patientId" : {
  	  topic: function() {
  	  	zvisit(url.GetDocumentDossierReq_patientIdEmpty, this.callback);
  	  	},
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              }	 	 
          },
  "when GetDocumentDossier url has malformed patientId" : {
  	  topic: function() {
  	  	zvisit(url.GetDocumentDossierReq_patientIdMalformed, this.callback);
  	  	},
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              }	 	 
          },
  "when GetDocumentDossier url has uuid not known to responder" : {
  	  topic: function() {
  	  	zvisit(url.GetDocumentDossierReq_uuidNotKnown, this.callback);
  	  	},
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              },
          'the reason phrase is Document Entry UUID not found': function(err, res) {
                //console.log(res);  
                assert.equal(res.statusCode, "Document Entry UUID not found");
              }	 	 
          }
}).run();

