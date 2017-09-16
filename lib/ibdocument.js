
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;
const xpath = require('xpath');
const winston = require('winston');
const utils = require('./utils');
const getTranslator = require('./gettranslator');

function IBDocument(filePath) {
  this.filePath = filePath;
  var data = utils.readFileSafe(filePath);
  if (!data) {
    this.isLoaded = false;
    return;
  }
  this.isLoaded = true;
  this._documentNode = new DOMParser().parseFromString(data);
}

IBDocument.prototype.applyTranslationUnit = function(translationUnit) {
  winston.log('verbose', `Applying "${translationUnit.target}" to "${translationUnit.id}" in "${this.filePath}"`);
  var unitDetails = this._getTranslationUnitDetails(translationUnit);
  if (!unitDetails) {
    winston.log('warn', `Couldn't parse the notes for the translation unit with id "${translationUnit.id}"`);
    return;
  }
  var translatedNode = xpath.select1(`//*[@id="${unitDetails.objectID}"]`, this._documentNode);
  if (!translatedNode) {
    winston.log('warn', `Couldn't find the element with id "${unitDetails.objectID}" in "${this.filePath}"`);
    return;
  }
  var translator = getTranslator(unitDetails);
  if (!translator) {
    winston.log('warn', `Couldn't find a transator for the element with type "${unitDetails.className}"`);
    return;
  }
  translator.applyTranslation(translatedNode);
  winston.log('verbose', `Applied "${translationUnit.target}" to "${translationUnit.id}" in "${this.filePath}"`);
};

IBDocument.prototype.write = function(filePath) {
  filePath = filePath || this.filePath;
  var data = new XMLSerializer().serializeToString(this._documentNode);
  fs.writeFileSync(filePath, data);
};

/************ Private API ************/

IBDocument.prototype._getTranslationUnitDetails = function(unit) {
  if (!unit.note || !unit.target) {
    return null;
  }
  var parsedNote = this._parseTranslationUnitNote(unit.note);
  if (!parsedNote) {
    return null;
  }
  var components = unit.id.split('.');
  if (components.length < 2) {
    return null;
  }
  return {
    'id': components[0],
    'propertyName': components[1],
    'target': unit.target,
    'objectID': parsedNote.objectID,
    'className': parsedNote.className
  };
};

IBDocument.prototype._parseTranslationUnitNote = function(note) {
  var objectID, className;
  var components = note
    .split(';')                   // Split the string into elements
    .map(x => x.trim())           // Get rid of the leading space
    .filter(x => x)               // Remove the empty items (should be the last one)
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
  return { objectID, className };
};

module.exports = IBDocument;
