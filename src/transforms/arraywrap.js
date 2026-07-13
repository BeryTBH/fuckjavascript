const { randomName } = require("../random");

module.exports = function arraywrap(code) {
    const arrayName = randomName();
    const callName = randomName();

    return `
const ${arrayName} = {
    ${callName}: () => {
        ${code}
    }
};

${arrayName}.${callName}();`;
};