type optionNames = 'value1' | 'value2' | 'stepSize' | 'min' | 'max' | 'length' | 'scaleValue';

interface ISliderConfig {
  updateCheckbox(optionName: string): void
  updateTextInput(optionName: string): void
  getInputElements(): Array<HTMLElement>
  getCheckboxValue(optionName: string): boolean | null
  getInputElement(optionName: string): HTMLElement | null

  getTextInputValue(optionName: 'value1' | 'value2' | 'stepSize' | 'min' | 'max'): number
  getTextInputValue(optionName: 'length'): string
  getTextInputValue(optionName: 'scaleValue'): number | Array<string | number>
  getTextInputValue(optionName: optionNames): number | string | Array<number | string>
  getTextInputValue(optionName: string): number | string | Array<string | number> | null
}

export { ISliderConfig, optionNames };
