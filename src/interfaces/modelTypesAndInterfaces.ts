export type Value = [number, number] | number


export interface ObserverAction {
  type: 'UPDATE_VALUE' | 'UPDATE_RANGE' | 'UPDATE_MIN-MAX' | 'UPDATE_STEPSIZE'
  updatedProps?: {
    value?: Value
    range?: boolean
    stepSize?: number
    min?: number
    max?: number
  }
}


export interface IModel {
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

  subscribe(observer: Object): void
  unsubscribe(observer: Object): void
  notify(action: ObserverAction): void
}

export interface ModelProps {
  value?: Value
  range?: boolean
  stepSize?: number
  min?: number
  max?: number
}
