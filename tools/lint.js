'use strict';

const chokidar = require('chokidar');
const eslint = require('eslint');
const path = require('path');

const targets = ['webpack.config.*', 'src', 'tools'];
const cli = new eslint.CLIEngine();
const formatter = cli.getFormatter('stylish');

function lint(files) {
  const results = cli.executeOnFiles(files || targets);
  const output = formatter(results.results);

  if (output) {
    process.stdout.write(output);
  }

  process.exitCode = results.errorCount ? 1 : 0;
}

lint();

if (process.argv.indexOf('--watch') !== -1) {
  process.exitCode = 0;
  chokidar.watch(targets, {
    ignored: /\.git|node_modules|bower_components/
  }).on('change', function (filePath) {
    if (!cli.isPathIgnored(filePath) && path.extname(filePath) === '.js') {
      lint([filePath]);
    }
  }).on('error', function (error) {
    process.stderr.write((error.stack || error.message) + '\n');
    process.exitCode = 1;
  });
}
