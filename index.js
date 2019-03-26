#!/usr/bin/env node

var cli     = require('cli').enable('version').setApp('ntee', '1.2.0');
var fs      = require('fs');
var path    = require('path');
var cwd     = process.cwd();
var options = cli.parse({
  'append':            ['a', 'append to the given FILEs, do not overwrite'],
  'ignore-interrupts': ['i', 'ignore interrupt signals'],
  'suppress':          ['s', 'do NOT output to stdout']
});
var fsWriteFunc = options.append ? 'appendFile' : 'writeFile';


function writeToFiles (data, files) {
  if (!files.length) {
    return output(data);
  }

  fs[fsWriteFunc](path.resolve(cwd, files.shift()), data, function (err) {
    if (err) throw err;
    writeToFiles(data, files);
  });

}

function output (data) {
  if (!options.suppress) {
    cli.output(data);
  }
}

function interceptInt () {
  if (!options['ignore-interrupts']) {
    process.exit();
  }
}

process.on('SIGINT', interceptInt);

cli.withStdin(function (stdin) {
  writeToFiles(stdin, cli.args);
});
