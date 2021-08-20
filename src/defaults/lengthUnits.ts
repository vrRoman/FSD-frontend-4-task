const staticLengthUnits = ['px', 'mm', 'cm', 'pt', 'pc'] as const;
const dynamicLengthUnits = ['em', 'rem', '%', 'vw', 'vh', 'vmin', 'vmax'] as const;
const lengthUnits = [...staticLengthUnits, ...dynamicLengthUnits];

export {
  staticLengthUnits,
  dynamicLengthUnits,
  lengthUnits,
};
