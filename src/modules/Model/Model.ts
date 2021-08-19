import { Subject } from 'ObserverAndSubject';

import type {
  IModel,
  IModelData,
  Value,
  ModelOptions,
  ModelOptionsPartial,
} from './Model.model';

class Model extends Subject implements IModel {
  private data: IModelData

  constructor(options: ModelOptions) {
    super();

    this.data = {
      min: options.min,
      max: options.max,
      value: options.value,
      isRange: options.isRange,
      stepSize: options.stepSize,
    };

    this.checkAndFixMinMax();

    this.checkAndFixValue();

    this.checkAndFixStepSize();
  }

  // Меняет настройки
  changeOptions(newOptions: ModelOptionsPartial) {
    const {
      min = this.data.min,
      max = this.data.max,
      value = this.data.value,
      isRange = this.data.isRange,
      stepSize = this.data.stepSize,
    } = newOptions;

    this.data.min = min;
    this.data.max = max;
    this.data.isRange = isRange;
    this.data.value = value;
    this.data.stepSize = stepSize;

    this.checkAndFixMinMax();
    this.checkAndFixValue();
    this.checkAndFixStepSize();

    this.notify({
      type: 'CHANGE_OPTIONS',
      payload: this.data,
    });
  }

  // Добавляет указанное количество шагов к нужному значению(если не
  // диапазон или нужно большее значение, то указывать не обязательно)
  addStepsToValue(numberOfSteps: number, valueNumber: 0 | 1 = 1): Value {
    let newValue: Value;
    if (typeof this.data.value === 'number') {
      newValue = this.data.value + numberOfSteps * this.data.stepSize;
    } else {
      newValue = [...this.data.value];
      newValue[valueNumber] += numberOfSteps * this.data.stepSize;

      if (newValue[0] > newValue[1]) {
        const oppositeIndex = Number(!valueNumber);
        newValue = [newValue[oppositeIndex], newValue[oppositeIndex]];
      }
    }

    this.changeOptions({ value: newValue });
    return this.data.value;
  }

  getOption<Key extends keyof IModelData>(option: Key): IModelData[Key] {
    return this.data[option];
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
