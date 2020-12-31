import { ISubject } from '../../ObserverAndSubject/interfacesAndTypes';
import { ModelOptionsOptionalParams } from './options';

type Value = [number, number] | number

type ModelProps = {
  value?: Value
  range?: boolean
  stepSize?: number
  min?: number
  max?: number
}

interface IModelData {
  value: Value
  range: boolean
  stepSize: number
  min: number
  max: number
}

interface IModel extends ISubject {
  changeOptions(newOptions: ModelOptionsOptionalParams): void
  setValue(newValue: Value, round?: boolean): Value
  setMin(newMin: number): number
  setMax(newMax: number): number
  setRange(newRange: boolean): boolean
  setStepSize(newStepSize: number): number
  addStepsToValue(numOfSteps: number, valueNumber?: 0 | 1, round?: boolean): Value
  roundValue(value: Value): Value
  checkAndFixValue(): Value
  checkAndFixStepSize(): number
  checkAndFixMinMax(): number[]
  getValue(): Value
  getRange(): boolean
  getStepSize(): number
  getMin(): number
  getMax(): number
  getMaxDiapason(): number
}


export default IModel;
export { ModelProps, Value, IModelData };
