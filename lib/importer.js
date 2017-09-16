
const utils = require('./utils');
const xliffParser = require('./xliffparser');
const ibfileCreator = require('./ibfile');

function importLocalization(xliffPath, projectPath) {
  var localizationFiles = xliffParser.parse(xliffPath);
  var developmentLanguage = 'en';
  localizationFiles.forEach(file => {
    if (!validateFile(file, developmentLanguage)) {
      return;
    }
    var IBFile = ibfileCreator.createIBFile(projectPath, file.path);
    if (!IBFile) {
      return;
    }
    applyLocalization(file, IBFile);
    IBFile.write();
  });
}

function validateFile(file, language) {
  if (file.type != 'storyboard' || file.type != 'xib') {
    return false;
  }
  if (!(file.sourceLanguage == file.targetLanguage && file.targetLanguage == language)) {
    return false;
  }
  return true;
}

function applyLocalization(file, IBFile) {
  file.tranlationUnits.forEach(unit => {
    IBFile.applyLocalizationUnit(unit);
  });
}

module.exports = {
  'importLocalization': importLocalization
};
