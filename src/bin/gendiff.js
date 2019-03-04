#!/usr/bin/env node
import commander from 'commander';

commander
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-v, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
