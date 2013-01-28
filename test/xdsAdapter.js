/*
Requires openxds services prepopulated with documents
*/

var vows = require("vows");
var assert = require("assert");
var libxmljs = require("libxmljs");
var constants = require("./config/constants.js");
var xds = require("../lib/xdsAdapter.js");

var registryOptions = {
  hostname: "192.168.10.65",
  port: 2010,
  path: "/openxds/services/DocumentRegistry/"
};

var repositoryOptions = {
  hostname: "192.168.10.65",
  port: 2010,
  path: "/openxds/services/DocumentRepository/"
};

vows.describe("xdsAdapter functional tests").addBatch({
  "when retrieving document dossier":{
  	  topic: function() {
  	    xds.getDocumentDossier(registryOptions, constants.wellformedDocumentUuid, constants.wellformedPatientId, this.callback);
  	  },
  	  "there is no error": function(err, dossier){
  	     assert.equal(null, err);
  	  },
  	  "dossier JSON is found": function(err, dossier){
  	     assert.notEqual(null, dossier);
  	     //console.log(dossier);
  	  }
    }
}).addBatch({
  "when searching for document dossiers for patient with documents":{
  	  topic: function() {
  	  	  var query = {
  	  	  };
  	  	  xds.findDocumentDossiers(registryOptions, "http://dummy:888/", constants.wellformedPatientId, query, this.callback);
  	  },
  	  "there is no error": function(err, dossier){
  	     assert.equal(null, err);
  	  },
  	  "dossier JSON is found": function(err, dossier){
  	     assert.notEqual(null, dossier);
  	  }
    }
}).addBatch({
  "when searching for document dossiers for patient with no documents":{
  	  topic: function() {
  	  	  var query = {};
  	  	  xds.findDocumentDossiers(registryOptions, "http://dummy:888/", constants.noDocumentsPatientId, query, this.callback);
  	  },
  	  "the error is 'No Document Entries found' ": function(err, dossier){
  	     assert.equal("No Document Entries found", err);
  	  },
  	  "there is no dossier": function(err, dossier){
  	     assert.equal(null, dossier);
  	  }
    }
}).addBatch({
  "when getting document":{
  	  topic: function() {
  	  	  var query = {};
  	  	  xds.getDocument(repositoryOptions, constants.wellformedDocumentUuid, constants.wellformedPatientId, this.callback);
  	  },
  	  "there is no error": function(err, dossier){
  	     assert.equal(err, null);
  	  },
  	  "there is a document": function(err, document){
  	     assert.notEqual(document, null);
  	     
  	  }
    }
}).run();

