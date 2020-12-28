import { ISubject } from './observerAndSubjectInterfaces';

export type Value = [number, number] | number


export interface IModel extends ISubject {
  setValue(newValue: Value, round?: boolean): Value
  setMin(newMin: number): number
  setMax(newMax: number): number
  setRange(newRange: boolean): boolean
  setStepSize(newStepSize: number): number
  addStepsToValue(numOfSteps: number, valueNumber?: 0 | 1): Value
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

export interface ModelProps {
  value?: Value
  range?: boolean
  stepSize?: number
  min?: number
  max?: number
}
