type Value = [number, number] | number

interface Options {
  value: Value
  range: boolean
  stepSize: number
  max: number
  min: number
}

interface IModel {
  value: Value
  range: boolean
  stepSize: number
  max: number
  min: number

  changeValue(newValue: Value): Value
  addStepsToValue(numOfSteps: number, valueNumber: 0 | 1): Value
  checkAndFixValue(): Value
}

export default class Model implements IModel {
  value: Value
  range: boolean
  stepSize: number
  max: number
  min: number

  constructor(options: Options) {
    this.max = options.max;
    this.min = options.min;

    this.value = options.value;

    // Если макс. значение > мин., то поменять местами.
    if (this.max < this.min) {
      [this.max, this.min] = [this.min, this.max];
    }

    // Если значение - одно число и это диапазон, то значение становится
    // массивом с двумя одинаковыми значениями.
    // Если значение - массив и это не диапазон, то значением становится
    // первый элемент массива.
    this.range = options.range;
    if (this.range) {
      if (typeof this.value === 'number') {
        this.value = [this.value, this.value];
      }
    } else if (Array.isArray(this.value)) {
      [this.value] = this.value;
    }

    // Если это диапазон и первое значение больше второго, поменять их местами.
    // Если значения больше максимального, то
    // приравнять с максимальным, и наоборот для минимального.
    this.checkAndFixValue();

    // Если размер шага <= 0, то он равен 1.
    // Если размер шага > наибольшего диапазона значений, то он равняется
    // разнице максимального значения и минимального.
    this.stepSize = options.stepSize;
    if (this.stepSize <= 0) {
      this.stepSize = 1;
    }
    if (this.stepSize > this.max - this.min) {
      this.stepSize = this.max - this.min;
    }
  }

  // Изменяет текущее значение.
  // Если значение - число, а новое - массив, то берется первое число массива.
  // Если значение - массив, а новое - число, то значение = массиву с двумя
  // одинаковыми значениями.
  changeValue(newValue: Value): Value {
    if (typeof this.value === 'number') {
      if (typeof newValue === 'number') {
        this.value = newValue;
      } else {
        [this.value] = newValue;
      }
    } else if (typeof newValue !== 'number') {
      this.value = newValue;
    } else {
      this.value = [newValue, newValue];
    }

    this.checkAndFixValue();

    return this.value;
  }

  // Добавляет указанное количество шагов к нужному значению(если не
  // диапазон или нужно большее значение, то указывать не обязательно)
  addStepsToValue(numOfSteps: number, valueNumber: 0 | 1 = 1): Value {
    if (typeof this.value === 'number') {
      this.value += numOfSteps * this.stepSize;
    } else {
      this.value[valueNumber] += numOfSteps * this.stepSize;
    }

    this.checkAndFixValue();

    return this.value;
  }

  // Если это диапазон и первое значение больше второго, поменять их местами.
  // Если значения больше максимального, то
  // приравнять с максимальным, и наоборот для минимального.
  checkAndFixValue(): Value {
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
}
