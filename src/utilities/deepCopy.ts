const deepCopy = <T>(source: T): T => {
  if (typeof source !== 'object') return source;

  const newObject: T = Object.assign(Array.isArray(source) ? [] : {}, source);

  (Object.keys(newObject) as Array<keyof typeof newObject>).forEach((key) => {
    if (typeof newObject[key] === 'object') {
      newObject[key] = deepCopy(newObject[key]);
    }
  });

  return newObject;
};

export default deepCopy;
