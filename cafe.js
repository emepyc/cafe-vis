//var connect = require ("connect")
var cafe_parser = require ("./lib/cafe_parser.js");

if (process.argv.length < 3) {
    console.log ("Usage: node " + process.argv[1] + ' <CAFE OUTPUT FILE>');
    process.exit(1);
}

console.log("-- Processing file " + process.argv[2]);

cafe_parser.parse (process.argv[2]);
