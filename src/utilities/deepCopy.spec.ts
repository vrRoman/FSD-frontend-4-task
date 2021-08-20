import deepCopy from './deepCopy';

describe('deepCopy', () => {
  test('shallow copy of object', () => {
    const object = { a: 1, b: 1 };
    expect(deepCopy(object)).not.toBe(object);
    expect(deepCopy(object)).toEqual(object);
  });

  test('deep copy of object', () => {
    const object = {
      a1: {
        a2: { a3: 'hey' },
        b2: true,
      },
      b1: 1,
    };
    expect(deepCopy(object).a1.a2).not.toBe(object.a1.a2);
    expect(deepCopy(object).a1.a2).toEqual(object.a1.a2);
  });

  test('shallow copy of array', () => {
    const array: [1, 2, 3, true] = [1, 2, 3, true];
    expect(deepCopy(array)).not.toBe(array);
    expect(deepCopy(array)).toEqual(array);
  });

  test('deep copy of array', () => {
    const array: [1, 2, 3, Array<string>] = [1, 2, 3, ['1', '2', '3']];
    expect(deepCopy(array[3])).not.toBe(array[3]);
    expect(deepCopy(array)[3]).toEqual(array[3]);
  });

  test('array in object', () => {
    const object = {
      array: [1, 2, 3],
    };
    expect(deepCopy(object).array).not.toBe(object.array);
    expect(deepCopy(object).array).toEqual(object.array);
  });

  test('object in array', () => {
    const array: [{ a: { a1: 1 } }, number] = [{ a: { a1: 1 } }, 2];
    expect(deepCopy(array)[0].a).not.toBe(array[0].a);
    expect(deepCopy(array)[0].a).toEqual(array[0].a);
  });

  test('on primitives should return the same', () => {
    expect(deepCopy(2)).toBe(2);
    expect(deepCopy(true)).toBe(true);
  });
});
