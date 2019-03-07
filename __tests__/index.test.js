import fs from 'fs';
import genDiff from '../src';

const fileExtes = ['json', 'yaml', 'ini'];

const runTest = (ext) => {
  it(`${ext} flat test`, () => {
    const beforePath = `__tests__/__fixtures__/before-flat.${ext}`;
    const afterPath = `__tests__/__fixtures__/after-flat.${ext}`;
    const expected = fs.readFileSync('__tests__/__fixtures__/expected-flat.txt', 'utf-8');
    const actual = genDiff(beforePath, afterPath);
    expect(actual).toBe(expected);
  });
  it(`${ext} nested test`, () => {
    const beforePath = `__tests__/__fixtures__/before-nested.${ext}`;
    const afterPath = `__tests__/__fixtures__/after-nested.${ext}`;
    const expected = fs.readFileSync('__tests__/__fixtures__/expected-nested.txt', 'utf-8');
    const actual = genDiff(beforePath, afterPath);
    expect(actual).toBe(expected);
  });
};

describe('genDiff', () => fileExtes.forEach(ext => runTest(ext)));
