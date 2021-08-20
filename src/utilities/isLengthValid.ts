import { lengthUnits } from 'constants/lengthUnits';

const isLengthValid = (length: string) => {
  const lengthWithoutMeasureUnit = String(parseFloat(length));
  const measureUnit = length.replace(lengthWithoutMeasureUnit, '');
  return Boolean(lengthUnits.find((unit) => unit === measureUnit));
};

export default isLengthValid;
