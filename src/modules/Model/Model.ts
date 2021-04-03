import { SliderOptions } from '../../options/options';
import { ModelOptions, ModelOptionsOptionalParams } from './options';
import IModel, { IModelData, Value } from './interfacesAndTypes';
import ObserverAndSubject from '../../ObserverAndSubject/Subject';


class Model extends ObserverAndSubject implements IModel {
  private data: IModelData

  constructor(options: ModelOptions | SliderOptions) {
    super();

    this.data = {
      min: options.min,
      max: options.max,
      value: options.value,
      range: options.range,
      stepSize: options.stepSize,
    };

    this.checkAndFixMinMax();

    this.checkAndFixValue();

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
        : null;
    const numOfSymbolsAfterCommaStepSize = symbolsAfterCommaStepSize
        ? symbolsAfterCommaStepSize.length
        : 0;
    if (Array.isArray(value)) {
      return [
        Number(value[0].toFixed(numOfSymbolsAfterCommaStepSize)),
        Number(value[1].toFixed(numOfSymbolsAfterCommaStepSize)),
      ];
    }
    return Number(value.toFixed(numOfSymbolsAfterCommaStepSize));
  }

  // Меняет min
  // Если макс = мин, то ничего не делать.
  setMin(newMin: number): number {
    if (this.data.max === newMin) {
      return this.getMin();
    }
    this.data.min = newMin;
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
    if (this.data.min === newMax) {
      return this.getMax();
    }
    this.data.max = newMax;
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
  setValue(newValue: Value, shouldRound: boolean = false): Value {
    this.data.value = shouldRound ? this.roundValue(newValue) : newValue;

    this.checkAndFixValue();

    this.notify({
      type: 'UPDATE_VALUE',
      updatedProps: {
        value: this.getValue(),
      },
    });

    return this.data.value;
  }
  // Меняет range и вызывает checkAndFixValue
  setRange(newRange: boolean): boolean {
    this.data.range = newRange;
    this.checkAndFixValue();

    this.notify({
      type: 'UPDATE_RANGE',
      updatedProps: {
        value: this.getValue(),
        range: this.getRange(),
      },
    });

    return this.data.range;
  }
  // Меняет stepSize и вызывает checkAndFixStepSize
  setStepSize(newStepSize: number): number {
    this.data.stepSize = newStepSize;
    this.checkAndFixStepSize();
    this.notify({
      type: 'UPDATE_STEPSIZE',
      updatedProps: {
        stepSize: this.getStepSize(),
      },
    });

    return this.data.stepSize;
  }

  // Добавляет указанное количество шагов к нужному значению(если не
  // диапазон или нужно большее значение, то указывать не обязательно)
  addStepsToValue(numOfSteps: number, valueNumber: 0 | 1 = 1, shouldRound: boolean = false): Value {
    if (typeof this.data.value === 'number') {
      this.data.value += numOfSteps * this.data.stepSize;
    } else {
      this.data.value[valueNumber] += numOfSteps * this.data.stepSize;
      if (valueNumber === 1) {
        if (this.data.value[valueNumber] < this.data.value[0]) {
          [this.data.value[valueNumber]] = this.data.value;
        }
      } else {
        if (this.data.value[valueNumber] > this.data.value[1]) {
          [, this.data.value[valueNumber]] = this.data.value;
        }
      }
    }

    if (shouldRound) {
      this.data.value = this.roundValue(this.data.value);
    }

    this.checkAndFixValue();

    this.notify({
      type: 'UPDATE_VALUE',
      updatedProps: {
        value: this.getValue(),
      },
    });

    return this.data.value;
  }

  // Если значение - одно число и это диапазон, то значение становится
  // массивом с двумя одинаковыми значениями.
  // Если значение - массив и это не диапазон, то значением становится
  // первый элемент массива.
  // Если это диапазон и первое значение больше второго, поменять их местами.
  // Если значения больше максимального, то
  // приравнять с максимальным, и наоборот для минимального.
  checkAndFixValue(): Value {
    if (this.data.range) {
      if (typeof this.data.value === 'number') {
        this.data.value = [this.data.value, this.data.value];
      }
    } else if (Array.isArray(this.data.value)) {
      [this.data.value] = this.data.value;
    }

    if (typeof this.data.value !== 'number') {
      if (this.data.value[0] > this.data.value[1]) {
        this.data.value = [this.data.value[1], this.data.value[0]];
      }
    }

    if (typeof this.data.value === 'number') {
      if (this.data.value > this.data.max) {
        this.data.value = this.data.max;
      } else if (this.data.value < this.data.min) {
        this.data.value = this.data.min;
      }
    } else {
      if (this.data.value[1] > this.data.max) {
        this.data.value[1] = this.data.max;
      } else if (this.data.value[1] < this.data.min) {
        this.data.value[1] = this.data.min;
      }
      if (this.data.value[0] < this.data.min) {
        this.data.value[0] = this.data.min;
      } else if (this.data.value[0] > this.data.max) {
        this.data.value[0] = this.data.max;
      }
    }

    return this.data.value;
  }

  // Если размер шага < 1, то он равен 1.
  // Если размер шага > наибольшего диапазона значений, то он равняется
  // разнице максимального значения и минимального.
  checkAndFixStepSize(): number {
    if (this.data.stepSize < 1) {
      this.data.stepSize = 1;
    }
    if (this.data.stepSize > this.data.max - this.data.min) {
      this.data.stepSize = this.data.max - this.data.min;
    }

    return this.data.stepSize;
  }

  // Если макс. значение > мин., то поменять местами.
  checkAndFixMinMax(): number[] {
    if (this.data.max < this.data.min) {
      [this.data.max, this.data.min] = [this.data.min, this.data.max];
    }

    return [this.data.min, this.data.max];
  }


  getValue(): Value {
    if (typeof this.data.value === 'number') {
      return this.data.value;
    }
    return [...this.data.value];
  }
  getRange(): boolean {
    return this.data.range;
  }
  getMin(): number {
    return this.data.min;
  }
  getMax(): number {
    return this.data.max;
  }
  // Возвращает max - min
  getMaxDiapason(): number {
    return this.data.max - this.data.min;
  }
  getStepSize(): number {
    return this.data.stepSize;
  }
}

export default Model;
