
const ButtonTranslator = require('./translators/buttontranslator');
const SegmentedControlTranslator = require('./translators/segmentedcontroltranslator');
const SearchBarTranslator = require('./translators/searchbartranslator');
const SimpleTranslator = require('./translators/simpletranslator');

module.exports = function(unitDetails) {
  switch (unitDetails.className) {
    case 'UIButton':
      return new ButtonTranslator(unitDetails);
      break;
    case 'UISegmentedControl':
      return new SegmentedControlTranslator(unitDetails);
      break;
    case 'UISearchBar':
      return new SearchBarTranslator(unitDetails);
      break;
    default:
      return new SimpleTranslator(unitDetails);
  }
}
