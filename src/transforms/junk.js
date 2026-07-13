const { randomName } = require("../random");

module.exports = function junk(ast) {
    function createJunkFunction() {
        const name = randomName();

        return {
            func: {
                type: "FunctionDeclaration",
                id: {
                    type: "Identifier",
                    name: name
                },
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [
                        {
                            type: "VariableDeclaration",
                            kind: "let",
                            declarations: [
                                {
                                    type: "VariableDeclarator",

                                    id: {
                                        type: "Identifier",
                                        name: randomName()
                                    },
                                    init: {
                                        type: "Literal",
                                        value: Math.floor(
                                            Math.random() * 999999
                                        )
                                    }
                                }
                            ]
                        },
                        {
                            type: "WhileStatement",
                            test: {
                                type: "Literal",
                                value: false
                            },
                            body: {
                                type: "BlockStatement",
                                body: []
                            }
                        },
                        {
                            type: "IfStatement",
                            test: {
                                type: "Literal",
                                value: false
                            },
                            consequent: {
                                type: "BlockStatement",
                                body: [
                                    {
                                        type: "ExpressionStatement",
                                        expression: {
                                            type: "Literal",
                                            value: "junk"
                                        }
                                    }
                                ]
                            },
                            alternate: null
                        }
                    ]
                }
            },
            call: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: name
                    },
                    arguments: []
                }
            }
        };
    }

    let amount = Math.floor(
        Math.random() * 5
    ) + 3;

    let junkNodes = [];


    for(let i = 0; i < amount; i++) {

        let junk = createJunkFunction();


        junkNodes.push(
            junk.func
        );


        junkNodes.push(
            junk.call
        );

    }



    for(const node of junkNodes) {

        let position = Math.floor(
            Math.random() * ast.body.length
        );


        ast.body.splice(
            position,
            0,
            node
        );

    }

    return ast;
};