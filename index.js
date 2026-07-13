const fs = require("fs");

const { obfuscate } = require("./src/core");

const input = process.argv[2];

if (!input) {
    console.log("[i] usage to fuckjavascript: node index.js file.js");
    process.exit();
}

async function main(){
    let code = fs.readFileSync(input,"utf8");

    let output = await obfuscate(code);

    fs.writeFileSync(
        "out.js",
        output
    );

    console.log("[v] done -> out.js");
}

main();