import { IModelData } from 'Model/interfacesAndTypes';
import Subject from 'ObserverAndSubject/Subject';

import {
  IViewModel, IViewModelData, IViewModelGetMethods, ViewClasses,
} from './interfacesAndTypes';

class ViewModel extends Subject implements IViewModel, IViewModelGetMethods {
  private data: IViewModelData

  constructor(data: IViewModelData) {
    super();

    this.data = data;
  }

  setActiveThumb(newActiveThumb: null): null

  setActiveThumb(newActiveThumb: HTMLElement): HTMLElement

  setActiveThumb(newActiveThumb: HTMLElement | null): HTMLElement | null {
    this.data.activeThumb = newActiveThumb;
    return this.data.activeThumb;
  }

  setModelData(newModelData: null): null

  setModelData(newModelData: IModelData): IModelData

  setModelData(newModelData: IModelData | null): IModelData | null {
    this.data.modelData = newModelData;
    this.notify({
      type: 'UPDATE_MODEL-DATA',
    });
    return this.data.modelData;
  }

  setClientCoordinates(coordinates: [number, number]): [number, number] {
    [this.data.clientX, this.data.clientY] = coordinates;
    return [this.data.clientX, this.data.clientY];
  }

  setLength(newLength: string): string {
    this.data.length = newLength;
    this.notify({
      type: 'UPDATE_LENGTH',
    });
    return this.data.length;
  }

  setLengthInPx(newLength: number): number {
    this.data.lengthInPx = newLength;
    this.notify({
      type: 'UPDATE_LENGTH-IN-PX',
    });
    return this.data.lengthInPx;
  }

  setIsVertical(newIsVertical: boolean): boolean {
    this.data.isVertical = newIsVertical;
    this.notify({
      type: 'UPDATE_IS-VERTICAL',
    });
    return this.data.isVertical;
  }

  setHasScale(newHasScale: boolean): boolean {
    this.data.hasScale = newHasScale;
    this.notify({
      type: 'UPDATE_HAS-SCALE',
    });
    return this.data.hasScale;
  }

  setScaleValue(newScaleValue: Array<number | string> | number): Array<number | string> | number {
    this.data.scaleValue = newScaleValue;
    this.notify({
      type: 'UPDATE_SCALE-VALUE',
    });
    return this.data.scaleValue;
  }

  setHasTooltip(newHasTooltip: boolean): boolean {
    this.data.hasTooltip = newHasTooltip;
    this.notify({
      type: 'UPDATE_HAS-TOOLTIP',
    });
    return this.data.hasTooltip;
  }

  setHasValueInfo(newHasValueInfo: boolean): boolean {
    this.data.hasValueInfo = newHasValueInfo;
    this.notify({
      type: 'UPDATE_HAS-VALUE-INFO',
    });
    return this.data.hasValueInfo;
  }

  setUseKeyboard(newUseKeyboard: boolean): boolean {
    this.data.useKeyboard = newUseKeyboard;
    this.notify({
      type: 'UPDATE_USE-KEYBOARD',
    });
    return this.data.useKeyboard;
  }

  setIsScaleClickable(newIsScaleClickable: boolean): boolean {
    this.data.isScaleClickable = newIsScaleClickable;
    this.notify({
      type: 'UPDATE_IS-SCALE-CLICKABLE',
    });
    return this.data.isScaleClickable;
  }

  setIsBarClickable(newIsBarClickable: boolean): boolean {
    this.data.isBarClickable = newIsBarClickable;
    this.notify({
      type: 'UPDATE_IS-BAR-CLICKABLE',
    });
    return this.data.isBarClickable;
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
      return this.getLengthInPx() / numberOfSteps;
    }
    return 0;
  }
}

export default ViewModel;
