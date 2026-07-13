const { randomName } = require("../random");


module.exports = function strings(ast) {
    const strings = [];
    
    const arrayName = randomName();
    const decoderName = randomName();

    function encodeString(str) {
        return str
            .split("")
            .map(c =>
                "\\x" +
                c.charCodeAt(0)
                    .toString(16)
                    .padStart(2, "0")
            )
            .join("");
    }


    function walk(node, parent = null) {
        if (!node || typeof node !== "object") {
            return;
        }

        if (node.type === "Literal" && typeof node.value === "string") {
            let index = strings.length;

            strings.push(encodeString(node.value));

            return {
                type: "CallExpression",
                callee: {
                    type: "Identifier",
                    name: decoderName
                },
                arguments: [
                    {
                        type: "MemberExpression",
                        computed: true,
                        object: {
                            type: "Identifier",
                            name: arrayName
                        },
                        property: {
                            type: "Literal",
                            value: index
                        }
                    }
                ]
            };
        }


        for (let key in node) {
            if (key === "type") {
                continue;
            }

            const child = node[key];

            if (Array.isArray(child)) {
                for (let i = 0; i < child.length; i++) {
                    const replaced = walk(child[i], node);

                    if (replaced) {
                        child[i] = replaced;
                    }
                }

            }
            else if (child && typeof child === "object") {
                const replaced = walk(child, node);

                if (replaced) {
                    node[key] = replaced;
                }
            }
        }
    }

    walk(ast);

    ast.body.unshift({
        type: "VariableDeclaration",
        kind: "const",
        declarations: [
            {
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: arrayName
                },
                init: {
                    type: "ArrayExpression",

                    elements: strings.map(s => ({
                        type: "Literal",
                        value: s
                    }))
                }
            }
        ]
    });

    ast.body.unshift({
        type: "FunctionDeclaration",
        id: {
            type: "Identifier",
            name: decoderName
        },
        params: [
            {
                type: "Identifier",
                name: "s"
            }
        ],
        body: {
            type: "BlockStatement",
            body: [
                {
                    type: "ReturnStatement",
                    argument: {

                        type: "CallExpression",
                        callee: {
                            type: "MemberExpression",
                            computed: false,
                            object: {
                                type: "Identifier",
                                name: "s"
                            },
                            property: {
                                type: "Identifier",
                                name: "replace"
                            }
                        },
                        arguments: [
                            {
                                type: "Literal",
                                value: "\\\\x([0-9a-f]{2})",
                                regex: {
                                    pattern: "\\\\x([0-9a-f]{2})",
                                    flags: "gi"
                                }
                            },
                            {
                                type: "ArrowFunctionExpression",
                                params: [
                                    {
                                        type: "Identifier",
                                        name: "_"
                                    },
                                    {
                                        type: "Identifier",
                                        name: "h"
                                    }
                                ],
                                body: {
                                    type: "CallExpression",
                                    callee: {
                                        type: "MemberExpression",
                                        computed: false,
                                        object: {
                                            type: "Identifier",
                                            name: "String"
                                        },
                                        property: {
                                            type: "Identifier",
                                            name: "fromCharCode"
                                        }
                                    },
                                    arguments: [
                                        {
                                            type: "CallExpression",
                                            callee: {
                                                type: "Identifier",
                                                name: "parseInt"
                                            },
                                            arguments: [
                                                {
                                                    type: "Identifier",
                                                    name: "h"
                                                },
                                                {
                                                    type: "Literal",
                                                    value: 16
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    });

    return ast;
};