const getDifferences = <T>(firstObject: T, secondObject: T): Array<keyof T> => {
  const differencesArray: Array<keyof T> = [];

  (Object.keys(secondObject) as Array<keyof typeof secondObject>).forEach((key) => {
    if (secondObject[key] !== firstObject[key]) {
      differencesArray.push(key);
    }
  });

  return differencesArray;
};

export default getDifferences;
