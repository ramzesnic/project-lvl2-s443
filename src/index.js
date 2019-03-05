import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';

const types = [
  {
    type: 'unchanged',
    check: (key, before, after) => _.has(before, key)
      && _.has(after, key) && before[key] === after[key],
    process: (key, before) => ({
      type: 'unchanged',
      key,
      value: before[key],
      toString: function toString() {
        return `    ${this.key}: ${this.value}`;
      },
    }),
  },
  {
    type: 'changed',
    check: (key, before, after) => _.has(before, key)
      && _.has(after, key) && before[key] !== after[key],
    process: (key, before, after) => ({
      type: 'changed',
      key,
      beforeValue: before[key],
      afterValue: after[key],
      toString: function toString() {
        return `  + ${this.key}: ${this.afterValue}\n  - ${this.key}: ${this.beforeValue}`;
      },
    }),
  },
  {
    type: 'added',
    check: (key, before, after) => !_.has(before, key) && _.has(after, key),
    process: (key, before, after) => ({
      type: 'added',
      key,
      value: after[key],
      toString: function toString() {
        return `  + ${this.key}: ${this.value}`;
      },
    }),
  },
  {
    type: 'deleted',
    check: (key, before, after) => _.has(before, key) && !_.has(after, key),
    process: (key, before) => ({
      type: 'deleted',
      key,
      value: before[key],
      toString: function toString() {
        return `  - ${this.key}: ${this.value}`;
      },
    }),
  },
];

const getData = pathToFile => fs.readFileSync(pathToFile, 'utf-8');

const buildAst = (before, after) => {
  const allKeys = _.union(Object.keys(before), Object.keys(after));
  return allKeys.map((key) => {
    const { process } = types.find(({ check }) => check(key, before, after));
    return process(key, before, after);
  });
};

export default (pathBefore, pathAfter) => {
  const before = parse(path.extname(pathBefore), getData(pathBefore));
  const after = parse(path.extname(pathAfter), getData(pathAfter));
  const ast = buildAst(before, after);
  return ['{', ...ast, '}'].join('\n');
};
