import areElementsDefined from './areElementsDefined';

describe('areElementsDefined', () => {
  test('without undefined or null', () => {
    expect(areElementsDefined([1, 2, 3, 4, 'something'])).toBe(true);
  });

  test('has undefined', () => {
    expect(areElementsDefined([1, undefined, 3, 4, 'something'])).toBe(false);
  });

  test('has null', () => {
    expect(areElementsDefined([1, null, 3, 4, 'something'])).toBe(false);
  });

  test('has undefined and null', () => {
    expect(areElementsDefined([1, undefined, 3, null, 'something'])).toBe(false);
  });

  test('empty array', () => {
    expect(areElementsDefined([])).toBe(false);
  });
});
