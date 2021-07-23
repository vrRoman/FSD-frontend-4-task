import { IModelData } from 'Model';
import { ISubject } from 'ObserverAndSubject';

type elementClass = string | string[];

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
};

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
  getValuePosition(): number | [number, number]
  getStepLength(): number
}

interface IViewModel extends ISubject, IViewModelGetMethods {
  setActiveThumb(newActiveThumb: null): null
  setActiveThumb(newActiveThumb: HTMLElement): HTMLElement
  setModelData(newModelData: null): null
  setModelData(newModelData: IModelData): IModelData
  setClientCoordinates(coordinates: [number, number]): [number, number]
  setLength(newLength: string): string
  setLengthInPx(newLength: number): number
  setIsVertical(newIsVertical: boolean): boolean
  setHasScale(newHasScale: boolean): boolean
  setScaleValue(newScaleValue: Array<number | string> | number): Array<number | string> | number
  setHasTooltip(newHasTooltip: boolean): boolean
  setHasValueInfo(newHasValueInfo: boolean): boolean
  setUseKeyboard(newUseKeyboard: boolean): boolean
  setIsScaleClickable(newIsScaleClickable: boolean): boolean
  setIsBarClickable(newIsBarClickable: boolean): boolean
}

export {
  IViewModel,
  IViewModelGetMethods,
  IViewModelData,
  ViewClasses,
};
