import { ModelProps } from '../../../Model/interfacesAndTypes';
import Subject from '../../../../ObserverAndSubject/Subject';
import {
  IViewModel, IViewModelData, IViewModelGetMethods, ViewClasses,
} from './interfacesAndTypes';
import isModelPropsValuesDefined from '../../../../utils/isModelPropsValuesDefined';


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
  setModelProps(newModelProps: ModelProps) {
    this.data.modelProps = {
      ...this.data.modelProps,
      ...newModelProps,
    };
  }
  setClientCoords(coords: [number, number]) {
    [this.data.clientX, this.data.clientY] = coords;
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
  setIsResponsive(newIsResponsive: boolean) {
    this.data.isResponsive = newIsResponsive;
    this.notify({
      type: 'UPDATE_IS-RESPONSIVE',
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

  getClientCoords(): [number, number] {
    return [this.data.clientX, this.data.clientY];
  }
  getModelProps(): ModelProps | undefined {
    return {
      ...this.data.modelProps,
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
  getIsResponsive(): boolean {
    return this.data.isResponsive;
  }
  getUseKeyboard(): boolean {
    return this.data.useKeyboard;
  }
  getIsScaleClickable(): boolean {
    return this.data.isScaleClickable;
  }
  getValuePosition(): number | [number, number] | undefined {
    let valuePosition: number | [number, number] | undefined;

    if (isModelPropsValuesDefined(this.data.modelProps)) {
      const maxDiapason: number = this.data.modelProps.max - this.data.modelProps.min;
      const { value } = this.data.modelProps;

      if (this.data.lengthInPx !== undefined) {
        if (typeof value === 'number') {
          valuePosition = (this.data.lengthInPx / maxDiapason)
            * (value - this.data.modelProps.min);
        } else if (Array.isArray(value)) {
          valuePosition = [
            (this.data.lengthInPx / maxDiapason)
            * (value[0] - this.data.modelProps.min),
            (this.data.lengthInPx / maxDiapason)
            * (value[1] - this.data.modelProps.min),
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
      if (isModelPropsValuesDefined(this.data.modelProps)) {
        const numOfSteps = (this.data.modelProps.max - this.data.modelProps.min)
          / this.data.modelProps.stepSize;
        return length / numOfSteps;
      }
    }
    return undefined;
  }
}

export default ViewModel;
