
const et = require('elementtree');
const path = require('path');
const utils = require('./utils');

function parse(filePath) {
  var data = utils.readFileSafe(filePath);
  if (!data) {
    return;
  }
  var rootElement = et.parse(data);
  var fileElements = rootElement.findall('./file');
  return fileElements.map(createFile).filter(x => x);
}

function createFile(fileElement) {
  var file = {};
  file.path = fileElement.get('original');
  file.sourceLanguage = fileElement.get('source-language');
  file.targetLanguage = fileElement.get('target-language');
  file.type = path.extname(file.path).split('.').pop();
  var translationUnitElements = fileElement.findall('body/trans-unit');
  file.translationUnits = translationUnitElements.map(createTranslationUnit).filter(x => x);
  return file;
}

function createTranslationUnit(unitElement) {
  var id = unitElement.get('id');
  var source = unitElement.find('source');
  var target = unitElement.find('target');
  var note = unitElement.find('note');
  if (!(id && source && target)) {
    return null;
  }
  return {
    'id': id,
    'source': source.text,
    'target': target.text,
    'note': note ? note.text : null
  };
}

module.exports = {
  'parse': parse
};
