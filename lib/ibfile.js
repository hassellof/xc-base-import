
const fs = require('fs');
const et = require('elementtree');
const path = require('path');
const utils = require('utils');
const getTranslator = require('gettranslator');

function createIBFile(projectPath, filePath) {
  var fullPath = path.join(projectPath, filePath);
  var data = utils.readFileSafe(fullPath);
  if (!data) {
    return null;
  }
  var rootElement = et.parse(data);
  return new IBFile(fullPath, rootElement);
}

function IBFile(fullPath, rootElement) {
  this._fullPath = fullPath;
  this._rootElement = rootElement;
}

IBFile.prototype.applyTranslationUnit = function(translationUnit) {
  var unitDetails = this._getTranslationUnitDetails(translationUnit);
  if (!unitDetails) {
    return;
  }
  var translatedElement = this._rootElement.find('*/[@id="' + id + '"]');
  if (!translatedElement) {
    return;
  }
  var translator = getTranslator(unitDetails);
  translator.applyTranslation(translatedElement);
}

IBFile.prototype.write = function(filePath) {
  filePath = filePath || this._fullPath;
  var data = this._rootElement.write({'indent': 4});
  fs.writeFileSync(filePath, data);
}

/************ Private API ************/

IBFile.prototype._getTranslationUnitDetails(unit) {
  if (!unit.note || !unit.target) {
    return null;
  }
  var parsedNote = this._parseTranslationUnitNote(unit.note);
  if (!parsedNote) {
    return null;
  }
  return {
    'target': unit.target,
    'objectID': parsedNote.objectID,
    'className': parsedNote.className
  }
}

IBFile.prototype._parseTranslationUnitNote(note) {
  var objectID, className;
  var components = unit.note
    .split(';')                   // Split the string into elements
    .map(x => x.trim())           // Get rid of the leading space
    .filter(x => x);              // Remove the empty items (should be the last one)
    .map(x => x.split(' = '))     // Transform into array of key-value arrays
    .filter(x => x.length == 2);  // Filter out items that don't have a key or a value
  components.forEach(x => {
      var value = x[1].replace(/"/g, '');
      switch (x[0]) {
        case 'ObjectID':
          objectID = value; break;
        case 'Class':
          className = value; break;
        default: break;
      }
  });
  if (!objectID || !className) {
    return null;
  }
  return { objectID, className }
}

module.exports = {
  'createIBFile': createIBFile
};
