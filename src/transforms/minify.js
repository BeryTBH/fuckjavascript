const terser = require("terser");

module.exports = async function minify(code) {
    const result = await terser.minify(code, {
        compress: {
            unused: false,
            dead_code: false,
            conditionals: false,
            booleans: false,
            loops: false
        },
        mangle: true
    });

    return result.code;
};