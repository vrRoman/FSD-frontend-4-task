const deepCopy = <T>(source: T): T => {
  const shouldReturnInitialSource = !source
    || typeof source !== 'object'
    || source instanceof Node;
  if (shouldReturnInitialSource) return source;

  const newObject: T = Object.assign(Array.isArray(source) ? [] : {}, source);

  (Object.keys(newObject) as Array<keyof typeof newObject>).forEach((key) => {
    if (typeof newObject[key] === 'object') {
      newObject[key] = deepCopy(newObject[key]);
    }
  });

  return newObject;
};

export default deepCopy;
