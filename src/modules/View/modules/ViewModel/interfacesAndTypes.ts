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
  stepsInfoClass: string | string[]
  valueInfoClass: string | string[]
}

interface IViewModelData {
  classes: ViewClasses
  length: string
  lengthInPx: number | undefined
  vertical: boolean
  tooltip: boolean
  valueInfo: boolean
  stepsInfoSettings: boolean | Array<number | string> | number
  responsive: boolean
  useKeyboard: boolean
  stepsInfoInteractivity: boolean

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
  getVertical(): boolean
  getTooltip(): boolean
  getValueInfo(): boolean
  getStepsInfoSettings(): boolean | Array<number | string> | number
  getResponsive(): boolean
  getUseKeyboard(): boolean
  getStepsInfoInteractivity(): boolean
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
  setVertical(newVertical: boolean): void
  setStepsInfoSettings(newStepsInfoSettings: boolean | Array<number | string> | number): void
  setTooltip(newTooltip: boolean): void
  setValueInfo(newValueInfo: boolean): void
  setResponsive(newResponsive: boolean): void
  setUseKeyboard(newUseKeyboard: boolean): void
  setStepsInfoInteractivity(newStepsInfoInteractivity: boolean): void
}


export {
  IViewModel,
  IViewModelGetMethods,
  IViewModelData,
  ViewClasses,
};
