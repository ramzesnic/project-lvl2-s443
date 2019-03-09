import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';
import render from './renders';

const types = [
  {
    check: (key, dataBefore, dataAfter) => dataBefore[key] instanceof Object
      && dataAfter[key] instanceof Object,
    process: (key, dataBefore, dataAfter, buildNode) => ({
      type: 'nested',
      key,
      children: buildNode(dataBefore[key], dataAfter[key]),
    }),
  },
  {
    check: (key, dataBefore, dataAfter) => _.has(dataBefore, key)
      && _.has(dataAfter, key) && dataBefore[key] === dataAfter[key],
    process: (key, dataBefore) => ({
      type: 'unchanged',
      key,
      value: dataBefore[key],
    }),
  },
  {
    check: (key, dataBefore, dataAfter) => _.has(dataBefore, key)
      && _.has(dataAfter, key) && dataBefore[key] !== dataAfter[key],
    process: (key, dataBefore, dataAfter) => ({
      type: 'changed',
      key,
      oldValue: dataBefore[key],
      newValue: dataAfter[key],
    }),
  },
  {
    check: (key, dataBefore, dataAfter) => !_.has(dataBefore, key) && _.has(dataAfter, key),
    process: (key, dataBefore, dataAfter) => ({
      type: 'added',
      key,
      value: dataAfter[key],
    }),
  },
  {
    check: (key, dataBefore, dataAfter) => _.has(dataBefore, key) && !_.has(dataAfter, key),
    process: (key, dataBefore) => ({
      type: 'deleted',
      key,
      value: dataBefore[key],
    }),
  },
];

const getData = pathToFile => fs.readFileSync(pathToFile, 'utf-8');

const buildAst = (dataBefore, dataAfter) => {
  const allKeys = _.union(Object.keys(dataBefore), Object.keys(dataAfter));
  return allKeys.map((key) => {
    const { process } = types.find(({ check }) => check(key, dataBefore, dataAfter));
    return process(key, dataBefore, dataAfter, buildAst);
  });
};

export default (pathBefore, pathAfter, format) => {
  const dataBefore = parse(path.extname(pathBefore), getData(pathBefore));
  const datadataAfter = parse(path.extname(pathAfter), getData(pathAfter));
  const ast = buildAst(dataBefore, datadataAfter);
  return render(ast, format);
};
