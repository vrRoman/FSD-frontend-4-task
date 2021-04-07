import { ModelProps, IModelData } from '../modules/Model/interfacesAndTypes';

function isModelPropsValuesDefined(
  modelProps: ModelProps | undefined,
): modelProps is IModelData {
  let valueDefined = true;

  if (modelProps) {
    if (modelProps.value === undefined) {
      valueDefined = false;
    } else if (modelProps.isRange === undefined) {
      valueDefined = false;
    } else if (modelProps.stepSize === undefined) {
      valueDefined = false;
    } else if (modelProps.min === undefined) {
      valueDefined = false;
    } else if (modelProps.max === undefined) {
      valueDefined = false;
    }
  } else {
    valueDefined = false;
  }

  return valueDefined;
}

export default isModelPropsValuesDefined;
