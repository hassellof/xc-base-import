
const fs = require('fs');
const et = require('elementtree');
const path = require('path');

function parse(filePath) {
  var data = fs.readFileSync(filePath).toString();
  if (data == null) {
    return null;
  }
  var xliffFile = et.parse(data);
  var files = [];
  var fileElements = xliffFile.findall('./file');
  fileElements.forEach(function(fileElement) {
    var file = {};
    file.path = fileElement.get('original');
    file.sourceLanguage = fileElement.get('source-language');
    file.targetLanguage = fileElement.get('target-language');
    file.type = path.extname(file.path).split('.')[1];
    file.tranlationUnits = [];
    fileElement.findall('body/trans-unit').forEach(function(unitElement) {
      var source = unitElement.find('source');
      var target = unitElement.find('target');
      if (source == null || target == null) {
        return;
      }
      file.tranlationUnits[file.tranlationUnits.length] = {
        'identifier': unitElement.get('id'),
        'source': source.text,
        'target': target.text
      };
    });
    files[files.length] = file;
  });
  return files;
}

module.exports = {
  'parse': parse
};
