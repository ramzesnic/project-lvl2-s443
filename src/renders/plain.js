import _ from 'lodash';

const stringify = value => (value instanceof Object ? '[complex value]' : value);
const types = {
  nested: (node, nodePath, iter) => iter(node.children, [...nodePath, node.key]),
  unchanged: () => null,
  added: (node, nodePath) => `Property '${[...nodePath, node.key].join('.')}' was added with value '${stringify(node.value)}'`,
  deleted: (node, nodePath) => `Property '${[...nodePath, node.key].join('.')}' was removed`,
  changed: (node, nodePath) => `Property '${[...nodePath, node.key].join('.')}' was updates. From '${stringify(node.oldValue)}' to '${stringify(node.newValue)}'`,
};

const render = (ast) => {
  const iter = (node, nodePath) => node.map(item => types[item.type](item, nodePath, iter));
  return _.flattenDeep(iter(ast, [])).filter(item => item != null).join('\n');
};

export default render;
