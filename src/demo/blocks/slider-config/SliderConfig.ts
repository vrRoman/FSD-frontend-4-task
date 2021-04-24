import ISliderConfig, { optionNames } from './interfaceAndTypes';
import { IObserver, SubjectAction } from '../../../ObserverAndSubject/interfacesAndTypes';
import IModel, { Value } from '../../../modules/Model/interfacesAndTypes';
import { IViewModel } from '../../../modules/View/modules/ViewModel/interfacesAndTypes';

class SliderConfig implements IObserver, ISliderConfig {
  private readonly inputElSelector: string;
  private elem: HTMLElement;
  private $slider: JQuery;
  private inputElements: Array<HTMLElement>;

  constructor(configElem: HTMLElement, sliderElem: HTMLElement) {
    this.inputElSelector = '.js-option .js-option__input';
    this.elem = configElem;
    this.$slider = $(sliderElem);
    this.inputElements = this.getInputElements();

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleValueInputFocusOut = this.handleValueInputFocusOut.bind(this);
    this.handleMinMaxInputFocusOut = this.handleMinMaxInputFocusOut.bind(this);
    this.handleStepSizeInputFocusOut = this.handleStepSizeInputFocusOut.bind(this);
    this.handleLengthInputFocusOut = this.handleLengthInputFocusOut.bind(this);
    this.handleScaleValueInputFocusOut = this.handleScaleValueInputFocusOut.bind(this);

    this.init();
  }

  update(action: SubjectAction) {
    switch (action.type) {
      case 'UPDATE_IS-RANGE':
        this.updateSecondValueInput();
        this.updateCheckbox('isRange');
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
      case 'UPDATE_IS-RESPONSIVE':
        this.updateCheckbox('isResponsive');
        break;
      case 'UPDATE_IS-SCALE-CLICKABLE':
        this.updateCheckbox('isScaleClickable');
        break;
      case 'UPDATE_USE-KEYBOARD':
        this.updateCheckbox('useKeyboard');
        break;
      case 'UPDATE_VALUE':
        this.updateTextInput('value1');
        this.updateTextInput('value2');
        break;
      case 'UPDATE_STEP-SIZE':
        this.updateTextInput('stepSize');
        break;
      case 'UPDATE_MIN-MAX':
        this.updateTextInput('min');
        this.updateTextInput('max');
        this.updateTextInput('value1');
        this.updateTextInput('value2');
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
    this.inputElements.forEach((el) => {
      const { name } = el.dataset;
      if (name === optionName) {
        const curVal = this.getCheckboxValue(name);
        if (curVal !== null) {
          $(el).prop('checked', curVal);
        }
      }
    });
  }

  updateTextInput(optionName: optionNames) {
    const elem = this.getInputEl(optionName);
    const curVal = this.getTextInputValue(optionName);
    const newVal = Array.isArray(curVal)
        ? curVal.map((val) => String(val))
        : curVal;
    if (elem) {
      $(elem).val(newVal);
    } else {
      throw new Error('elem is null');
    }
  }

  getInputElements(): Array<HTMLElement> {
    const result: Array<HTMLElement> = [];
    const nodeList = this.elem.querySelectorAll<HTMLElement>(this.inputElSelector);
    nodeList.forEach((el) => {
      result.push(el);
    });

    return result;
  }

  getCheckboxValue(optionName: string): boolean | null {
    let module: IModel | IViewModel;
    let value: boolean | null = null;

    switch (optionName) {
      case 'isRange':
        module = this.$slider.slider('model');
        value = module.getIsRange();
        break;
      case 'hasTooltip':
        module = this.$slider.slider('viewModel');
        value = module.getHasTooltip();
        break;
      case 'hasScale':
        module = this.$slider.slider('viewModel');
        value = module.getHasScale();
        break;
      case 'hasValueInfo':
        module = this.$slider.slider('viewModel');
        value = module.getHasValueInfo();
        break;
      case 'isVertical':
        module = this.$slider.slider('viewModel');
        value = module.getIsVertical();
        break;
      case 'isResponsive':
        module = this.$slider.slider('viewModel');
        value = module.getIsResponsive();
        break;
      case 'isScaleClickable':
        module = this.$slider.slider('viewModel');
        value = module.getIsScaleClickable();
        break;
      case 'useKeyboard':
        module = this.$slider.slider('viewModel');
        value = module.getUseKeyboard();
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
        value = module.getStepSize();
        break;
      case 'min':
        module = this.$slider.slider('model');
        value = module.getMin();
        break;
      case 'max':
        module = this.$slider.slider('model');
        value = module.getMax();
        break;
      case 'length':
        module = this.$slider.slider('viewModel');
        value = module.getLength();
        break;
      case 'scaleValue':
        module = this.$slider.slider('viewModel');
        value = module.getScaleValue();
        break;
      default: break;
    }
    return value;
  }

  getInputEl(optionName: string): HTMLElement | null {
    let result: null | HTMLElement = null;
    this.inputElements.forEach((el) => {
      if (el.dataset.name === optionName) {
        result = el;
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
    this.inputElements.forEach((el) => {
      const { name } = el.dataset;
      if (name) {
        const curVal = this.getCheckboxValue(name);
        if (curVal !== null) {
          $(el).prop('checked', curVal);

          $(el).on('change', this.handleCheckboxChange);
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
    onFocusOut: (ev: JQuery.FocusOutEvent) => void,
  ) {
    const elem = this.getInputEl(optionName);
    if (elem === null) {
      throw new Error('elem is null');
    }

    this.updateTextInput(optionName);

    $(elem).on('focusout', onFocusOut);
  }

  private updateSecondValueInput() {
    const secValEl = this.getInputEl('value2');
    const secValElValue = this.getTextInputValue('value2');
    if (secValEl) {
      $(secValEl).val(secValElValue);
      $(secValEl).prop('disabled', !this.getCheckboxValue('isRange'));
    } else {
      throw new Error('Input with name `value2` is null');
    }
  }

  private handleCheckboxChange(evt: JQuery.ChangeEvent) {
    if (evt.target.dataset.name) {
      this.$slider.slider('changeOptions', {
        [evt.target.dataset.name]: evt.target.checked,
      });
      this.updateSecondValueInput();
    }
  }

  private handleValueInputFocusOut(optionName: 'value1' | 'value2') {
    const elem = this.getInputEl(optionName);
    if (elem === null) {
      throw new Error('elem is null');
    }

    const sliderValue = this.$slider.slider('value');
    const val = $(elem).val() === ''
        ? this.getTextInputValue(optionName)
        : Number($(elem).val());
    let newSliderValue: Value;

    if (Array.isArray(sliderValue)) {
      if (optionName === 'value1') {
        newSliderValue = [val, sliderValue[1]];
      } else {
        newSliderValue = [sliderValue[0], val];
      }
    } else {
      newSliderValue = val;
    }

    this.$slider.slider('changeOptions', {
      value: newSliderValue,
    });
  }

  private handleMinMaxInputFocusOut(ev: JQuery.FocusOutEvent) {
    const isValCorrect = $(ev.target).val() && !Number.isNaN(Number($(ev.target).val()));
    if (isValCorrect) {
      this.$slider.slider('changeOptions', {
        [ev.target.dataset.name]: Number($(ev.target).val()),
      });
    }
  }

  private handleStepSizeInputFocusOut(ev: JQuery.FocusOutEvent) {
    const val = $(ev.target).val() === ''
      ? this.getTextInputValue('stepSize')
      : Number($(ev.target).val());
    const isValCorrect = !Number.isNaN(val);
    if (isValCorrect) {
      this.$slider.slider('changeOptions', {
        stepSize: val,
      });
    }
  }

  private handleLengthInputFocusOut(ev: JQuery.FocusOutEvent) {
    const inputVal = String($(ev.target).val());
    const newVal = inputVal === ''
      ? this.getTextInputValue('length')
      : inputVal;
    if (newVal !== '') {
      this.$slider.slider('changeOptions', {
        length: newVal,
      });
    }
  }

  private handleScaleValueInputFocusOut(ev: JQuery.FocusOutEvent) {
    const val = String($(ev.target).val());
    let newScaleValue: number | Array<string | number>;
    if (val !== '') {
      const isValArr = val.indexOf(',') !== -1;
      if (isValArr) {
        newScaleValue = val.split(',');
      } else {
        const isValNum = !Number.isNaN(Number(val));
        if (isValNum) {
          newScaleValue = Number(val);
        } else {
          newScaleValue = [val];
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
  }
}

export default SliderConfig;
