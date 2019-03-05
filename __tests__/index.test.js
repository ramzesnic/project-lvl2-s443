import fs from 'fs';
import genDiff from '../src';

describe('genDiff', () => {
  it('JSON flat test', () => {
    const before = '__tests__/__fixtures__/before.json';
    const after = '__tests__/__fixtures__/after.json';
    const expected = fs.readFileSync('__tests__/__fixtures__/expected.json.txt', 'utf-8');
    const actual = genDiff(before, after);
    expect(actual).toBe(expected);
  });
});
