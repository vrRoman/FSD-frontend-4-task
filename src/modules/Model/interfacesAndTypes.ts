import { ISubject } from '../../ObserverAndSubject/interfacesAndTypes';
import { ModelOptionsOptionalParams } from './options';

type Value = [number, number] | number

interface IModelData {
  value: Value
  isRange: boolean
  stepSize: number
  min: number
  max: number
}

type ModelProps = Partial<IModelData>

interface IModel extends ISubject {
  changeOptions(newOptions: ModelOptionsOptionalParams): void
  setValue(newValue: Value, shouldRound?: boolean): Value
  setMin(newMin: number): number
  setMax(newMax: number): number
  setIsRange(newRange: boolean): boolean
  setStepSize(newStepSize: number): number
  addStepsToValue(numOfSteps: number, valueNumber?: 0 | 1, shouldRound?: boolean): Value
  roundValue(value: Value): Value
  checkAndFixValue(): Value
  checkAndFixStepSize(): number
  checkAndFixMinMax(): number[]
  getValue(): Value
  getIsRange(): boolean
  getStepSize(): number
  getMin(): number
  getMax(): number
  getMaxDiapason(): number
}

export default IModel;
export { ModelProps, Value, IModelData };
