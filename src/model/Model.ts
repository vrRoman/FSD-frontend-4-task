type Value = [number, number] | number

export interface ModelOptions {
  value: Value
  range: boolean
  stepSize: number
  max: number
  min: number
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
}

export default class Model implements IModel {
  private value: Value
  private range: boolean
  private stepSize: number
  private max: number
  private min: number

  constructor(options: ModelOptions) {
    this.max = options.max;
    this.min = options.min;

    this.value = options.value;

    this.checkAndFixMinMax();

    this.range = options.range;

    this.checkAndFixValue();

    this.stepSize = options.stepSize;
    this.checkAndFixStepSize();
  }

  // Изменяет текущее значение и вызывает checkAndFixValue
  setValue(newValue: Value): Value {
    this.value = newValue;

    this.checkAndFixValue();

    return this.value;
  }
  // Меняет range и вызывает checkAndFixValue
  setRange(newRange: boolean): boolean {
    this.range = newRange;
    this.checkAndFixValue();
    return this.range;
  }
  // Меняет stepSize и вызывает checkAndFixStepSize
  setStepSize(newStepSize: number): number {
    this.stepSize = newStepSize;
    this.checkAndFixStepSize();

    return this.stepSize;
  }

  // Добавляет указанное количество шагов к нужному значению(если не
  // диапазон или нужно большее значение, то указывать не обязательно)
  addStepsToValue(numOfSteps: number, valueNumber: 0 | 1 = 1): Value {
    if (typeof this.value === 'number') {
      this.value += numOfSteps * this.stepSize;
    } else {
      this.value[valueNumber] += numOfSteps * this.stepSize;
      if (valueNumber === 1) {
        if (this.value[valueNumber] < this.value[0]) {
          [this.value[valueNumber]] = this.value;
        }
      } else {
        if (this.value[valueNumber] > this.value[1]) {
          [, this.value[valueNumber]] = this.value;
        }
      }
    }

    this.checkAndFixValue();
    return this.value;
  }

  // Если значение - одно число и это диапазон, то значение становится
  // массивом с двумя одинаковыми значениями.
  // Если значение - массив и это не диапазон, то значением становится
  // первый элемент массива.
  // Если это диапазон и первое значение больше второго, поменять их местами.
  // Если значения больше максимального, то
  // приравнять с максимальным, и наоборот для минимального.
  checkAndFixValue(): Value {
    if (this.range) {
      if (typeof this.value === 'number') {
        this.value = [this.value, this.value];
      }
    } else if (Array.isArray(this.value)) {
      [this.value] = this.value;
    }

    if (typeof this.value !== 'number') {
      if (this.value[0] > this.value[1]) {
        this.value = [this.value[1], this.value[0]];
      }
    }

    if (typeof this.value === 'number') {
      if (this.value > this.max) {
        this.value = this.max;
      } else if (this.value < this.min) {
        this.value = this.min;
      }
    } else {
      if (this.value[1] > this.max) {
        this.value[1] = this.max;
      } else if (this.value[1] < this.min) {
        this.value[1] = this.min;
      }
      if (this.value[0] < this.min) {
        this.value[0] = this.min;
      } else if (this.value[0] > this.max) {
        this.value[0] = this.max;
      }
    }

    return this.value;
  }

  // Если размер шага <= 0, то он равен 1.
  // Если размер шага > наибольшего диапазона значений, то он равняется
  // разнице максимального значения и минимального.
  checkAndFixStepSize(): number {
    if (this.stepSize < 0) {
      this.stepSize = 1;
    }
    if (this.stepSize > this.max - this.min) {
      this.stepSize = this.max - this.min;
    }

    return this.stepSize;
  }

  // Если макс. значение > мин., то поменять местами.
  checkAndFixMinMax(): number[] {
    if (this.max < this.min) {
      [this.max, this.min] = [this.min, this.max];
    }

    return [this.min, this.max];
  }


  getValue(): Value {
    if (typeof this.value === 'number') {
      return this.value;
    }
    return [...this.value];
  }
  getRange(): boolean {
    return this.range;
  }
  getMin(): number {
    return this.min;
  }
  getMax(): number {
    return this.max;
  }
  // Возвращает max - min
  getMaxDiapason(): number {
    return this.max - this.min;
  }
  getStepSize(): number {
    return this.stepSize;
  }
}
