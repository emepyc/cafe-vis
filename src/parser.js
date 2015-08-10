var fs = require ("fs");
var newick = require ("tnt.newick");
var node = require ("tnt.tree.node");
var blade = require("blade");

var ids_pattern = /(.*)<(\d+)>/;

var get_tag_value = function (line) {
    var fields = line.split (":");
    var tag = fields.shift();
    var value = fields.join(":");
    // TODO: remove leading spaces
    return {
        tag : tag,
        value : value
    };
};

var parse_line = function (line) {
    return line.split("\t");
};

var parse_tree = function (tree_str) {
    var this_tree = node(newick.parse_newick(tree_str));

    this_tree.apply (function (n) {
        var name_raw = n.node_name();
        var name_arr = name_raw.split("_");
        //console.log(name_arr);
        n.property("name", name_arr[0]);
        n.property("members", name_arr[1]);
        //console.log(n.data());
    });

    return this_tree;
};

var parse_ids_tree = function (ids_tree_str){
    var ids_tree = node(newick.parse_newick(ids_tree_str));
    var ids = {};

    ids_tree.apply(function (n) {
        var name_raw = n.node_name();
        //console.log(name_raw);
        var name_arr = ids_pattern.exec(name_raw);
        ids[name_arr[2]] = n.id();
    });
    return ids;
};

var parse_ids_format = function (ids_format_str, old_ids) {
    var ids_fmt_tree = node(newick.parse_newick(ids_format_str));
    var ids = {};
    ids_fmt_tree.apply (function (n) {
        var name = n.node_name();
        if (name) {
            ids[old_ids[name]] = n.id();
            //ids[n.id()] = old_ids[name];
        }
    });
    return ids;
};

var map_pvals = function (tree, pval_tree, ids) {
    tree.apply (function (n) {
        var tname = n.node_name();
        var tid = n.property("_id");
        var pval_node = pval_tree.find_node (function (pn) {
            return pn.property("_id") === ids[tid];
        });
        if (pval_node) {
            n.property("pvalue", pval_node.node_name());
        }
    });
};

var process_file = function (err, data, id, res) {
    console.log("ID: " + id);
    if (err) {
        console.log(err);
        throw err;
    }
    var lines = data.split ("\n");

    // First the tree
    var tree_line = lines[0];
    var tree_tag_val = get_tag_value (tree_line);
    var tree = node(newick.parse_newick(tree_tag_val.value));

    // The lambda
    var lambda_line = lines[1];
    var lambda_tag_val = get_tag_value (lambda_line);
    var lambda = lambda_tag_val.value.split("\t")[1];

    // ids
    var ids_line = lines[3];
    var ids_tag_val = get_tag_value (ids_line);
    var ids = parse_ids_tree(ids_tag_val.value);

    // fmt ids
    var ids_fmt_line = lines[4];
    var ids_fmt_tag_val = "(" + (ids_fmt_line.split(":").pop().trim().split(" ").join(",")) + ")";
    var map_ids = parse_ids_format (ids_fmt_tag_val, ids);

    // The individual family lines
    for (var i=11; i<lines.length-1; i++) {
        var rec = parse_line(lines[i]);
        if (rec[0] === id) {
            var this_tree = parse_tree(rec[1]);
            var pval = rec[2];
            var this_pval_tree = node(newick.parse_newick(rec[3]));
            map_pvals (this_tree, this_pval_tree, map_ids);
            this_tree.apply (function (n) {
                n.property("_parent", undefined); // avoid circular structures
            });

            // Render
            var data_tree = this_tree.data();
            blade.compileFile("./src/index.blade", {}, function (err, tmpl) {
                if (err) {
                    console.log(err);
                }
                tmpl ({
                    'title': 'CAFE output',
                    'geneFamilyName': rec[0],
                    'familyPvalue': pval,
                    'tree': "./" + rec[0] + ".json"
                }, function (err, html) {
                    fs.writeFile("./src/" + rec[0] + ".json", JSON.stringify(data_tree), function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    // res.send ("Hello world");
                    res.send(html);
                    // console.log("WRITInG file " + "./src/" + rec[0] + ".html");
                    // fs.writeFile("./src/" + rec[0] + ".html", html, function (err) {
                    //     if (err) {
                    //         console.log(err);
                    //     } else {
                    //
                    //     }
                    // });
                });
            });
            break;
        }
    }
};

var parse = function (filename, id, res) {
    fs.readFile (filename, {encoding : 'utf8'}, function (err, data) {
        process_file.call(this, err, data, id, res);
    });
};

module.exports = exports = parse;
