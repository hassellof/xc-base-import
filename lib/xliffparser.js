
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');
const select = xpath.useNamespaces({'ns': 'urn:oasis:names:tc:xliff:document:1.2'});
const path = require('path');
const utils = require('./utils');

function parse(filePath) {
  var data = utils.readFileSafe(filePath);
  if (!data) {
    return;
  }
  var doc = new DOMParser().parseFromString(data);
  var fileNodes = select('//ns:file', doc);
  return fileNodes.map(createFile);
}

function createFile(fileNode) {
  var file = {};
  file.path = fileNode.getAttribute('original');
  file.sourceLanguage = fileNode.getAttribute('source-language');
  file.targetLanguage = fileNode.getAttribute('target-language');
  file.type = path.extname(file.path).split('.').pop();
  var translationUnitNodes = select('./ns:body/ns:trans-unit', fileNode);
  file.translationUnits = translationUnitNodes.map(createTranslationUnit).filter(x => x);
  return file;
}

function createTranslationUnit(unitNode) {
  var id = unitNode.getAttribute('id');
  var source = select('./ns:source', unitNode, true);
  var target = select('./ns:target', unitNode, true);
  var note = select('./ns:note', unitNode, true);
  if (!(id && source && target)) {
    return null;
  }
  return {
    'id': id,
    'source': source.textContent,
    'target': target.textContent,
    'note': note ? note.textContent : null
  };
}

module.exports = {
  'parse': parse
};
