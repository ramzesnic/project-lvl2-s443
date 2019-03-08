import diff from './diff';
import plain from './plain';

const formats = {
  diff,
  plain,
};
export default (ast, format) => formats[format](ast);
