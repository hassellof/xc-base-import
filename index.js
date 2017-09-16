#!/usr/bin/env node

var program = require('commander');
var importer = require('./lib/importer');

program
  .option('-x, --xliff <xliff file location>', 'The XLIFF file to import')
  .option('-p, --project <xcode project location>', 'The location of the project to import the file into')
  .parse(process.argv);

importer.importLocalization(program.xliff, program.project);
