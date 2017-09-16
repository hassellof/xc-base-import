
const winston = require('winston');
const et = require('elementtree');
const subElement = et.SubElement;

function SimpleTranslator(unitDetails) {
  this.unitDetails = unitDetails;
}

SimpleTranslator.prototype.applyTranslation = function(translatedElement) {
  this.updatePropertyValue(this.unitDetails.propertyName, translatedElement);
}

SimpleTranslator.prototype.updatePropertyValue = function(propertyName, element) {
  if (!this._checkHasValue(propertyName, element)) {
    winston.log('warn', `Element "${element.tag}" doesn't have a value for "${propertyName}" for unit with id "${this.unitDetails.id}"`);
    return;
  }
  this._removeValue(propertyName, element);
  this._setValue(propertyName, element);
}

SimpleTranslator.prototype._checkHasValue = function(propertyName, element) {
  if (element.get(propertyName)) {
    return true;
  }
  if (this._getStringElement(propertyName, element)) {
    return true;
  }
  return false;
}

SimpleTranslator.prototype._removeValue = function(propertyName, element) {
  delete element.attrib[propertyName];
  var stringElement = this._getStringElement(propertyName, element);
  if (stringElement) {
    element.remove(stringElement);
  }
}

SimpleTranslator.prototype._setValue = function(propertyName, element) {
  if (!this.unitDetails.target.includes('\n')) {
    element.set(propertyName, this.unitDetails.target);
    return;
  }
  var stringElement = subElement(element, 'string');
  stringElement.set('key', propertyName);
  stringElement.text = this.unitDetails.target;
}

SimpleTranslator.prototype._getStringElement = function(propertyName, element) {
  return element.find(`string[@key="${propertyName}"]`);
}

module.exports = SimpleTranslator;
