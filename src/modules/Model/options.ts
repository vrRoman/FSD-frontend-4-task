import { Value } from './interfacesAndTypes';

type ModelOptions = {
  value: Value
  range: boolean
  stepSize: number
  max: number
  min: number
}

type ModelOptionsOptionalParams = {
  value?: Value
  range?: boolean
  stepSize?: number
  max?: number
  min?: number
}


export { ModelOptions, ModelOptionsOptionalParams };
