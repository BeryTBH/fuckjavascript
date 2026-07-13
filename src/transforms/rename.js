const { randomName } = require("../random");

const globals = [
    ...Object.getOwnPropertyNames(globalThis)
];

const reserved = new Set(globals);

module.exports = function rename(ast) {
    const map = new Map();
    const renamed = new WeakSet();

    function getName(oldName) {
        if (reserved.has(oldName)) {
            return oldName;
        }

        if (!map.has(oldName)) {
            map.set(
                oldName,
                randomName()
            );
        }

        return map.get(oldName);
    }

    function walk(node, parent = null) {
        if (!node || typeof node !== "object") {
            return;
        }

        if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
            const oldName = node.id.name;

            node.id.name = getName(oldName);
            renamed.add(node.id);
        }

        if (node.type === "Identifier" && node.name !== undefined) {
            if (renamed.has(node)) {
                return;
            }

            if (parent && parent.type === "MemberExpression" && parent.property === node && !parent.computed) {
                return;
            }

            if (!reserved.has(node.name)) {
                const oldName = node.name;

                node.name = getName(oldName);
                renamed.add(node);
            }
        }

        for (let key in node) {
            if (key === "type") {
                continue;
            }

            const child = node[key];

            if (Array.isArray(child)) {
                for (const item of child) {
                    walk(item, node);
                }
            }
            else if (child && typeof child === "object") {
                walk(child, node);
            }
        }
    }

    walk(ast);

    return ast;
};