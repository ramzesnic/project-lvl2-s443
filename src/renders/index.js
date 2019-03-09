import diff from './diff';
import plain from './plain';

const renderers = {
  diff,
  plain,
  json: ast => JSON.stringify(ast, null, 2),
};
export default (ast, format) => renderers[format](ast);
