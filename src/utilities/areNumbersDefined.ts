function areNumbersDefined(numbersArray: Array<number | undefined>): numbersArray is Array<number> {
  let isAllDefined = true;

  numbersArray.forEach((number) => {
    if (number === undefined) {
      isAllDefined = false;
    }
  });

  return isAllDefined;
}

export default areNumbersDefined;
