import { ISubject } from 'ObserverAndSubject';

type Value = [number, number] | number;

interface IModelData {
  value: Value;
  isRange: boolean;
  stepSize: number;
  min: number;
  max: number;
}

type ModelDataPartial = Partial<IModelData>;

type ModelOptions = IModelData;

interface IModel extends ISubject {
  changeData(newOptions: ModelDataPartial): void;
  addStepsToValue(numberOfSteps: number, valueNumber?: 0 | 1, shouldRound?: boolean): Value;
  getData<Key extends keyof IModelData>(option: Key): IModelData[Key];
}

export type {
  IModel,
  ModelDataPartial,
  Value,
  IModelData,
  ModelOptions,
};
