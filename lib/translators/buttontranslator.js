
const winston = require('winston');
const SimpleTranslator = require('./simpletranslator');

function ButtonTranslator(unitDetails) {
  SimpleTranslator.call(this, unitDetails);
}
ButtonTranslator.prototype = Object.create(SimpleTranslator.prototype);
ButtonTranslator.prototype.constructor = ButtonTranslator;

ButtonTranslator.prototype.applyTranslation = function(translatedElement) {
  if (!this.unitDetails.propertyName.endsWith('Title')) {
    Object.getPrototypeOf(ButtonTranslator.prototype).applyTranslation.call(this, translatedElement);
    return;
  }
  var key = this.unitDetails.propertyName.replace('Title', '');
  var stateElement = translatedElement.find(`state[@key="${key}"]`);
  if (!stateElement) {
    winston.log('warn', `Translated element "${this.unitDetails.id}" of type "${this.unitDetails.className}" doesn't have a value for state "${key}"`);
    return;
  }
  this.updatePropertyValue('title', stateElement);
}

module.exports = ButtonTranslator;
