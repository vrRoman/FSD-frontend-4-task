import { ModelDataPartial, IModelData } from '../modules/Model/interfacesAndTypes';

function isModelPropertiesValuesDefined(
  modelProperties: ModelDataPartial | undefined | null,
): modelProperties is IModelData {
  let valueDefined = true;

  if (modelProperties) {
    if (modelProperties.value === undefined) {
      valueDefined = false;
    } else if (modelProperties.isRange === undefined) {
      valueDefined = false;
    } else if (modelProperties.stepSize === undefined) {
      valueDefined = false;
    } else if (modelProperties.min === undefined) {
      valueDefined = false;
    } else if (modelProperties.max === undefined) {
      valueDefined = false;
    }
  } else {
    valueDefined = false;
  }

  return valueDefined;
}

export default isModelPropertiesValuesDefined;
