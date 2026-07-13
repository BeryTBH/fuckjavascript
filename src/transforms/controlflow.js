const { randomName } = require("../random");


module.exports = function controlflow(ast) {


    function flattenFunction(node) {

        if (
            !node.body ||
            node.body.type !== "BlockStatement"
        ) {
            return;
        }


        const body = node.body.body;


        if (body.length < 3) {
            return;
        }


        const stateName = randomName();


        const cases = [];


        body.forEach((statement, index) => {

            cases.push({

                type: "SwitchCase",

                test: {
                    type: "Literal",
                    value: index
                },

                consequent: [

                    statement,

                    {
                        type: "ExpressionStatement",

                        expression: {

                            type: "AssignmentExpression",

                            operator: "=",

                            left: {
                                type: "Identifier",
                                name: stateName
                            },

                            right: {
                                type: "Literal",
                                value: index + 1
                            }

                        }

                    },

                    {
                        type: "BreakStatement"
                    }

                ]

            });

        });


        cases.push({

            type: "SwitchCase",

            test: {
                type: "Literal",
                value: body.length
            },

            consequent: [
                {
                    type: "BreakStatement"
                }
            ]

        });



        node.body.body = [

            {
                type: "VariableDeclaration",

                kind: "let",

                declarations: [
                    {
                        type: "VariableDeclarator",

                        id: {
                            type: "Identifier",
                            name: stateName
                        },

                        init: {
                            type: "Literal",
                            value: 0
                        }
                    }
                ]
            },


            {
                type: "WhileStatement",

                test: {
                    type: "Literal",
                    value: true
                },

                body: {

                    type: "BlockStatement",

                    body: [

                        {
                            type: "SwitchStatement",

                            discriminant: {
                                type: "Identifier",
                                name: stateName
                            },

                            cases: cases

                        },

                        {
                            type: "IfStatement",

                            test: {

                                type: "BinaryExpression",

                                operator: "===",

                                left: {
                                    type: "Identifier",
                                    name: stateName
                                },

                                right: {
                                    type: "Literal",
                                    value: body.length
                                }

                            },

                            consequent: {

                                type: "BreakStatement"

                            },

                            alternate: null

                        }

                    ]

                }

            }

        ];

    }



    function walk(node) {

        if (!node || typeof node !== "object") {
            return;
        }


        if (
            node.type === "FunctionDeclaration"
        ) {
            flattenFunction(node);
        }


        for (const key in node) {

            if (key === "type")
                continue;


            const child = node[key];


            if (Array.isArray(child)) {

                child.forEach(walk);

            }
            else if (
                child &&
                typeof child === "object"
            ) {

                walk(child);

            }

        }

    }


    walk(ast);


    return ast;
};