import { Value } from './interfacesAndTypes';

type ModelOptions = {
  value: Value
  isRange: boolean
  stepSize: number
  max: number
  min: number
}

type ModelOptionsOptionalParams = Partial<ModelOptions>;

export { ModelOptions, ModelOptionsOptionalParams };
