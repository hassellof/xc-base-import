
const winston = require('winston');
const xpath = require('xpath');
const SimpleTranslator = require('./simpletranslator');

function ButtonTranslator(unitDetails) {
  SimpleTranslator.call(this, unitDetails);
}
ButtonTranslator.prototype = Object.create(SimpleTranslator.prototype);
ButtonTranslator.prototype.constructor = ButtonTranslator;

ButtonTranslator.prototype.applyTranslation = function(translatedNode) {
  if (!this.unitDetails.propertyName.endsWith('Title')) {
    Object.getPrototypeOf(ButtonTranslator.prototype).applyTranslation.call(this, translatedNode);
    return;
  }
  var key = this.unitDetails.propertyName.replace('Title', '');
  var stateNode = xpath.select1(`./state[@key="${key}"]`, translatedNode);
  if (!stateNode) {
    winston.log('warn', `Translated element "${this.unitDetails.id}" of type "${this.unitDetails.className}" doesn't have a value for state "${key}"`);
    return;
  }
  this.updatePropertyValue('title', stateNode);
};

module.exports = ButtonTranslator;
