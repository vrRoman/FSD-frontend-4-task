import { Subject } from 'ObserverAndSubject';
import deepCopy from 'utilities/deepCopy';
import getDifferences from 'utilities/getDifferences';
import isLengthValid from 'utilities/isLengthValid';

import type {
  IViewModel,
  IViewModelData,
  IViewModelGetMethods,
  ViewModelDataPartial,
} from './ViewModel.model';

class ViewModel extends Subject implements IViewModel, IViewModelGetMethods {
  private data: IViewModelData

  constructor(data: IViewModelData) {
    super();

    this.data = data;
    this.validateScaleValue();
  }

  changeData(data: ViewModelDataPartial): IViewModelData {
    const length = data.length || this.data.length;
    const oldData = this.data;
    this.data = {
      ...oldData,
      ...data,
      length: isLengthValid(length) ? length : oldData.length,
    };
    if (oldData.scaleValue !== data.scaleValue) {
      this.validateScaleValue();
    }

    this.notify({
      type: 'CHANGE_VIEW_DATA',
      payload: {
        newData: deepCopy(this.data),
        differences: getDifferences(this.data, oldData),
      },
    });

    return this.data;
  }

  onThumbMove(numberOfSteps: number, thumbNumber: 0 | 1) {
    this.notify({
      type: 'THUMB_MOVED',
      payload: {
        numberOfSteps,
        thumbNumber,
      },
    });
  }

  getData(): IViewModelData

  getData<Key extends keyof IViewModelData>(dataKey: Key): IViewModelData[Key]

  getData<Key extends keyof IViewModelData>(dataKey?: Key): IViewModelData | IViewModelData[Key] {
    if (dataKey) {
      return deepCopy(this.data[dataKey]);
    }
    return deepCopy(this.data);
  }

  getValuePosition(): number | [number, number] {
    if (!this.data.modelData) return 0;

    const { min, max, value } = this.data.modelData;
    const maxDiapason: number = max - min;

    if (typeof value === 'number') {
      return (this.data.lengthInPx / maxDiapason) * (value - this.data.modelData.min);
    }

    const [firstPosition, secondPosition] = value.map(
      (valueElement) => (this.data.lengthInPx / maxDiapason) * (valueElement - min),
    );
    return [firstPosition, secondPosition];
  }

  getStepLength(): number {
    if (this.data.modelData) {
      const { min, max, stepSize } = this.data.modelData;
      const numberOfSteps = (max - min) / stepSize;
      return this.getData('lengthInPx') / numberOfSteps;
    }
    return 0;
  }

  private validateScaleValue() {
    const { min = 0, max = 0 } = this.data.modelData || {};
    const { scaleValue } = this.data;

    if (!Array.isArray(scaleValue)) return;

    const stringSteps: Array<{ index: number, value: string }> = [];
    const newScaleValue = scaleValue
      .map((step) => {
        if (step > max) return max;
        if (step < min) return min;
        return step;
      })
      .filter((step, index) => {
        if (Number.isNaN(Number(step))) {
          stringSteps.push({ index, value: String(step) });
          return false;
        }
        return true;
      })
      .sort((first, second) => Number(first) - Number(second));

    stringSteps.forEach(({ index, value }) => {
      newScaleValue.splice(index, 0, value);
    });

    this.data.scaleValue = newScaleValue;
  }
}

export default ViewModel;
