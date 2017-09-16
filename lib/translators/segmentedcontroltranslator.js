
const winston = require('winston');
const SimpleTranslator = require('./simpletranslator');

function SegmentedControlTranslator(unitDetails) {
  SimpleTranslator.call(this, unitDetails);
}
SegmentedControlTranslator.prototype = Object.create(SimpleTranslator.prototype);
SegmentedControlTranslator.prototype.constructor = SegmentedControlTranslator;

SegmentedControlTranslator.prototype.applyTranslation = function(translatedElement) {
  if (!this.unitDetails.propertyName.startsWith('segmentTitles')) {
    Object.getPrototypeOf(SegmentedControlTranslator.prototype).applyTranslation.call(this, translatedElement);
    return;
  }
  var re = /^segmentTitles\[(\d+)\]$/;
  var results = this.unitDetails.propertyName.match(re);
  if (!results || results.length < 2 || isNaN(Number(results[1]))) {
    winston.log('warn', `For element "${this.unitDetails.id}" of type "${this.unitDetails.className}" couldn't determine the segmented item index`);
    return;
  }
  var itemIndex = Number(results[1]);
  var segmentElements = translatedElement.findall('segments/segment');
  if (itemIndex >= segmentElements.length) {
    winston.log('warn', `For element "${this.unitDetails.id}" of type "${this.unitDetails.className}" the segment index "${itemIndex}" was out of bounds`);
    return;
  }
  this.updatePropertyValue('title', segmentElements[itemIndex]);
}

module.exports = SegmentedControlTranslator;
