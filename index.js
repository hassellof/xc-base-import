#!/usr/bin/env node

var program = require('commander');

program
  .option('-x, --xliff <xliff file location>', 'The XLIFF file to import')
  .option('-p, --project <xcode project location>', 'The location of the project to import the file into')
  .parse(process.argv);

console.log('xliff: %s; project: %s; file: %s', program.xliff, program.project);
