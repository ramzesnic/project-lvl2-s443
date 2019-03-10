import _ from 'lodash';

const getSpaces = deep => ' '.repeat(deep * 2);
const stringify = (value, deep) => {
  if (!(value instanceof Object)) {
    return value;
  }
  const spaces = getSpaces(deep + 2);
  const closeBlockSpaces = getSpaces(deep);
  return `{\n${Object.keys(value).map(key => `${spaces}${key}: ${stringify(value[key], deep)}`)}\n${closeBlockSpaces}}`;
};
const renderers = {
  nested: (node, deep, spaces, render) => `${spaces}${node.key}: ${render(node.children, deep + 1)}`,
  unchanged: (node, deep, spaces) => `${spaces}  ${node.key}: ${stringify(node.value, deep)}`,
  added: (node, deep, spaces) => `${spaces}+ ${node.key}: ${stringify(node.value, deep)}`,
  deleted: (node, deep, spaces) => `${spaces}- ${node.key}: ${stringify(node.value, deep)}`,
  changed: (node, deep, spaces) => [`${spaces}- ${node.key}: ${stringify(node.oldValue, deep)}`,
    `${spaces}+ ${node.key}: ${stringify(node.newValue, deep)}`],
};
const render = (ast, startDeep = 1) => {
  const iter = (node, deep) => node.map((item) => {
    const spaces = getSpaces(deep);
    return renderers[item.type](item, deep, spaces, render);
  });
  const result = iter(ast, startDeep);
  return `{\n${_.flattenDeep(result).join('\n')}\n${getSpaces(startDeep - 1)}}`;
};

export default render;
