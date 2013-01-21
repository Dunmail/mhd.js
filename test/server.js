var vows = require("vows");
var check = require("validator").check;
var https = require("https");
var assert = require("assert");
var constants = require("./config/constants.js");
var url = require("./config/url.js");

function get(url, cb) {
 var req = https.get(url,
    function(res) {
      cb("error", res); 
    }	  
  )
  req.on('error', function(e) {
    console.error(e);  
  });
  req.end();
}

vows.describe("Server behaviour").addBatch({
  "when browsing root url":{
  	  topic: function() {
  	    get(constants.root, this.callback);
  	  },
  	  'the status code is 403': function(err, res) {
                assert.equal(res.statusCode, 403);
              }	 
          },
  "when browsing unknown url":{
  	  topic: function() {
  	  	get(url.unknown, this.callback);
  	  },
  	  'the status code is 403': function(err, res) {
                assert.equal(res.statusCode, 403);
              }	 
          }
}).addBatch({
  "when findDocumentDossiers url is well-formed" : {
  	  topic: function() {
  	  	get(url.findDocumentDossiersReq, this.callback);
  	  	},
  	  'the status code is 200': function(err, res) {
                assert.equal(res.statusCode, 200);
              },
          'the body is DocumentDossier[] json': function(err, res) {
          	  res.on('data', function(d) {
          	    var body = JSON.parse(d.toString('utf8'));
          	  });
              }	 	 
          },
  "when findDocumentDossiers url has missing patientId" : {
  	  topic: function() {
  	  	get(url.findDocumentDossiersReq_patientIdMissing, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when findDocumentDossiers url has empty patientId" : {
  	  topic: function() {
  	  	get(url.findDocumentDossiersReq_patientIdEmpty, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
  	  },
  "when findDocumentDossiers url has malformed patientId" : {
  	  topic: function() {
  	  	get(url.findDocumentDossiersReq_patientIdMalformed, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when findDocumentDossiers url has patientId not known to responder" : {
  	  topic: function() {
  	  	get(url.findDocumentDossiersReq_patientIdNotKnown, this.callback);
  	  	},
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              }	 	 
          }
}).addBatch({
  "when GetDocumentDossier url is well-formed" : {
  	  topic: function() {
  	  	get(url.getDocumentDossierReq, this.callback);
  	  	},
  	  'the status code is 200': function(err, res) {
                assert.equal(res.statusCode, 200);
              },
  	  'the body is DocumentDossier json': function(err, res) { 
                res.on('data', function(d) {        	  
  	  	  var body = JSON.parse(d.toString('utf8'));
  	  	});
              }	 	 
          },
  "when GetDocumentDossier url has missing uuid" : {
  	  topic: function() {
  	  	get(url.getDocumentDossierReq_uuidMissing, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has malformed uuid" : {
  	  topic: function() {
  	  	get(url.getDocumentDossierReq_uuidMalformed, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has missing patientId" : {
  	  topic: function() {
  	  	get(url.getDocumentDossierReq_patientIdMissing, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has empty patientId" : {
  	  topic: function() {
  	  	get(url.getDocumentDossierReq_patientIdEmpty, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has malformed patientId" : {
  	  topic: function() {
  	  	get(url.getDocumentDossierReq_patientIdMalformed, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocumentDossier url has uuid not known to responder" : {
  	  topic: function() {
  	  	get(url.getDocumentDossierReq_uuidNotKnown, this.callback);
  	  	},
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              },
          'the reason phrase is Document Entry UUID not found': function(err, res) {
             	res.on('data', function(d) {
                  assert.equal(d.toString(), "Document Entry UUID not found");
          	});
              }	 	 
          }
}).addBatch({
  "when GetDocument url is well-formed" : {
  	  topic: function() {
  	  	get(url.getDocumentReq, this.callback);
  	  	},
  	  'the status code is 200': function(err, res) {
                assert.equal(res.statusCode, 200);
              }	 	 
          },
  "when GetDocument url has missing uuid" : {
  	  topic: function() {
  	  	get(url.getDocumentReq_uuidMissing, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocument url has malformed uuid" : {
  	  topic: function() {
  	  	get(url.getDocumentReq_uuidMalformed, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocument url has missing patientId" : {
  	  topic: function() {
  	  	get(url.getDocumentReq_patientIdMissing, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocument url has empty patientId" : {
  	  topic: function() {
  	  	get(url.getDocumentReq_patientIdEmpty, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocument url has malformed patientId" : {
  	  topic: function() {
  	  	get(url.getDocumentReq_patientIdMalformed, this.callback);
  	  	},
  	  'the status code is 400': function(err, res) {
                assert.equal(res.statusCode, 400);
              }	 	 
          },
  "when GetDocument url has uuid not known to responder" : {
  	  topic: function() {
  	  	get(url.getDocumentReq_uuidNotKnown, this.callback);
  	  	},
  	  'the status code is 404': function(err, res) {
                assert.equal(res.statusCode, 404);
              }
  }
}).run();
