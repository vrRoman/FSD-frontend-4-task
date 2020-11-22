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

  createSlider(): HTMLElement

  createBar(): HTMLElement
  createProgressBar(): HTMLElement
  updateProgressBar(): void
  createThumb(): HTMLElement | Array<HTMLElement>
  updateThumb(): void
  removeThumb(): void

  createTooltip(): HTMLElement | Array<HTMLElement> | undefined
  updateTooltip(): void
  removeTooltip(): void

  createStepsInfo(): HTMLElement | undefined
  updateStepsInfo(): void
  removeStepsInfo(): void

  createValueInfo(): HTMLElement
  updateValueInfo(): void
  removeValueInfo(): void

  getParent(): Element
  getSlider(): HTMLElement

  getBar(): HTMLElement
  getProgressBar(): HTMLElement
  getThumb(): HTMLElement | Array<HTMLElement> | undefined
  getThumbPosition(): number | number[]

  getTooltip(): HTMLElement | Array<HTMLElement> | undefined

  getStepsInfo(): HTMLElement | undefined
  getStepsInfoSettings(): boolean | Array<number | string> | number

  getValueInfo(): HTMLElement | undefined

  getResponsive(): boolean
  getLength(): number
  getVertical(): boolean

  changeResponsive(newResponsive: boolean): boolean
  changeLength(newLength: string): number
  changeVertical(newVertical: boolean): boolean
  changeStepsInfoSettings(newStepsInfoSettings: boolean | Array<number | string> | number)
    : HTMLElement | undefined
}
