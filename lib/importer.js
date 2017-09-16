
const path = require('path');
const winston = require('winston');
const utils = require('./utils');
const xliffParser = require('./xliffparser');
const IBDocument = require('./ibdocument');

function importLocalization(xliffPath, projectPath, opts) {
  winston.level = opts.log_level || 'info';
  winston.log('info', `Starting importing "${xliffPath}" into "${projectPath}"`);
  var developmentLanguage = 'en';
  var localizationFiles = xliffParser.parse(xliffPath);
  if (!localizationFiles) {
    winston.log('error', 'Couldn\'t find or parse the XLIFF file');
    return false;
  }
  localizationFiles
    .filter(file => file.type == 'storyboard' || file.type == 'xib')
    .forEach(file => {
      winston.log('verbose', `Starting processing "${file.path}"`);
      if (!validateLocalizationFile(file, developmentLanguage)) {
        winston.log('warn', `The localization file "${file.path}" doesn't match the development language: "${developmentLanguage}". Skipping`);
        return;
      }
      var ibDocument = new IBDocument(path.join(projectPath, file.path));
      if (!ibDocument.isLoaded) {
        winston.log('warn', `Couldn't find an IB document at path: "${ibDocument.filePath}"`);
        return;
      }
      applyLocalizationFile(file, ibDocument);
      ibDocument.write();
      winston.log('verbose', `Finsihed processing "${file.path}"`);
    });
  winston.log('info', `Finished importing "${xliffPath}" into "${projectPath}"`);
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
