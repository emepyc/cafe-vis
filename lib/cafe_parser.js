var fs = require ("fs");
var newick = require ("./newick");
var node = require ("./node").node;

var get_tag_value = function (line) {
    var fields = line.split (":");
    var tag = fields.shift();
    var value = fields.join(":")
    // TODO: remove leading spaces
    return {
	tag : tag,
	value : value
    };
};

var process_file = function (err, data) {
    var lines = data.split ("\n");

    // First the tree
    var tree_line = lines[0];
    var tag_val = get_tag_value (tree_line);
    var tree = newick.parse(tag_val.value);
    var root = node (tree);
   console.log(tree);
};

exports.parse = function (filename) {
    fs.readFile (filename, {encoding : 'utf8'}, process_file);
    
};
