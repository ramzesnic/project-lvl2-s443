const stringify = value => (value instanceof Object ? '[complex value]' : value);
const getMessage = (nodePath, nodeKey, actionPart, value1 = '', endPart = '\'\'', value2 = '') => {
  const startPart = 'Property';
  const message = [startPart, `'${[...nodePath, nodeKey].join('.')}'`, 'was', actionPart, `'${stringify(value1)}'`, endPart, `'${stringify(value2)}'`];
  return message.filter(part => part !== '\'\'').join(' ');
};
const types = {
  nested: (node, nodePath, iter) => `${iter(node.children, [...nodePath, node.key]).filter(item => !!item).join('\n')}`,
  unchanged: () => null,
  added: (node, nodePath) => getMessage(nodePath, node.key, 'added with value', node.value),
  deleted: (node, nodePath) => getMessage(nodePath, node.key, 'removed'),
  changed: (node, nodePath) => getMessage(nodePath, node.key, 'updates. From', node.oldValue, 'to', node.newValue),
};

const render = (ast) => {
  const iter = (node, nodePath) => node.map(item => types[item.type](item, nodePath, iter));
  return iter(ast, []).join('\n');
};

export default render;
