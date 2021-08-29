import getDifferences from './getDifferences';

describe('getDifferences', () => {
  test('should return correct array of mismatching fields', () => {
    expect(getDifferences({ a: 1, b: 2, c: 3 }, { a: 1, b: 'oops', c: 3 })).toEqual(['b']);
  });
});
