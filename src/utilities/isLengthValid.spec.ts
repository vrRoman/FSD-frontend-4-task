import isLengthValid from './isLengthValid';

describe('isLengthValid', () => {
  test('should return true if length valid', () => {
    expect(isLengthValid('100px')).toBe(true);
  });
  test('should return false if length invalid', () => {
    expect(isLengthValid('')).toBe(false);
    expect(isLengthValid('100')).toBe(false);
    expect(isLengthValid('100hey')).toBe(false);
  });
});
