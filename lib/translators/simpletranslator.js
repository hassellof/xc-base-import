
const winston = require('winston');
const xpath = require('xpath');

function SimpleTranslator(unitDetails) {
  this.unitDetails = unitDetails;
}

SimpleTranslator.prototype.applyTranslation = function(translatedNode) {
  this.updatePropertyValue(this.unitDetails.propertyName, translatedNode);
};

SimpleTranslator.prototype.updatePropertyValue = function(propertyName, node) {
  if (!this._checkHasValue(propertyName, node)) {
    winston.log('warn', `Element "${node.tagName}" doesn't have a value for "${propertyName}" for unit with id "${this.unitDetails.id}"`);
    return;
  }
  this._removeValue(propertyName, node);
  this._setValue(propertyName, node);
};

SimpleTranslator.prototype._checkHasValue = function(propertyName, node) {
  if (node.getAttribute(propertyName)) {
    return true;
  }
  if (this._getStringNode(propertyName, node)) {
    return true;
  }
  return false;
};

SimpleTranslator.prototype._removeValue = function(propertyName, node) {
  node.removeAttribute(propertyName);
  var stringNode = this._getStringNode(propertyName, node);
  if (stringNode) {
    node.removeChild(stringNode);
  }
};

SimpleTranslator.prototype._setValue = function(propertyName, node) {
  if (!this.unitDetails.target.includes('\n')) {
    node.setAttribute(propertyName, this.unitDetails.target);
    return;
  }
  var stringNode = node.ownerDocument.createElement('string');
  stringNode.setAttribute('key', propertyName);
  stringNode.textContent = this.unitDetails.target;
  node.appendChild(stringNode);
};

SimpleTranslator.prototype._getStringNode = function(propertyName, node) {
  return xpath.select1(`./string[@key="${propertyName}"]`, node);
};

module.exports = SimpleTranslator;
