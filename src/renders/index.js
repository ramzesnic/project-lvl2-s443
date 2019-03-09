import diff from './diff';
import plain from './plain';

const renders = {
  diff,
  plain,
  json: ast => JSON.stringify(ast, null, 2),
};
export default (ast, format) => renders[format](ast);
