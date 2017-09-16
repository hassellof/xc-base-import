
const fs = require('fs');
const et = require('elementtree');
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
  this._rootElement = et.parse(data);
}

IBDocument.prototype.applyTranslationUnit = function(translationUnit) {
  winston.log('verbose', `Applying "${translationUnit.target}" to "${translationUnit.id}" in "${this.filePath}"`);
  var unitDetails = this._getTranslationUnitDetails(translationUnit);
  if (!unitDetails) {
    winston.log('warn', `Couldn't parse the notes for the translation unit with id "${translationUnit.id}"`);
    return;
  }
  var translatedElement = this._rootElement.find('.//*[@id="' + unitDetails.objectID + '"]');
  if (!translatedElement) {
    winston.log('warn', `Couldn't find the element with id "${unitDetails.objectID}" in "${this.filePath}"`);
    return;
  }
  var translator = getTranslator(unitDetails);
  if (!translator) {
    winston.log('warn', `Couldn't find a transator for the element with type "${unitDetails.className}"`);
    return;
  }
  translator.applyTranslation(translatedElement);
  winston.log('verbose', `Applied "${translationUnit.target}" to "${translationUnit.id}" in "${this.filePath}"`);
}

IBDocument.prototype.write = function(filePath) {
  filePath = filePath || this.filePath;
  var data = this._rootElement.write({'indent': 4});
  fs.writeFileSync(filePath, data);
}

/************ Private API ************/

IBDocument.prototype._getTranslationUnitDetails = function(unit) {
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
  return { objectID, className }
}

module.exports = IBDocument;
