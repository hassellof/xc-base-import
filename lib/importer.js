
const path = require('path');
const utils = require('./utils');
const xliffParser = require('./xliffparser');
const IBDocument = require('./ibdocument');

function importLocalization(xliffPath, projectPath) {
  var developmentLanguage = 'en';
  var localizationFiles = xliffParser.parse(xliffPath);
  if (!localizationFiles) {
    return false;
  }
  localizationFiles
    .filter(file => file.type == 'storyboard' || file.type == 'xib')
    .forEach(file => {
      if (!validateLocalizationFile(file, developmentLanguage)) {
        return;
      }
      var ibDocument = new IBDocument(path.join(projectPath, file.path));
      if (!ibDocument.isLoaded) {
        return;
      }
      applyLocalizationFile(file, ibDocument);
      ibDocument.write();
    });
  return true;
}

function validateLocalizationFile(file, language) {
  return file.sourceLanguage == file.targetLanguage && file.targetLanguage == language;
}

function applyLocalizationFile(file, ibDocument) {
  file.translationUnits.forEach(unit => {
    ibDocument.applyTranslationUnit(unit);
  });
}

module.exports = {
  'importLocalization': importLocalization
};
