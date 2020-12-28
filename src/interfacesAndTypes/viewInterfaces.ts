import { ViewOptions } from './options';
import { ModelProps } from './modelTypesAndInterfaces';
import { IPresenter } from './presenterInterfaces';
import { SubjectAction } from './observerAndSubjectInterfaces';

export interface IView {
  sliderClass: string | string[]
  sliderVerticalClass: string | string[]
  barClass: string | string[]
  progressBarClass: string | string[]
  thumbClass: string | string[]
  activeThumbClass: string | string[]
  tooltipClass: string | string[]
  stepsInfoClass: string | string[]
  valueInfoClass: string | string[]

  drawSlider(): void
  update(action: SubjectAction): void

  getOptions(): ViewOptions
  provideModelProps(modelProps: ModelProps): void
  setPresenter(presenter: IPresenter): void

  createSliderContainer(): HTMLElement
  createBar(): HTMLElement | undefined
  createProgressBar(): HTMLElement | undefined
  createThumb(): HTMLElement | Array<HTMLElement> | undefined
  createTooltip(): HTMLElement | Array<HTMLElement> | undefined
  createStepsInfo(): HTMLElement | undefined
  createValueInfo(): HTMLElement | undefined

  removeThumb(): void
  removeTooltip(): void
  removeStepsInfo(): void
  removeValueInfo(): void

  updateProgressBar(): void
  updateThumb(): void
  updateTooltip(): void
  updateStepsInfo(): void
  updateValueInfo(): void

  getParent(): Element
  getSlider(): HTMLElement | undefined
  getBar(): HTMLElement | undefined
  getProgressBar(): HTMLElement | undefined
  getThumb(): HTMLElement | Array<HTMLElement> | undefined
  getTooltip(): HTMLElement | Array<HTMLElement> | undefined
  getStepsInfo(): HTMLElement | undefined
  getValueInfo(): HTMLElement | undefined

  getStepsInfoSettings(): boolean | Array<number | string> | number
  getResponsive(): boolean
  getVertical(): boolean
  getUseKeyboard(): boolean
  getInteractiveStepsInfo(): boolean

  getLength(): number
  getStepLength(): number | undefined
  getThumbPosition(): number | number[] | undefined

  getActiveThumb(): HTMLElement | undefined
  setActiveThumb(numOfThumb?: number): void
  removeActiveThumb(): void

  addThumbListener() : void
  addKeyboardListener(): void
  addStepsInfoInteractivity(): void

  removeKeyboardListener(): void
  removeStepsInfoInteractivity(): void

  changeLength(newLength: string): number
  changeVertical(newVertical: boolean): boolean
  changeResponsive(newResponsive: boolean): boolean
  changeStepsInfoSettings(newStepsInfoSettings: boolean | Array<number | string> | number)
    : HTMLElement | undefined
}
