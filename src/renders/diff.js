import _ from 'lodash';

const getSpaces = deep => ' '.repeat(deep * 2);
const stringify = (value, deep) => {
  const spaces = getSpaces(deep + 2);
  const closeBlockSpaces = getSpaces(deep);
  return value instanceof Object
    ? `{\n${Object.keys(value).map(key => `${spaces}${key}: ${value[key] instanceof Object ? stringify(value[key], deep) : value[key]}`)}\n${closeBlockSpaces}}`
    : value;
};
const types = {
  nested: (node, deep, spaces, iter) => `${spaces}${node.key}: {\n${_.flatten(iter(node.children, deep + 1)).join('\n')}\n${spaces}}`,
  unchanged: (node, deep, spaces) => `${spaces}  ${node.key}: ${stringify(node.value, deep)}`,
  added: (node, deep, spaces) => `${spaces}+ ${node.key}: ${stringify(node.value, deep)}`,
  deleted: (node, deep, spaces) => `${spaces}- ${node.key}: ${stringify(node.value, deep)}`,
  changed: (node, deep, spaces) => [`${spaces}- ${node.key}: ${stringify(node.oldValue, deep)}`,
    `${spaces}+ ${node.key}: ${stringify(node.newValue, deep)}`],
};
const render = (ast) => {
  const iter = (node, deep) => node.map((item) => {
    const spaces = getSpaces(deep);
    return types[item.type](item, deep, spaces, iter);
  });

  return `{\n${_.flatten(iter(ast, 1)).join('\n')}\n}`;
};

export default render;
