import fs from 'fs';
import genDiff from '../src';

const fileExtes = ['json', 'yaml'];

const runTest = (ext) => {
  it(`${ext} flat test`, () => {
    const before = `__tests__/__fixtures__/before-flat.${ext}`;
    const after = `__tests__/__fixtures__/after-flat.${ext}`;
    const expected = fs.readFileSync('__tests__/__fixtures__/expected-flat.txt', 'utf-8');
    const actual = genDiff(before, after);
    expect(actual).toBe(expected);
  });
};

describe('genDiff', () => {
  fileExtes.forEach(ext => runTest(ext));
});
