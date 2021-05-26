function areElementsDefined<T extends any[]>(
  array: Partial<T> | [],
): array is T {
  if (array.length === 0) {
    return false;
  }

  let areAllDefined = true;

  array.forEach((element: T | undefined | null) => {
    const isUndefined = element === undefined || element === null;
    if (isUndefined) {
      areAllDefined = false;
    }
  });

  return areAllDefined;
}

export default areElementsDefined;
