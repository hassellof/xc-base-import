#!/usr/bin/env node

var program = require('commander');
var importer = require('./lib/importer');

program
  .option('-x, --xliff <xliff file location>', 'The XLIFF file to import')
  .option('-p, --project <xcode project location>', 'The location of the project to import the file into')
  .option('--verbose', 'Specify to get a verbose logging output')
  .parse(process.argv);

var logLevel = program.verbose ? 'verbose' : 'info';
importer.importLocalization(program.xliff, program.project, {'log_level': logLevel});
