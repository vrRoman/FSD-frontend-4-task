import { Value } from './interfacesAndTypes';

type ModelOptions = {
  value: Value
  isRange: boolean
  stepSize: number
  max: number
  min: number
}

type ModelOptionsPartial = Partial<ModelOptions>;

export { ModelOptions, ModelOptionsPartial };
