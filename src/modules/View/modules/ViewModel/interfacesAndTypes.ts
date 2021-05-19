import { IModelData } from '../../../Model/interfacesAndTypes';
import { ISubject } from '../../../../ObserverAndSubject/interfacesAndTypes';

type elementClass = string | string[]

type ViewClasses = {
  sliderClass: elementClass
  sliderVerticalClass: elementClass
  barClass: elementClass
  clickableBarClass: elementClass
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
  lengthInPx: number
  isVertical: boolean
  hasTooltip: boolean
  hasValueInfo: boolean
  hasScale: boolean
  scaleValue: Array<number | string> | number
  useKeyboard: boolean
  isScaleClickable: boolean
  isBarClickable: boolean

  modelData: IModelData | null

  activeThumb: HTMLElement | null
  clientX: number
  clientY: number
}

interface IViewModelGetMethods {
  getClientCoordinates(): [number, number]
  getModelData(): IModelData | null
  getActiveThumb(): HTMLElement | null
  getClasses(): ViewClasses
  getLength(): string
  getLengthInPx(): number
  getIsVertical(): boolean
  getHasTooltip(): boolean
  getHasValueInfo(): boolean
  getHasScale(): boolean
  getScaleValue(): Array<number | string> | number
  getUseKeyboard(): boolean
  getIsScaleClickable(): boolean
  getIsBarClickable(): boolean
  getValuePosition(): number | [number, number] | null
  getStepLength(): number | null
}

interface IViewModel extends ISubject, IViewModelGetMethods {
  setActiveThumb(newActiveThumb: HTMLElement | null): void
  setModelData(newModelData: IModelData | null): void
  setClientCoordinates(coordinates: [number, number]): void
  setLength(newLength: string): void
  setLengthInPx(newLength: number): void
  setIsVertical(newIsVertical: boolean): void
  setHasScale(newHasScale: boolean): void
  setScaleValue(newScaleValue: Array<number | string> | number): void
  setHasTooltip(newHasTooltip: boolean): void
  setHasValueInfo(newHasValueInfo: boolean): void
  setUseKeyboard(newUseKeyboard: boolean): void
  setIsScaleClickable(newIsScaleClickable: boolean): void
  setIsBarClickable(newIsBarClickable: boolean): void
}

export {
  IViewModel,
  IViewModelGetMethods,
  IViewModelData,
  ViewClasses,
};
