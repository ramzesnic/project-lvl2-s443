const stringify = render => (value, spaces) => {
  if (value instanceof Array) {
    return render(value, spaces);
  }
  if (value instanceof Object) {
    return Object.entries(value).reduce((acc, [key, val]) => {
      const newValue = val instanceof Object ? render(val, spaces + 6) : val;
      return `{${acc}\n${' '.repeat(spaces + 6)}${key}: ${newValue}\n${' '.repeat(spaces + 2)}}`;
    }, '');
  }
  return value;
};


const nodeRenders = {
  nested: (node, renderValue, spaces) => `${' '.repeat(spaces + 4)}${node.key}: ${renderValue(node.children, spaces + 4)}`,
  unchanged: (node, renderValue, spaces) => `${' '.repeat(spaces + 4)}${node.key}: ${renderValue(node.value, spaces + 4)}`,
  added: (node, renderValue, spaces) => `${' '.repeat(spaces + 2)}+ ${node.key}: ${renderValue(node.value, spaces + 2)}`,
  deleted: (node, renderValue, spaces) => `${' '.repeat(spaces + 2)}- ${node.key}: ${renderValue(node.value, spaces + 2)}`,
  changed: (node, renderValue, spaces) => `${' '
    .repeat(spaces + 2)}+ ${node.key}: ${renderValue(node.after, spaces + 2)}\n${' '
    .repeat(spaces + 2)}- ${node.key}: ${renderValue(node.before, spaces + 2)}`,
};

const render = (ast, spaces = 0) => [
  '{', ...ast.map(node => nodeRenders[node.type](node, stringify(render), spaces)), `${' '.repeat(spaces)}}`,
].join('\n');

export default render;
