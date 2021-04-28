import { ModelProperties } from '../../../Model/interfacesAndTypes';
import { ISubject } from '../../../../ObserverAndSubject/interfacesAndTypes';

type elementClass = string | string[]

type ViewClasses = {
  sliderClass: elementClass
  sliderVerticalClass: elementClass
  barClass: elementClass
  progressBarClass: elementClass
  thumbClass: elementClass
  activeThumbClass: elementClass
  tooltipClass: elementClass
  tooltipValueClass: elementClass
  scaleClass: elementClass
  scaleElementClass: elementClass
  clickableScaleElementClass: elementClass
  valueInfoClass: elementClass
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

  modelProperties: ModelProperties | undefined

  activeThumb: HTMLElement | undefined
  clientX: number
  clientY: number
}

interface IViewModelGetMethods {
  getClientCoordinates(): [number, number]
  getModelProperties(): ModelProperties | undefined
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
  setModelProperties(newModelProperties: ModelProperties): void
  setClientCoordinates(coordinates: [number, number]): void
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
