import { Subject } from 'ObserverAndSubject';
import deepCopy from 'utilities/deepCopy';

import type {
  IModel,
  IModelData,
  ModelOptions,
  ModelDataPartial,
  Value,
} from './Model.model';

class Model extends Subject implements IModel {
  private data: IModelData

  constructor(options: ModelOptions) {
    super();

    this.data = { ...options };

    this.checkAndFixMinMax();

    this.checkAndFixValue();

    this.checkAndFixStepSize();
  }

  // Меняет настройки
  changeData(newData: ModelDataPartial) {
    const {
      min = this.data.min,
      max = this.data.max,
      value = this.data.value,
      isRange = this.data.isRange,
      stepSize = this.data.stepSize,
    } = newData;

    this.data.min = min;
    this.data.max = max;
    this.data.isRange = isRange;
    this.data.value = value;
    this.data.stepSize = stepSize;

    this.checkAndFixMinMax();
    this.checkAndFixValue();
    this.checkAndFixStepSize();

    this.notify({
      type: 'CHANGE_MODEL_DATA',
      payload: this.data,
    });
  }

  // Добавляет указанное количество шагов к нужному значению(если не
  // диапазон или нужно большее значение, то указывать не обязательно)
  addStepsToValue(numberOfSteps: number, valueNumber: 0 | 1 = 1): Value {
    const { value, stepSize, min } = this.data;

    let newValue: Value;
    if (typeof value === 'number') {
      const currentStep = Math.ceil((value - min) / stepSize);
      newValue = min + ((currentStep + numberOfSteps) * stepSize);
    } else {
      newValue = [...value];
      const currentStep = Math.ceil((value[valueNumber] - min) / stepSize);
      newValue[valueNumber] = min + ((currentStep + numberOfSteps) * stepSize);

      if (newValue[0] > newValue[1]) {
        const oppositeIndex = Number(!valueNumber);
        newValue = [newValue[oppositeIndex], newValue[oppositeIndex]];
      }
    }
    this.changeData({ value: newValue });
    return value;
  }

  getData(): IModelData

  getData<Key extends keyof IModelData>(option: Key): IModelData[Key]

  getData<Key extends keyof IModelData>(option?: Key): IModelData[Key] | IModelData {
    if (option) {
      return deepCopy(this.data[option]);
    }
    return deepCopy(this.data);
  }

  // Если значение - одно число и это диапазон, то значение становится
  // массивом с двумя одинаковыми значениями.
  // Если значение - массив и это не диапазон, то значением становится
  // первый элемент массива.
  private fixValueByRange(): Value {
    const isValueAndRangeMatch = this.data.isRange === Array.isArray(this.data.value);
    if (!isValueAndRangeMatch) {
      this.data.value = Array.isArray(this.data.value)
        ? this.data.value[0]
        : [this.data.value, this.data.value];
    }
    return this.data.value;
  }

  private fixValueByStepSize(): Value {
    const {
      min,
      max,
      stepSize,
      value,
    } = this.data;

    const getValid = (number: number) => {
      if (number === max) return number;
      return (Math.round((number - min) / stepSize) * stepSize) + min;
    };

    this.data.value = Array.isArray(value)
      ? [getValid(value[0]), getValid(value[1])]
      : getValid(value);
    return this.data.value;
  }

  // Если это диапазон и первое значение больше второго, меняет их местами.
  private fixValueOrder(): Value {
    return Array.isArray(this.data.value)
      ? this.data.value.sort((firstNumber, secondNumber) => firstNumber - secondNumber)
      : this.data.value;
  }

  // Если значения больше максимального, то
  // приравнять с максимальным, и наоборот для минимального.
  private fixValueLimits(): Value {
    const getValid = (number: number) => {
      if (number > this.data.max) return this.data.max;
      if (number < this.data.min) return this.data.min;
      return number;
    };

    this.data.value = Array.isArray(this.data.value)
      ? [getValid(this.data.value[0]), getValid(this.data.value[1])]
      : getValid(this.data.value);

    return this.data.value;
  }

  private checkAndFixValue(): Value {
    this.fixValueByStepSize();
    this.fixValueByRange();
    this.fixValueOrder();
    this.fixValueLimits();
    return this.data.value;
  }

  // Если размер шага < 1, то он равен 1.
  // Если размер шага > наибольшего диапазона значений, то он равняется
  // разнице максимального значения и минимального.
  private checkAndFixStepSize(): number {
    if (this.data.stepSize < 1) {
      this.data.stepSize = 1;
    }
    if (this.data.stepSize > this.data.max - this.data.min) {
      this.data.stepSize = this.data.max - this.data.min;
    }

    return this.data.stepSize;
  }

  // Если макс. значение > мин., то поменять местами.
  private checkAndFixMinMax(): number[] {
    if (this.data.max < this.data.min) {
      [this.data.max, this.data.min] = [this.data.min, this.data.max];
    }

    return [this.data.min, this.data.max];
  }
}

export default Model;
