import _ from 'lodash';

const getSpaces = deep => ' '.repeat(2 * deep);
const stringify = (value, deep) => {
  const spaces = getSpaces(deep + 2);
  const closeBlockSpaces = getSpaces(deep);
  return value instanceof Object
    ? `{\n${Object.keys(value).map(key => `${spaces}${key}: ${value[key] instanceof Object ? stringify(value[key], deep) : value[key]}`)}\n${closeBlockSpaces}}`
    : value;
};
const types = {
  nested: (item, deep, spaces, iter) => `${spaces}${item.key}: {\n${_.flatten(iter(item.children, deep + 1)).join('\n')}\n${spaces}}`,
  unchanged: (item, deep, spaces) => `${spaces}  ${item.key}: ${stringify(item.value, deep)}`,
  added: (item, deep, spaces) => `${spaces}+ ${item.key}: ${stringify(item.value, deep)}`,
  deleted: (item, deep, spaces) => `${spaces}- ${item.key}: ${stringify(item.value, deep)}`,
  changed: (item, deep, spaces) => [`${spaces}- ${item.key}: ${stringify(item.oldValue, deep)}`,
    `${spaces}+ ${item.key}: ${stringify(item.newValue, deep)}`],
};
const render = (ast) => {
  const iter = (node, deep) => node.map((item) => {
    const spaces = getSpaces(deep);
    return types[item.type](item, deep, spaces, iter);
  });

  return `{\n${_.flatten(iter(ast, 1)).join('\n')}\n}`;
};

export default render;
