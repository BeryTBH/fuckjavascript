const acorn = require("acorn");
const { generate } = require("astring");

const strings = require("./transforms/strings");
const rename = require("./transforms/rename");
const properties = require("./transforms/properties");
const controlflow = require("./transforms/controlflow");
const junk = require("./transforms/junk");
const arraywrap = require("./transforms/arraywrap");
const minify = require("./transforms/minify");

async function obfuscate(code){
    let ast = acorn.parse(code, {
        ecmaVersion: "latest"
    });

    ast = strings(ast);
    ast = properties(ast);
    ast = rename(ast);
    ast = controlflow(ast);
    ast = junk(ast);

    let output = generate(ast);

    output = arraywrap(output);
    output = await minify(output);

    return output;
}

module.exports={
    obfuscate
};