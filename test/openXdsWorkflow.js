/*
 Server setup to test routing against stub xdsdocumentconsumer

 node mhdstub.js

 */

var https = require("https");
var vows = require("vows");
var check = require("validator").check;
var constants = require("./config/constants.js");
var urlParser = require("url");
var base64 = require('b64');

var user = constants.goodUser;
var pass = constants.goodPass;

function encodeHttpBasicAuthorizationHeader(user, pass) {
    return "Basic " + base64.encode(user + ":" + pass);
}

function get(url, callback) {
    var options = urlParser.parse(url);
    options["headers"] = {
        Authorization:encodeHttpBasicAuthorizationHeader(user, pass)
    };
    var req = https.request(options, function (res) {
        res.setEncoding("UTF-8");
        var data = "";
        res.on("data", function (chunk) {
            data += chunk.toString();
        });
        res.on("end", function () {
            callback(null, res, data);
        });
    });
    req.on("error", function (e) {
        callback(e, null, null);
    });
    req.end();
}

console.log("Assume service is running and user has authenticated");

var patientId = "223568611%5E%5E%5E%262.16.840.1.113883.2.1.3.9.1.0.0%26ISO";

console.log("Find document dossiers for patient");
console.log("PatientID: " + patientId + " NB: ^, & characters escaped and ID authority included");

var apiUrl = "https://127.0.0.1:1337/net.ihe/DocumentDossier/search?PatientID=" + patientId;
console.log("Url: " + apiUrl);
console.log("");

/*
var badUrl = "https://localhost:1337/net.ihe/DocumentDossier/urn:uuid:53186124-b316-7cb0-a57a-2a2ff4baa170/?PatientID=223568611%5E%5E%5E%262.16.840.1.113883.2.1.3.9.1.0.0%26ISO";
get(badUrl, function (err, res, data) {
    check(err).isNull();
    check(res.statusCode).is(200);
}   );
  */

get(apiUrl, function (err, res, data) {
    check(err).isNull();
    check(res.statusCode).is(200);
    var result = JSON.parse(data);
    console.log("API returns list of urls:");
    console.log(result);
    console.log("");

    console.log("For each url");
    for (var i = 0; i < result.entries.length; i++) {
        var selfUrl = result.entries[i].self;
        console.log("Get document dossier");
        console.log("Url: " + selfUrl);
        console.log("");

        get(selfUrl, function (err, res, data) {
            check(err).isNull();
            check(res.statusCode).is(200);
            var result = JSON.parse(data);
            console.log("API returns document dossier:");
            console.log(result);
            console.log("");
        });

        var relatedUrl = result.entries[i].related;
        console.log("Get document");
        console.log("Url: " + relatedUrl);
        console.log("");

        get(relatedUrl, function (err, res, data) {
            check(err).isNull();
            check(res.statusCode).is(200);
            console.log("API returns document:");
            console.log(res.headers);
            console.log(data);
            console.log("");
        });
    }
});
