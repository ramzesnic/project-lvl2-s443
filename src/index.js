import fs from 'fs';
import _ from 'lodash';

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

const parser = (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf-8');
  return JSON.parse(data);
};

const buildAst = (before, after) => {
  const allKeys = _.union(Object.keys(before), Object.keys(after));
  return allKeys.map((key) => {
    // console.log(key);
    // console.log(before);
    // console.log(after);
    const { process } = types.find(({ check }) => check(key, before, after));
    return process(key, before, after);
  });
};

export default (pathBefore, pathAfter) => {
  const before = parser(pathBefore);
  const after = parser(pathAfter);
  const ast = buildAst(before, after);
  // ast.toString = function toString() {
  //   return ['{', ...this.map(obj => obj.toString()), '}'].join('\n');
  // };
  // return ast;
  return ['{', ...ast.map(obj => obj.toString()), '}'].join('\n');
};
