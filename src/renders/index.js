import diff from './diff';
import plain from './plain';

const formats = {
  diff,
  plain,
  json: JSON.stringify,
};
export default (ast, format) => formats[format](ast, null, 2);
