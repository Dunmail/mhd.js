var check = require('validator').check;

function validateRequest(req, res, next){
  try{
    check(req.query.PatientID).regex(req.patientIdPattern, "i");

    next();
  }
  catch(err){
    res.send(400, "Bad Request");
  }
}

function handle(req, res){
    req.xds.findDocumentDossiers(req.xds.registry, req.originalUrl, req.query.PatientID, req.query, function(err, result){
    

  		  
    if (err == null) {	  
      res.writeHead(200, {"Content-Type": "application.json"});
      res.write(result);
      res.end();
      return;
    }
     
    if (err == "Unknown PatientID"){
      res.send(404, "No Document Entries found");
      return;
    }
    
    if (err == "No Document Entries found"){
      res.send(404, "No Document Entries found");
      return;
    }     
    
    res.send(500, "Unexpected error from xds.getDocumentDossier"); 
  });
}

exports.handle = handle;
exports.validateRequest = validateRequest;
