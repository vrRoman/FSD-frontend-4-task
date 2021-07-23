import { ISubject } from 'ObserverAndSubject';

type Value = [number, number] | number

type ModelOptions = {
  value: Value
  isRange: boolean
  stepSize: number
  max: number
  min: number
}

type ModelOptionsPartial = Partial<ModelOptions>;

interface IModelData {
  value: Value
  isRange: boolean
  stepSize: number
  min: number
  max: number
}

type ModelDataPartial = Partial<IModelData>

interface IModel extends ISubject {
  changeOptions(newOptions: ModelOptionsPartial): void
  setValue(newValue: Value, shouldRound?: boolean): Value
  setMinAndMax(newMin: number, newMax: number): [number, number]
  setMin(newMin: number): number
  setMax(newMax: number): number
  setIsRange(newRange: boolean): boolean
  setStepSize(newStepSize: number): number
  addStepsToValue(numberOfSteps: number, valueNumber?: 0 | 1, shouldRound?: boolean): Value
  getValue(): Value
  getIsRange(): boolean
  getStepSize(): number
  getMin(): number
  getMax(): number
  getMaxDiapason(): number
}

export type {
  IModel,
  ModelDataPartial,
  Value,
  IModelData,
  ModelOptions,
  ModelOptionsPartial,
};
