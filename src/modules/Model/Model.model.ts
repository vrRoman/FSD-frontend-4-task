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
  addStepsToValue(numberOfSteps: number, valueNumber?: 0 | 1, shouldRound?: boolean): Value
  getOption<Key extends keyof IModelData>(option: Key): IModelData[Key]
}

export type {
  IModel,
  ModelDataPartial,
  Value,
  IModelData,
  ModelOptions,
  ModelOptionsPartial,
};
