var express = require("express");
var serveStatic = require('serve-static');
// var request = require('request');
// var path = require("path");
var cafe_parser = require ("./parser.js");
var blade = require("blade");

if (process.argv.length != 3) {
    console.log ("Usage: node " + process.argv[1] + ' <CAFE OUTPUT FILE>');
    process.exit(1);
}

var cafe_res = process.argv[2];

var app = express();

app
    .use (serveStatic(__dirname + "/.."))
    .get('/:id', function (req, res) {
        var id = req.params.id;
        cafe_parser (cafe_res, id, res);
    })
    .get('/*', function (req, res) {
        blade.compile(instructions, {}, function (err, tmpl) {
            if (err) {
                console.log(err);
            }
            tmpl ({
                "baseurl": req.headers.host
            }, function (err, html) {
                res.send(html);
            });
        });
        //res.send('Instructions');
    })
    .listen(9000);
console.log("Connected to 127.0.0.1:9000");

var instructions = "\
h3 CAFE analysis results\n\
p To view the result of a given family append its id to the url of this page:\n\
code #{baseurl}/<ID>\
";
