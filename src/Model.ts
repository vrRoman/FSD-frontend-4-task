import {
  ModelOptions,
  ModelOptionsOptionalParams,
  SliderOptions,
} from './interfacesAndTypes/options';
import { IModel, Value } from './interfacesAndTypes/modelTypesAndInterfaces';
import ObserverAndSubject from './ObserverAndSubject/Subject';


class Model extends ObserverAndSubject implements IModel {
  private value: Value
  private range: boolean
  private stepSize: number
  private max: number
  private min: number

  constructor(options: ModelOptions | SliderOptions) {
    super();

    this.max = options.max;
    this.min = options.min;

    this.value = options.value;

    this.checkAndFixMinMax();

    this.range = options.range;

    this.checkAndFixValue();

    this.stepSize = options.stepSize;
    this.checkAndFixStepSize();
  }

  // Меняет настройки
  changeOptions(newOptions: ModelOptionsOptionalParams) {
    if (newOptions.value !== undefined) {
      this.setValue(newOptions.value);
    }
    if (newOptions.range !== undefined) {
      this.setRange(newOptions.range);
    }
    if (newOptions.stepSize !== undefined) {
      this.setStepSize(newOptions.stepSize);
    }
    if (newOptions.min !== undefined) {
      this.setMin(newOptions.min);
    }
    if (newOptions.max !== undefined) {
      this.setMax(newOptions.max);
    }
  }

  // Округляет и возвращает входящее значение
  roundValue(value: Value): Value {
    const symbolsAfterCommaStepSize = this.getStepSize().toString().includes('.')
        ? this.getStepSize().toString().split('.').pop()
        : false;
    const numOfSymbolsAfterCommaStepSize = symbolsAfterCommaStepSize
        ? symbolsAfterCommaStepSize.length
        : 0;
    if (Array.isArray(value)) {
      return [
        +value[0].toFixed(numOfSymbolsAfterCommaStepSize),
        +value[1].toFixed(numOfSymbolsAfterCommaStepSize),
      ];
    }
    return +value.toFixed(numOfSymbolsAfterCommaStepSize);
  }

  // Меняет min
  // Если макс = мин, то ничего не делать.
  setMin(newMin: number): number {
    if (this.max === newMin) {
      return this.getMin();
    }
    this.min = newMin;
    this.checkAndFixMinMax();
    this.checkAndFixValue();
    this.checkAndFixStepSize();
    this.notify({
      type: 'UPDATE_MIN-MAX',
      updatedProps: {
        min: this.getMin(),
        max: this.getMax(),
        value: this.getValue(),
        stepSize: this.getStepSize(),
      },
    });
    return this.getMin();
  }
  // Меняет max
  // Если макс = мин, то ничего не делать.
  setMax(newMax: number): number {
    if (this.min === newMax) {
      return this.getMax();
    }
    this.max = newMax;
    this.checkAndFixMinMax();
    this.checkAndFixValue();
    this.checkAndFixStepSize();
    this.notify({
      type: 'UPDATE_MIN-MAX',
      updatedProps: {
        min: this.getMin(),
        max: this.getMax(),
        value: this.getValue(),
        stepSize: this.getStepSize(),
      },
    });
    return this.getMax();
  }

  // Изменяет текущее значение и вызывает checkAndFixValue
  setValue(newValue: Value, round: boolean = false): Value {
    this.value = round ? this.roundValue(newValue) : newValue;

    this.checkAndFixValue();

    this.notify({
      type: 'UPDATE_VALUE',
      updatedProps: {
        value: this.getValue(),
      },
    });

    return this.value;
  }
  // Меняет range и вызывает checkAndFixValue
  setRange(newRange: boolean): boolean {
    this.range = newRange;
    this.checkAndFixValue();

    this.notify({
      type: 'UPDATE_RANGE',
      updatedProps: {
        value: this.getValue(),
        range: this.getRange(),
      },
    });

    return this.range;
  }
  // Меняет stepSize и вызывает checkAndFixStepSize
  setStepSize(newStepSize: number): number {
    this.stepSize = newStepSize;
    this.checkAndFixStepSize();
    this.notify({
      type: 'UPDATE_STEPSIZE',
      updatedProps: {
        stepSize: this.getStepSize(),
      },
    });

    return this.stepSize;
  }

  // Добавляет указанное количество шагов к нужному значению(если не
  // диапазон или нужно большее значение, то указывать не обязательно)
  addStepsToValue(numOfSteps: number, valueNumber: 0 | 1 = 1, round: boolean = false): Value {
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

    if (round) {
      this.value = this.roundValue(this.value);
    }

    this.checkAndFixValue();

    this.notify({
      type: 'UPDATE_VALUE',
      updatedProps: {
        value: this.getValue(),
      },
    });

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

  // Если размер шага < 1, то он равен 1.
  // Если размер шага > наибольшего диапазона значений, то он равняется
  // разнице максимального значения и минимального.
  checkAndFixStepSize(): number {
    if (this.stepSize < 1) {
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

export default Model;
