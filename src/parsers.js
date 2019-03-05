import yaml from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
};
export default (ext, data) => parsers[ext](data);
