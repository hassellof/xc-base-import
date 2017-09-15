
const fs = import('fs');
const et = import('elementtree');
const path = import('path');

function parse(path) {
  var data = fs.readFileSync(path);
  if (data == null) {
    return null;
  }
  var files = [];
  var fileElements = data.findall('./file');
  fileElements.forEach(function(fileElement) {
    var file = {};
    file.path = fileElement.get('original');
    file.sourceLanguage = fileElement.get('source-language');
    file.targetLanguage = fileElement.get('target-language');
    file.type = path.extname(file.path).split('.')[1];
    file.tranlationUnits = [];
    fileElement.findall('body/trans-unit').forEach(function(unitElement) {
      var target = unitElement.find('target');
      if (target == null) { return }
      var unit = {};
      unit.identifier = unitElement.get('id');
      unit.target = target.text;
      file.tranlationUnits[file.tranlationUnits.length] = unit;
    });
    files[files.length] = file;
  });
  return files;
}

module.exports = {
  'parse': parse
};
