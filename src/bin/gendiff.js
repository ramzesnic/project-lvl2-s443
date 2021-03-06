#!/usr/bin/env node
import commander from 'commander';
import genDiff from '..';

commander
  .version('0.0.7')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-v, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format', 'diff')
  .action((firstConfig, secondConfig) => {
    console.log(genDiff(firstConfig, secondConfig, commander.format));
  })
  .parse(process.argv);
