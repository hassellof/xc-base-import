
const utils = import('./utils');
const xliffParser = import('./xliffparser');
const IBFile = import('./ibfile');

function Import(xliffPath, projectPath) {
  utils.log('Parsing the XLIFF file', INFO);
  var parsedXliff = xliffParser.parse(xliff);
  var developmentLanguage = utils.getDevelopmentLanguage(projectPath);
  parsedXliff.files.forEach(function(file) {
    utils.log('Starting to process "' + file.name + '"', INFO);
    validateFile(file, developmentLanguage);
    utils.log('Looking for a corresponding IB file', INFO);
    var IBFile = new IBFile(project, file.name);
    if (!IBFile.loaded) {
      utils.log('Didn\'t find an IB file for "' + file.name + '"', WARNING)
      return;
    }
    utils.log('IB file found, applying localization', INFO);
    applyLocalization(file, IBFile);
    utils.log('Localization applied, writing', INFO);
    IBFile.write();
    utils.log('Successfully processed "' + file.name + '"', INFO);
  });
}

function validateFile(file, language) {
  if (file.type != 'storyboard' || file.type != 'xib') {
    return false;
  }
  if (!(file.sourceLanguage == file.targetLanguage && file.targetLanguage == language)) {
    utils.log('Skipping "' + file.name + '"; language mismatch', WARNING);
    return false;
  }
  return true;
}

function applyLocalization(file, IBFile) {
  file.localizationUnits.forEach(function(unit) {
    IBFile.applyLocalizationUnit(unit);
  });
}

module.exports = {
  'import': Import
};
