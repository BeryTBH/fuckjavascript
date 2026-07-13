const { randomName } = require("../random");

const reserved = new Set([
    "replace",
    "fromCharCode",
    "log",
    "length",
    "prototype",
    "constructor",
    "toString",
    "valueOf",
    "push",
    "pop",
    "map",
    "forEach",
    "split",
    "join",
    "charCodeAt",
    "padStart"
]);

module.exports = function properties(ast) {
    const map = new Map();

    function getName(old) {
        if (!map.has(old)) {
            map.set(
                old,
                randomName()
            );
        }

        return map.get(old);
    }

    function walk(node, parent = null) {
        if (!node || typeof node !== "object") {
            return;
        }

        if (node.type === "Property" && node.key.type === "Identifier") {
            const old = node.key.name;

            node.key = {
                type: "Literal",
                value: getName(old)
            };

            node.computed = false;
        }

        // obj.property -> obj["property"]
        if (node.type === "MemberExpression" && !node.computed && node.property.type === "Identifier") {
            const old = node.property.name;

            if (reserved.has(old)) {
                return;
            }

            node.property = {
                type: "Literal",
                value: getName(old)
            };

            node.computed = true;
        }

        for (let key in node) {
            if (key === "type") {
                continue;
            }

            const child = node[key];

            if (Array.isArray(child)) {
                child.forEach(c =>
                    walk(c, node)
                );
            }
            else if (child && typeof child === "object") {
                walk(child, node);
            }
        }
    }

    walk(ast);

    return ast;
};