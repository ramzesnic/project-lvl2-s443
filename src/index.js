import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';
import render from './renders';

const types = [
  {
    type: 'nested',
    check: (key, before, after) => before[key] instanceof Object && after[key] instanceof Object,
    process: (key, before, after, buildNode) => ({
      type: 'nested',
      key,
      children: buildNode(before[key], after[key]),
    }),
  },
  {
    type: 'unchanged',
    check: (key, before, after) => _.has(before, key)
      && _.has(after, key) && before[key] === after[key],
    process: (key, before) => ({
      type: 'unchanged',
      key,
      value: before[key],
    }),
  },
  {
    type: 'changed',
    check: (key, before, after) => _.has(before, key)
      && _.has(after, key) && before[key] !== after[key],
    process: (key, before, after) => ({
      type: 'changed',
      key,
      before: before[key],
      after: after[key],
    }),
  },
  {
    type: 'added',
    check: (key, before, after) => !_.has(before, key) && _.has(after, key),
    process: (key, before, after) => ({
      type: 'added',
      key,
      value: after[key],
    }),
  },
  {
    type: 'deleted',
    check: (key, before, after) => _.has(before, key) && !_.has(after, key),
    process: (key, before) => ({
      type: 'deleted',
      key,
      value: before[key],
    }),
  },
];

const getData = pathToFile => fs.readFileSync(pathToFile, 'utf-8');

const buildAst = (before, after) => {
  const allKeys = _.union(Object.keys(before), Object.keys(after));
  return allKeys.map((key) => {
    const { process } = types.find(({ check }) => check(key, before, after));
    return process(key, before, after, buildAst);
  });
};

export default (pathBefore, pathAfter) => {
  const before = parse(path.extname(pathBefore), getData(pathBefore));
  const after = parse(path.extname(pathAfter), getData(pathAfter));
  const ast = buildAst(before, after);
  return render(ast);
};
