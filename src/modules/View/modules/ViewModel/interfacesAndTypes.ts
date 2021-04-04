import { ModelProps } from '../../../Model/interfacesAndTypes';
import { ISubject } from '../../../../ObserverAndSubject/interfacesAndTypes';

type ViewClasses = {
  sliderClass: string | string[]
  sliderVerticalClass: string | string[]
  barClass: string | string[]
  progressBarClass: string | string[]
  thumbClass: string | string[]
  activeThumbClass: string | string[]
  tooltipClass: string | string[]
  tooltipValueClass: string | string[]
  scaleClass: string | string[]
  valueInfoClass: string | string[]
}

interface IViewModelData {
  classes: ViewClasses
  length: string
  lengthInPx: number | undefined
  isVertical: boolean
  hasTooltip: boolean
  hasValueInfo: boolean
  hasScale: boolean
  scaleValue: Array<number | string> | number
  isResponsive: boolean
  useKeyboard: boolean
  isScaleClickable: boolean

  modelProps: ModelProps | undefined

  activeThumb: HTMLElement | undefined
  clientX: number
  clientY: number
}

interface IViewModelGetMethods {
  getClientCoords(): [number, number]
  getModelProps(): ModelProps | undefined
  getActiveThumb(): HTMLElement | undefined
  getClasses(): ViewClasses
  getLength(): string
  getLengthInPx(): number | undefined
  getIsVertical(): boolean
  getHasTooltip(): boolean
  getHasValueInfo(): boolean
  getHasScale(): boolean
  getScaleValue(): Array<number | string> | number
  getIsResponsive(): boolean
  getUseKeyboard(): boolean
  getIsScaleClickable(): boolean
  getValuePosition(): number | [number, number] | undefined
  getStepLength(): number | undefined
}

interface IViewModel extends ISubject, IViewModelGetMethods {
  removeActiveThumb(): void
  setActiveThumb(newActiveThumb: HTMLElement): void
  setModelProps(newModelProps: ModelProps): void
  setClientCoords(coords: [number, number]): void
  setLength(newLength: string): void
  setLengthInPx(newLength: number): void
  setIsVertical(newIsVertical: boolean): void
  setHasScale(newHasScale: boolean): void
  setScaleValue(newScaleValue: Array<number | string> | number): void
  setHasTooltip(newHasTooltip: boolean): void
  setHasValueInfo(newHasValueInfo: boolean): void
  setIsResponsive(newResponsive: boolean): void
  setUseKeyboard(newUseKeyboard: boolean): void
  setIsScaleClickable(newIsScaleClickable: boolean): void
}


export {
  IViewModel,
  IViewModelGetMethods,
  IViewModelData,
  ViewClasses,
};
