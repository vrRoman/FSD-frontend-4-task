export type Value = [number, number] | number


export interface ObserverAction {
  type: 'UPDATE_VALUE' | 'UPDATE_RANGE'
}


export interface IModel {
  setValue(newValue: Value): Value
  setRange(newRange: boolean): boolean
  setStepSize(newStepSize: number): number
  addStepsToValue(numOfSteps: number, valueNumber?: 0 | 1): Value
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
