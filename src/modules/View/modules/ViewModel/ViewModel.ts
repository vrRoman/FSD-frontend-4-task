import { ModelProperties } from '../../../Model/interfacesAndTypes';
import Subject from '../../../../ObserverAndSubject/Subject';
import {
  IViewModel, IViewModelData, IViewModelGetMethods, ViewClasses,
} from './interfacesAndTypes';
import isModelPropertiesValuesDefined from '../../../../utilities/isModelPropertiesValuesDefined';

class ViewModel extends Subject implements IViewModel, IViewModelGetMethods {
  private data: IViewModelData

  constructor(data: IViewModelData) {
    super();

    this.data = data;
  }

  // Убирает активный полузнок
  removeActiveThumb() {
    this.data.activeThumb = undefined;
  }

  // Перезаписывает активный ползунок
  setActiveThumb(newActiveThumb: HTMLElement) {
    this.data.activeThumb = newActiveThumb;
  }

  setModelProperties(newModelProperties: ModelProperties) {
    this.data.modelProperties = {
      ...this.data.modelProperties,
      ...newModelProperties,
    };
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

  getClientCoordinates(): [number, number] {
    return [this.data.clientX, this.data.clientY];
  }

  getModelProperties(): ModelProperties | undefined {
    return {
      ...this.data.modelProperties,
    };
  }

  getActiveThumb(): HTMLElement | undefined {
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

  getLengthInPx(): number | undefined {
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

  getValuePosition(): number | [number, number] | undefined {
    let valuePosition: number | [number, number] | undefined;

    if (isModelPropertiesValuesDefined(this.data.modelProperties)) {
      const maxDiapason: number = this.data.modelProperties.max - this.data.modelProperties.min;
      const { value } = this.data.modelProperties;

      if (this.data.lengthInPx !== undefined) {
        if (typeof value === 'number') {
          valuePosition = (this.data.lengthInPx / maxDiapason)
            * (value - this.data.modelProperties.min);
        } else if (Array.isArray(value)) {
          valuePosition = [
            (this.data.lengthInPx / maxDiapason)
            * (value[0] - this.data.modelProperties.min),
            (this.data.lengthInPx / maxDiapason)
            * (value[1] - this.data.modelProperties.min),
          ];
        }
      }
    }
    return valuePosition;
  }

  // Получить длину шага
  getStepLength(): number | undefined {
    const length = this.getLengthInPx();
    if (length !== undefined) {
      if (isModelPropertiesValuesDefined(this.data.modelProperties)) {
        const numberOfSteps = (this.data.modelProperties.max - this.data.modelProperties.min)
          / this.data.modelProperties.stepSize;
        return length / numberOfSteps;
      }
    }
    return undefined;
  }
}

export default ViewModel;
