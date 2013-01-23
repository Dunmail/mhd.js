var http = require("http");
var assert = require("assert");
var xdsRegistry = "http://192.168.10.65:2010/openxds/services/DocumentRegistry/";
var xdsRepository = "http://192.168.10.65:2010/openxds/services/DocumentRepository/";

function get(url, cb) {
  var req = http.get(url,
    function(res) {
      cb("error", res); 
    }	  
  )
  req.on('error', function(e) {
    console.error(e);  
  });
  req.end();
}

get(xdsRegistry, function(err, res){
  console.log(res.statusCode);
  console.log(res.headers);
  res.on("data", function(d) {
    console.log(d.toString());
  });
});
