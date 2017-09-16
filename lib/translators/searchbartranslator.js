
const winston = require('winston');
const xpath = require('xpath');
const SimpleTranslator = require('./simpletranslator');

function SearchBarTranslator(unitDetails) {
  SimpleTranslator.call(this, unitDetails);
}
SearchBarTranslator.prototype = Object.create(SimpleTranslator.prototype);
SearchBarTranslator.prototype.constructor = SearchBarTranslator;

SearchBarTranslator.prototype.applyTranslation = function(translatedNode) {
  if (!this.unitDetails.propertyName.startsWith('scopeButtonTitles')) {
    Object.getPrototypeOf(SearchBarTranslator.prototype).applyTranslation.call(this, translatedNode);
    return;
  }
  var re = /^scopeButtonTitles\[(\d+)\]$/;
  var results = this.unitDetails.propertyName.match(re);
  if (!results || results.length < 2 || isNaN(Number(results[1]))) {
    winston.log('warn', `For element "${this.unitDetails.id}" of type "${this.unitDetails.className}" couldn't determine the scope button index`);
    return;
  }
  var buttonIndex = Number(results[1]);
  var scopeButtonTitleNodes = xpath.select('./scopeButtonTitles/string', translatedNode);
  if (buttonIndex >= scopeButtonTitleNodes.length) {
    winston.log('warn', `For element "${this.unitDetails.id}" of type "${this.unitDetails.className}" the button index "${buttonIndex}" was out of bounds`);
    return;
  }
  scopeButtonTitleNodes[buttonIndex].textContent = this.unitDetails.target;
};

module.exports = SearchBarTranslator;
