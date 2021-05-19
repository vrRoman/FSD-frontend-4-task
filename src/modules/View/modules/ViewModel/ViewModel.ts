import { IModelData } from '../../../Model/interfacesAndTypes';
import Subject from '../../../../ObserverAndSubject/Subject';
import {
  IViewModel, IViewModelData, IViewModelGetMethods, ViewClasses,
} from './interfacesAndTypes';

class ViewModel extends Subject implements IViewModel, IViewModelGetMethods {
  private data: IViewModelData

  constructor(data: IViewModelData) {
    super();

    this.data = data;
  }

  setActiveThumb(newActiveThumb: HTMLElement | null) {
    this.data.activeThumb = newActiveThumb;
  }

  setModelData(newModelData: IModelData | null) {
    this.data.modelData = newModelData;
  }

  setClientCoordinates(coordinates: [number, number]) {
    [this.data.clientX, this.data.clientY] = coordinates;
  }

  setLength(newLength: string) {
    this.data.length = newLength;
    this.notify({
      type: 'UPDATE_LENGTH',
    });
  }

  setLengthInPx(newLength: number) {
    this.data.lengthInPx = newLength;
  }

  setIsVertical(newIsVertical: boolean) {
    this.data.isVertical = newIsVertical;
    this.notify({
      type: 'UPDATE_IS-VERTICAL',
    });
  }

  setHasScale(newHasScale: boolean) {
    this.data.hasScale = newHasScale;
    this.notify({
      type: 'UPDATE_HAS-SCALE',
    });
  }

  setScaleValue(newScaleValue: Array<number | string> | number) {
    this.data.scaleValue = newScaleValue;
    this.notify({
      type: 'UPDATE_SCALE-VALUE',
    });
  }

  setHasTooltip(newHasTooltip: boolean) {
    this.data.hasTooltip = newHasTooltip;
    this.notify({
      type: 'UPDATE_HAS-TOOLTIP',
    });
  }

  setHasValueInfo(newHasValueInfo: boolean) {
    this.data.hasValueInfo = newHasValueInfo;
    this.notify({
      type: 'UPDATE_HAS-VALUE-INFO',
    });
  }

  setUseKeyboard(newUseKeyboard: boolean) {
    this.data.useKeyboard = newUseKeyboard;
    this.notify({
      type: 'UPDATE_USE-KEYBOARD',
    });
  }

  setIsScaleClickable(newIsScaleClickable: boolean) {
    this.data.isScaleClickable = newIsScaleClickable;
    this.notify({
      type: 'UPDATE_IS-SCALE-CLICKABLE',
    });
  }

  setIsBarClickable(newIsBarClickable: boolean) {
    this.data.isBarClickable = newIsBarClickable;
    this.notify({
      type: 'UPDATE_IS-BAR-CLICKABLE',
    });
  }

  getClientCoordinates(): [number, number] {
    return [this.data.clientX, this.data.clientY];
  }

  getModelData(): IModelData | null {
    if (this.data.modelData) {
      return {
        ...this.data.modelData,
      };
    }
    return null;
  }

  getActiveThumb(): HTMLElement | null {
    return this.data.activeThumb;
  }

  getClasses(): ViewClasses {
    return {
      ...this.data.classes,
    };
  }

  getLength(): string {
    return this.data.length;
  }

  getLengthInPx(): number {
    return this.data.lengthInPx;
  }

  getIsVertical(): boolean {
    return this.data.isVertical;
  }

  getHasTooltip(): boolean {
    return this.data.hasTooltip;
  }

  getHasValueInfo(): boolean {
    return this.data.hasValueInfo;
  }

  getHasScale(): boolean {
    return this.data.hasScale;
  }

  getScaleValue(): Array<number | string> | number {
    if (Array.isArray(this.data.scaleValue)) {
      return [...this.data.scaleValue];
    }
    return this.data.scaleValue;
  }

  getUseKeyboard(): boolean {
    return this.data.useKeyboard;
  }

  getIsScaleClickable(): boolean {
    return this.data.isScaleClickable;
  }

  getIsBarClickable(): boolean {
    return this.data.isBarClickable;
  }

  getValuePosition(): number | [number, number] | null {
    let valuePosition: number | [number, number] | null = null;

    if (this.data.modelData) {
      const maxDiapason: number = this.data.modelData.max - this.data.modelData.min;
      const { value } = this.data.modelData;

      if (typeof value === 'number') {
        valuePosition = (this.data.lengthInPx / maxDiapason)
          * (value - this.data.modelData.min);
      } else if (Array.isArray(value)) {
        valuePosition = [
          (this.data.lengthInPx / maxDiapason)
          * (value[0] - this.data.modelData.min),
          (this.data.lengthInPx / maxDiapason)
          * (value[1] - this.data.modelData.min),
        ];
      }
    }
    return valuePosition;
  }

  getStepLength(): number | null {
    if (this.data.modelData) {
      const numberOfSteps = (this.data.modelData.max - this.data.modelData.min)
        / this.data.modelData.stepSize;
      return this.getLengthInPx() / numberOfSteps;
    }
    return null;
  }
}

export default ViewModel;
