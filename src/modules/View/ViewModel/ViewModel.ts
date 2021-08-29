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
  }

  changeData(data: ViewModelDataPartial): IViewModelData {
    const length = data.length || this.data.length;
    const oldData = this.data;
    this.data = {
      ...oldData,
      ...data,
      length: isLengthValid(length) ? length : oldData.length,
    };

    this.notify({
      type: 'CHANGE_VIEW_DATA',
      payload: {
        newData: deepCopy(this.data),
        differences: getDifferences(this.data, oldData),
      },
    });

    return this.data;
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
    let valuePosition: number | [number, number] = 0;

    if (this.data.modelData) {
      const { min, max, value } = this.data.modelData;
      const maxDiapason: number = max - min;

      if (typeof value === 'number') {
        valuePosition = (this.data.lengthInPx / maxDiapason) * (value - this.data.modelData.min);
      } else {
        valuePosition = [
          (this.data.lengthInPx / maxDiapason) * (value[0] - min),
          (this.data.lengthInPx / maxDiapason) * (value[1] - min),
        ];
      }
    }
    return valuePosition;
  }

  getStepLength(): number {
    if (this.data.modelData) {
      const { min, max, stepSize } = this.data.modelData;
      const numberOfSteps = (max - min) / stepSize;
      return this.getData('lengthInPx') / numberOfSteps;
    }
    return 0;
  }
}

export default ViewModel;
