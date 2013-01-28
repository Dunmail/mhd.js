function splitMultipart(res, cb){
  res.setEncoding('UTF-8');
  var body = "";
  res.on("data", function (chunk) {	
    body = body + chunk.toString();
  });
  res.on("end", function() {
    parts = [];
    split(res.headers, body, function(err, res){
       //TODO: check err
       parts[parts.length]=res;  
    }, function(){
       cb(parts);
    });	  
  });
}

function split(headers, body, onPart, onEnd){   
   var boundary = "--" + mimeBoundary(headers);
   var parts = body.split(boundary);
   for(var i = 0; i < parts.length; i++){
     var part = parts[i];
     if (isNotEmpty(part) && isNotEpilogue(part)){
     	parsePart(part, function(headers, data){
     	  var res = {
     	  	  headers: headers,
     	  	  data: data
     	    }     	  		
     	  onPart(null, res);
     	});
     }    
     if (isEpilogue(part)){
       onEnd();
       return;
     }
   }
}

function mimeBoundary(headers){
  var boundary = "";
  var token = headers["content-type"].split(";");
  for (var i = 0; i < token.length; i++) {
  	  if (token[i].indexOf("boundary=") >= 0){
  	    var kvp = token[i].split("=");
  	    key = kvp[0].trim();
  	    value = kvp[1].trim();
  	    boundary = value;
          } 
  }	  
  return boundary;
}

function parsePart(text, cb){
  var headerTerminator = "\r\n\r\n"; 
  var headerTerminatorPos = text.indexOf(headerTerminator);
  var headers = null;
  var data;
  if (headerTerminator >= 0){
    headers = parseHeaders(text.substr(0, headerTerminatorPos));
    data = text.substr(headerTerminatorPos + headerTerminator.length)
  }
  else {
    data = text;
  }
  
  cb(headers, data);	
}

function parseHeaders(text){ 
  var headerDelimiter = "\r\n";
  var kvDelimiter = ":";
  var headers = {};
  var tokens = text.split(headerDelimiter);    
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var kvDelimiterPos = token.indexOf(kvDelimiter);
    var key;
    var value = null;
    if (kvDelimiterPos >= 0){
      key = token.substr(0, kvDelimiterPos).trim().toLowerCase();
      value = token.substr(kvDelimiterPos + kvDelimiter.length).trim();
    }
    else {
      key = token.trim().toLowerCase();
    }
    
    if (key.length > 0){
      headers[key] = value;
    }
  }	
  
  return headers;	
}

function isEpilogue(part){
  return part.indexOf("--") == 0;
}

function isNotEpilogue(part){
  return !isEpilogue(part);
}

function isNotEmpty(part){
  return part.length > 0;
}

exports.getMimeBoundary = mimeBoundary;
exports.splitMultipart = splitMultipart;
