import { ISubject } from './observerAndSubjectInterfaces';
import { ModelOptionsOptionalParams } from './options';

export type Value = [number, number] | number


export interface IModel extends ISubject {
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

export type ModelProps = {
  value?: Value
  range?: boolean
  stepSize?: number
  min?: number
  max?: number
}
