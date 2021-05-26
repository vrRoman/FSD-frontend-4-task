import { SliderOptions } from '../../options/options';
import { ModelOptions, ModelOptionsPartial } from './options';
import IModel, { IModelData, Value } from './interfacesAndTypes';
import Subject from '../../ObserverAndSubject/Subject';
import areElementsDefined from '../../utilities/areElementsDefined';

class Model extends Subject implements IModel {
  private data: IModelData

  constructor(options: ModelOptions | SliderOptions) {
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
    const minAndMax = [newOptions.min, newOptions.max];
    if (areElementsDefined(minAndMax)) {
      this.setMinAndMax(minAndMax[0], minAndMax[1]);
    } else {
      if (newOptions.min !== undefined) {
        this.setMin(newOptions.min);
      }
      if (newOptions.max !== undefined) {
        this.setMax(newOptions.max);
      }
    }
    if (newOptions.isRange !== undefined) {
      this.setIsRange(newOptions.isRange);
    }
    if (newOptions.value !== undefined) {
      this.setValue(newOptions.value);
    }
    if (newOptions.stepSize !== undefined) {
      this.setStepSize(newOptions.stepSize);
    }
  }

  // Меняет и проверяет min и max, проверяет значение, размер шага
  setMinAndMax(newMin: number, newMax: number): [number, number] {
    this.data.min = newMin;
    this.data.max = newMax;
    this.checkAndFixMinMax();
    this.checkAndFixValue();
    this.checkAndFixStepSize();
    this.notify({
      type: 'UPDATE_MIN-MAX',
      updatedProperties: {
        min: this.getMin(),
        max: this.getMax(),
        value: this.getValue(),
        stepSize: this.getStepSize(),
      },
    });
    return [this.data.min, this.data.max];
  }

  // Вызывает this.setMinAndMax и возвращает новый min
  setMin(newMin: number): number {
    this.setMinAndMax(newMin, this.getMax());
    return this.getMin();
  }

  // Вызывает this.setMinAndMax и возвращает новый max
  setMax(newMax: number): number {
    this.setMinAndMax(this.getMin(), newMax);
    return this.getMax();
  }

  // Изменяет текущее значение и вызывает checkAndFixValue
  setValue(newValue: Value, shouldRound: boolean = false): Value {
    this.data.value = shouldRound ? this.roundValue(newValue) : newValue;

    this.checkAndFixValue();

    this.notify({
      type: 'UPDATE_VALUE',
      updatedProperties: {
        value: this.getValue(),
      },
    });

    return this.data.value;
  }

  // Меняет isRange и вызывает checkAndFixValue
  setIsRange(newIsRange: boolean): boolean {
    this.data.isRange = newIsRange;
    this.checkAndFixValue();

    this.notify({
      type: 'UPDATE_IS-RANGE',
      updatedProperties: {
        value: this.getValue(),
        isRange: this.getIsRange(),
      },
    });

    return this.data.isRange;
  }

  // Меняет stepSize и вызывает checkAndFixStepSize
  setStepSize(newStepSize: number): number {
    this.data.stepSize = newStepSize;
    this.checkAndFixStepSize();
    this.notify({
      type: 'UPDATE_STEP-SIZE',
      updatedProperties: {
        stepSize: this.getStepSize(),
      },
    });

    return this.data.stepSize;
  }

  // Добавляет указанное количество шагов к нужному значению(если не
  // диапазон или нужно большее значение, то указывать не обязательно)
  addStepsToValue(
    numberOfSteps: number, valueNumber: 0 | 1 = 1, shouldRound: boolean = false,
  ): Value {
    if (typeof this.data.value === 'number') {
      this.data.value += numberOfSteps * this.data.stepSize;
    } else {
      this.data.value[valueNumber] += numberOfSteps * this.data.stepSize;
      if (valueNumber === 1) {
        if (this.data.value[valueNumber] < this.data.value[0]) {
          [this.data.value[valueNumber]] = this.data.value;
        }
      } else if (this.data.value[valueNumber] > this.data.value[1]) {
        [, this.data.value[valueNumber]] = this.data.value;
      }
    }

    if (shouldRound) {
      this.data.value = this.roundValue(this.data.value);
    }

    this.checkAndFixValue();

    this.notify({
      type: 'UPDATE_VALUE',
      updatedProperties: {
        value: this.getValue(),
      },
    });

    return this.data.value;
  }

  getValue(): Value {
    if (typeof this.data.value === 'number') {
      return this.data.value;
    }
    return [...this.data.value];
  }

  getIsRange(): boolean {
    return this.data.isRange;
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

  // Округляет до количества знаков после запятой как у stepSize и возвращает новое значение
  private roundValue(value: Value): Value {
    const symbolsAfterCommaStepSize = this.getStepSize().toString().includes('.')
      ? this.getStepSize().toString().split('.').pop()
      : null;
    const numberOfSymbolsAfterCommaStepSize = symbolsAfterCommaStepSize
      ? symbolsAfterCommaStepSize.length
      : 0;
    if (Array.isArray(value)) {
      return [
        Number(value[0].toFixed(numberOfSymbolsAfterCommaStepSize)),
        Number(value[1].toFixed(numberOfSymbolsAfterCommaStepSize)),
      ];
    }
    return Number(value.toFixed(numberOfSymbolsAfterCommaStepSize));
  }

  // Если значение - одно число и это диапазон, то значение становится
  // массивом с двумя одинаковыми значениями.
  // Если значение - массив и это не диапазон, то значением становится
  // первый элемент массива.
  // Если это диапазон и первое значение больше второго, поменять их местами.
  // Если значения больше максимального, то
  // приравнять с максимальным, и наоборот для минимального.
  private checkAndFixValue(): Value {
    if (this.data.isRange) {
      if (typeof this.data.value === 'number') {
        this.data.value = [this.data.value, this.data.value];
      }
    } else if (Array.isArray(this.data.value)) {
      [this.data.value] = this.data.value;
    }

    if (typeof this.data.value === 'number') {
      if (this.data.value > this.data.max) {
        this.data.value = this.data.max;
      } else if (this.data.value < this.data.min) {
        this.data.value = this.data.min;
      }
    } else {
      if (this.data.value[0] > this.data.value[1]) {
        this.data.value = [this.data.value[1], this.data.value[0]];
      }

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
