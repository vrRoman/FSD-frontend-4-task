import { ModelProps } from '../../../Model/interfacesAndTypes';
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
  setVertical(newVertical: boolean) {
    this.data.vertical = newVertical;
    this.notify({
      type: 'UPDATE_VERTICAL',
    });
  }
  setStepsInfoSettings(newStepsInfoSettings: boolean | Array<number | string> | number) {
    this.data.stepsInfoSettings = newStepsInfoSettings;
    this.notify({
      type: 'UPDATE_STEPSINFO-SETTINGS',
    });
  }
  setHasTooltip(newHasTooltip: boolean) {
    this.data.hasTooltip = newHasTooltip;
    this.notify({
      type: 'UPDATE_HAS-TOOLTIP',
    });
  }
  setValueInfo(newValueInfo: boolean) {
    this.data.valueInfo = newValueInfo;
    this.notify({
      type: 'UPDATE_VALUEINFO',
    });
  }
  setResponsive(newResponsive: boolean) {
    this.data.responsive = newResponsive;
    this.notify({
      type: 'UPDATE_RESPONSIVE',
    });
  }
  setUseKeyboard(newUseKeyboard: boolean) {
    this.data.useKeyboard = newUseKeyboard;
    this.notify({
      type: 'UPDATE_USEKEYBOARD',
    });
  }
  setStepsInfoInteractivity(newStepsInfoInteractivity: boolean) {
    this.data.stepsInfoInteractivity = newStepsInfoInteractivity;
    this.notify({
      type: 'UPDATE_STEPSINFO-INTERACTIVITY',
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
  getVertical(): boolean {
    return this.data.vertical;
  }
  getHasTooltip(): boolean {
    return this.data.hasTooltip;
  }
  getValueInfo(): boolean {
    return this.data.valueInfo;
  }
  getStepsInfoSettings(): boolean | Array<number | string> | number {
    if (Array.isArray(this.data.stepsInfoSettings)) {
      return [...this.data.stepsInfoSettings];
    }
    return this.data.stepsInfoSettings;
  }
  getResponsive(): boolean {
    return this.data.responsive;
  }
  getUseKeyboard(): boolean {
    return this.data.useKeyboard;
  }
  getStepsInfoInteractivity(): boolean {
    return this.data.stepsInfoInteractivity;
  }
  getValuePosition(): number | [number, number] | undefined {
    let valuePosition: number | [number, number] | undefined;

    if (this.data.modelProps) {
      if (this.data.modelProps.min !== undefined && this.data.modelProps.max !== undefined) {
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
    }
    return valuePosition;
  }
  // Получить длину шага
  getStepLength(): number | undefined {
    const length = this.getLengthInPx();
    if (length && this.data.modelProps) {
      if (this.data.modelProps.stepSize !== undefined) {
        if (this.data.modelProps.min !== undefined && this.data.modelProps.max !== undefined) {
          const numOfSteps = (this.data.modelProps.max - this.data.modelProps.min)
            / this.data.modelProps.stepSize;
          return length / numOfSteps;
        }
      }
    }
    return undefined;
  }
}

export default ViewModel;
