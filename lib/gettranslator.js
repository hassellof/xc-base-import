
module.exports = function(unitDetails) {
  return new StubTranslator(unitDetails);
}

function StubTranslator(unitDetails) {
  this._unitDetails = unitDetails;
}

StubTranslator.prototype.applyTranslation(translatedElement) {
  console.log(`Translating ${translatedElement.get('id')}`);
}
