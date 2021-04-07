function areNumbersDefined(arr: Array<number | undefined>): arr is Array<number> {
  let isAllDefined = true;

  arr.forEach((num) => {
    if (num === undefined) {
      isAllDefined = false;
    }
  });

  return isAllDefined;
}

export default areNumbersDefined;
