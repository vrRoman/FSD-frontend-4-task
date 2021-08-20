import autoBind from 'auto-bind';

import { IObserver, SubjectAction } from 'ObserverAndSubject';
import { IModel, Value } from 'Model';
import { IViewModel } from 'View/ViewModel';

import { ISliderConfig, optionNames } from './SliderConfig.model';

class SliderConfig implements IObserver, ISliderConfig {
  private readonly inputElSelector: string;

  private element: HTMLElement;

  private $slider: JQuery;

  private inputElements: Array<HTMLElement>;

  constructor(configElement: HTMLElement, sliderElement: HTMLElement) {
    autoBind(this);

    this.inputElSelector = '.js-option .js-option__input';
    this.element = configElement;
    this.$slider = $(sliderElement);
    this.inputElements = this.getInputElements();

    this.init();
  }

  update(action: SubjectAction) {
    switch (action.type) {
      case 'CHANGE_OPTIONS':
        this.updateSecondValueInput();
        this.updateCheckbox('isRange');

        this.updateTextInput('value1');
        this.updateTextInput('value2');

        this.updateTextInput('stepSize');

        this.updateTextInput('min');
        this.updateTextInput('max');
        this.updateTextInput('value1');
        this.updateTextInput('value2');
        break;

      case 'UPDATE_HAS-TOOLTIP':
        this.updateCheckbox('hasTooltip');
        break;
      case 'UPDATE_HAS-SCALE':
        this.updateCheckbox('hasScale');
        break;
      case 'UPDATE_HAS-VALUE-INFO':
        this.updateCheckbox('hasValueInfo');
        break;
      case 'UPDATE_IS-VERTICAL':
        this.updateCheckbox('isVertical');
        break;
      case 'UPDATE_IS-SCALE-CLICKABLE':
        this.updateCheckbox('isScaleClickable');
        break;
      case 'UPDATE_IS-BAR-CLICKABLE':
        this.updateCheckbox('isBarClickable');
        break;
      case 'UPDATE_USE-KEYBOARD':
        this.updateCheckbox('useKeyboard');
        break;
      case 'UPDATE_LENGTH':
        this.updateTextInput('length');
        break;
      case 'UPDATE_SCALE-VALUE':
        this.updateTextInput('scaleValue');
        break;
      default: break;
    }
  }

  updateCheckbox(optionName: string) {
    this.inputElements.forEach((element) => {
      const { name } = element.dataset;
      if (name === optionName) {
        const currentValue = this.getCheckboxValue(name);
        if (currentValue !== null) {
          $(element).prop('checked', currentValue);
        }
      }
    });
  }

  updateTextInput(optionName: optionNames) {
    const element = this.getInputElement(optionName);
    const currentValue = this.getTextInputValue(optionName);
    const newValue = Array.isArray(currentValue)
      ? currentValue.map((value) => String(value))
      : currentValue;
    if (element) {
      $(element).val(newValue);
    } else {
      throw new Error('element is null');
    }
  }

  getInputElements(): Array<HTMLElement> {
    const result: Array<HTMLElement> = [];
    const nodeList = this.element.querySelectorAll<HTMLElement>(this.inputElSelector);
    nodeList.forEach((element) => {
      result.push(element);
    });

    return result;
  }

  getCheckboxValue(optionName: string): boolean | null {
    let module: IModel | IViewModel;
    let value: boolean | null = null;

    switch (optionName) {
      case 'isRange':
        module = this.$slider.slider('model');
        value = module.getOption('isRange');
        break;
      case 'hasTooltip':
        module = this.$slider.slider('viewModel');
        value = module.getData('hasTooltip');
        break;
      case 'hasScale':
        module = this.$slider.slider('viewModel');
        value = module.getData('hasScale');
        break;
      case 'hasValueInfo':
        module = this.$slider.slider('viewModel');
        value = module.getData('hasValueInfo');
        break;
      case 'isVertical':
        module = this.$slider.slider('viewModel');
        value = module.getData('isVertical');
        break;
      case 'isScaleClickable':
        module = this.$slider.slider('viewModel');
        value = module.getData('isScaleClickable');
        break;
      case 'isBarClickable':
        module = this.$slider.slider('viewModel');
        value = module.getData('isBarClickable');
        break;
      case 'useKeyboard':
        module = this.$slider.slider('viewModel');
        value = module.getData('useKeyboard');
        break;
      default: break;
    }

    return value;
  }

  getTextInputValue(optionName: 'value1' | 'value2' | 'stepSize' | 'min' | 'max'): number

  // eslint-disable-next-line no-dupe-class-members
  getTextInputValue(optionName: 'length'): string

  // eslint-disable-next-line no-dupe-class-members
  getTextInputValue(optionName: 'scaleValue'): number | Array<string | number>

  // eslint-disable-next-line no-dupe-class-members
  getTextInputValue(optionName: optionNames): number | string | Array<number | string>

  // eslint-disable-next-line no-dupe-class-members
  getTextInputValue(optionName: string): number | string | Array<string | number> | null {
    let module: IModel | IViewModel;
    let value: number | string | Array<string | number> | null = null;
    const modelValue = this.$slider.slider('value');

    switch (optionName) {
      case 'value1':
        if (Array.isArray(modelValue)) {
          [value] = modelValue;
        } else {
          value = modelValue;
        }
        break;
      case 'value2':
        if (Array.isArray(modelValue)) {
          [, value] = modelValue;
        } else {
          value = '';
        }
        break;
      case 'stepSize':
        module = this.$slider.slider('model');
        value = module.getOption('stepSize');
        break;
      case 'min':
        module = this.$slider.slider('model');
        value = module.getOption('min');
        break;
      case 'max':
        module = this.$slider.slider('model');
        value = module.getOption('max');
        break;
      case 'length':
        module = this.$slider.slider('viewModel');
        value = module.getData('length');
        break;
      case 'scaleValue':
        module = this.$slider.slider('viewModel');
        value = module.getData('scaleValue');
        break;
      default: break;
    }
    return value;
  }

  getInputElement(optionName: string): HTMLElement | null {
    let result: null | HTMLElement = null;
    this.inputElements.forEach((element) => {
      if (element.dataset.name === optionName) {
        result = element;
      }
    });
    return result;
  }

  private init() {
    this.initCheckboxes();
    this.initTextInputs();
    this.$slider.slider('subscribe', this);
  }

  private initCheckboxes() {
    this.inputElements.forEach((element) => {
      const { name } = element.dataset;
      if (name) {
        const currentValue = this.getCheckboxValue(name);
        if (currentValue !== null) {
          $(element).prop('checked', currentValue);

          $(element).on('change', this.handleCheckboxChange);
        }
      }
    });
  }

  private initTextInputs() {
    this.initSpecificTextInput('value1', () => this.handleValueInputFocusOut('value1'));
    this.initSpecificTextInput('value2', () => this.handleValueInputFocusOut('value2'));
    this.updateSecondValueInput();
    this.initSpecificTextInput('min', this.handleMinMaxInputFocusOut);
    this.initSpecificTextInput('max', this.handleMinMaxInputFocusOut);
    this.initSpecificTextInput('stepSize', this.handleStepSizeInputFocusOut);
    this.initSpecificTextInput('length', this.handleLengthInputFocusOut);
    this.initSpecificTextInput('scaleValue', this.handleScaleValueInputFocusOut);
  }

  private initSpecificTextInput(
    optionName: optionNames,
    onFocusOut: (event: JQuery.FocusOutEvent) => void,
  ) {
    const element = this.getInputElement(optionName);
    if (element === null) {
      throw new Error('element is null');
    }

    this.updateTextInput(optionName);

    $(element).on('focusout', onFocusOut);
  }

  private updateSecondValueInput() {
    const secondValueElement = this.getInputElement('value2');
    const secondValueElementValue = this.getTextInputValue('value2');
    if (secondValueElement) {
      $(secondValueElement).val(secondValueElementValue);
      $(secondValueElement).prop('disabled', !this.getCheckboxValue('isRange'));
    } else {
      throw new Error('Input with name `value2` is null');
    }
  }

  private handleCheckboxChange(event: JQuery.ChangeEvent) {
    if (event.target.dataset.name) {
      this.$slider.slider('changeOptions', {
        [event.target.dataset.name]: event.target.checked,
      });
      this.updateSecondValueInput();
    }
  }

  private handleValueInputFocusOut(optionName: 'value1' | 'value2') {
    const element = this.getInputElement(optionName);
    if (element === null) {
      throw new Error('element is null');
    }

    const sliderValue = this.$slider.slider('value');
    const value = $(element).val() === ''
      ? this.getTextInputValue(optionName)
      : Number($(element).val());
    let newSliderValue: Value;

    if (Array.isArray(sliderValue)) {
      if (optionName === 'value1') {
        newSliderValue = [value, sliderValue[1]];
      } else {
        newSliderValue = [sliderValue[0], value];
      }
    } else {
      newSliderValue = value;
    }

    this.$slider.slider('changeOptions', {
      value: newSliderValue,
    });
    $(element).val(this.getTextInputValue(optionName));
  }

  private handleMinMaxInputFocusOut(event: JQuery.FocusOutEvent) {
    const isValueCorrect = $(event.target).val() && !Number.isNaN(Number($(event.target).val()));
    const { name } = event.target.dataset;
    if (isValueCorrect) {
      this.$slider.slider('changeOptions', {
        [name]: Number($(event.target).val()),
      });
    }
    $(event.target).val(this.getTextInputValue(name));
  }

  private handleStepSizeInputFocusOut(event: JQuery.FocusOutEvent) {
    const value = $(event.target).val() === ''
      ? this.getTextInputValue('stepSize')
      : Number($(event.target).val());
    const isValueCorrect = !Number.isNaN(value);
    if (isValueCorrect) {
      this.$slider.slider('changeOptions', {
        stepSize: value,
      });
    }
    $(event.target).val(this.getTextInputValue('stepSize'));
  }

  private handleLengthInputFocusOut(event: JQuery.FocusOutEvent) {
    const inputValue = String($(event.target).val());
    const newValue = inputValue === ''
      ? this.getTextInputValue('length')
      : inputValue;
    if (newValue !== '') {
      this.$slider.slider('changeOptions', {
        length: newValue,
      });
    }
    $(event.target).val(this.getTextInputValue('length'));
  }

  private handleScaleValueInputFocusOut(event: JQuery.FocusOutEvent) {
    const value = String($(event.target).val());
    let newScaleValue: number | Array<string | number>;
    if (value !== '') {
      const isValueArray = value.indexOf(',') !== -1;
      if (isValueArray) {
        newScaleValue = value.split(',');
      } else {
        const isValueNumber = !Number.isNaN(Number(value));
        if (isValueNumber) {
          newScaleValue = Number(value);
        } else {
          newScaleValue = [value];
        }
      }

      this.$slider.slider('changeOptions', {
        scaleValue: newScaleValue,
      });
    } else {
      this.$slider.slider('changeOptions', {
        scaleValue: this.getTextInputValue('scaleValue'),
      });
    }

    const currentValue = this.getTextInputValue('scaleValue');
    const convertedValue = Array.isArray(currentValue)
      ? currentValue.map((element) => String(element))
      : currentValue;
    $(event.target).val(convertedValue);
  }
}

export default SliderConfig;
