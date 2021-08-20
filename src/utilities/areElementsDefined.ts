function areElementsDefined<T extends unknown[]>(
  array: Partial<T> | [],
): array is T {
  if (array.length === 0) {
    return false;
  }

  let areAllDefined = true;

  array.forEach((element: unknown) => {
    const isUndefined = element === undefined || element === null;
    if (isUndefined) {
      areAllDefined = false;
    }
  });

  return areAllDefined;
}

export default areElementsDefined;
