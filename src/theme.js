var tnt = {};
tnt.tree = require("tnt.tree");
tnt.tooltip = require("tnt.tooltip");

var cafe_tree = function () {
    // LOCAL VARS
    var theme = function (data_file, div) {

        var label = tnt.tree.label.text()
            .color(function (d) {
                if (d.members === 0) {
                    return 'lightgrey';
                }
                return 'black';
            })
            .text(function (node) {
                if (node.is_leaf()) {
                    return node.property("members") + " " + node.node_name();
                } else {
                    return node.property("members");
                }
            })
            .fontsize(12)
            .height(25);

        var tooltip = tnt.tooltip.table()
            .allow_drag(true);

        var cafe_tooltip = function (node) {
            var node_data = node.data();
            console.log(node_data.name);
            console.log(node.node_name());
            console.log(node.property("name"));
            var name = node_data.name;

            var obj = {};
            obj.header = name;
            obj.rows = [
                {
                    label : "Node ID",
                    value : node_data._id
                },
                {
                    label : "Members",
                    value : node_data.members
                },
                {
                    label : "p-value",
                    value : node_data.pvalue
                },
                {
                    label : "Lambda",
                    value : node_data.lambda
                }
            ];
            tooltip.call(this, obj);
        };

        d3.json(data_file, function (treeData) {
            var tree_vis = tnt.tree()
                .data (treeData)
                .layout (tnt.tree.layout.vertical()
                    .width(630)
                    .scale(false)
                )
                .label (label)
                .branch_color (function (source, target) {
                    if (target.property("pvalue") < 0.05) {
                        console.log(source.property("members") + " vs " + target.property("members"));
                        console.log((source.property("members")-0) < (target.property("members"))-0);
                        if ((source.property("members")-0)< (target.property("members")-0)) {
                            return "red";
                        } else {
                            return "green";
                        }
                    }
                    if (target.property("members") === 0) {
                        return "lightgrey";
                    }
                    return "black";
                })
                .node_display (tnt.tree.node_display.circle()
                    .size (8)
                    .fill (function (node) {
                        if (node.members === 0) {
                            return "lightgrey";
                        }
                        return "steelblue";
                    })
                )
                .on("click", cafe_tooltip);

            tree_vis(div);
        });
    };

    return theme;
};
module.exports = exports = cafe_tree;
