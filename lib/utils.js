
var fs = require('fs');

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath).toString();
  } catch(e) {
    return null;
  }
}

module.exports = {
  'readFileSafe': readFileSafe
};
