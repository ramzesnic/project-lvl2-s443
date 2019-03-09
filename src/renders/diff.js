import _ from 'lodash';

const getSpaces = deep => ' '.repeat(deep * 2);
const stringify = (value, deep) => {
  if (value instanceof Object) {
    const spaces = getSpaces(deep + 2);
    const closeBlockSpaces = getSpaces(deep);
    return `{\n${Object.keys(value).map(key => `${spaces}${key}: ${stringify(value[key], deep)}`)}\n${closeBlockSpaces}}`;
  }
  return value;
};
const types = {
  nested: (node, deep, spaces, iter) => [`${spaces}${node.key}: {`, iter(node.children, deep + 1), `${spaces}}`],
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
  const result = iter(ast, 1);
  return `{\n${_.flattenDeep(result).join('\n')}\n}`;
};

export default render;
