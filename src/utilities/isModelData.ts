import { ModelDataPartial, IModelData } from 'Model';

function isModelData(
  modelData: ModelDataPartial | undefined | null,
): modelData is IModelData {
  let valueDefined = true;

  if (modelData) {
    if (modelData.value === undefined) {
      valueDefined = false;
    } else if (modelData.isRange === undefined) {
      valueDefined = false;
    } else if (modelData.stepSize === undefined) {
      valueDefined = false;
    } else if (modelData.min === undefined) {
      valueDefined = false;
    } else if (modelData.max === undefined) {
      valueDefined = false;
    }
  } else {
    valueDefined = false;
  }

  return valueDefined;
}

export default isModelData;
