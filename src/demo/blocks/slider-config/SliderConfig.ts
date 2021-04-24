import IModel from '../../../modules/Model/interfacesAndTypes';
import { IViewModel } from '../../../modules/View/modules/ViewModel/interfacesAndTypes';
import FocusOutEvent = JQuery.FocusOutEvent;

class SliderConfig {
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

  private initTextInputs() {
    this.initValueInputs();

    this.initMinMaxInputs();

    this.initStepSizeInput();

    this.initLengthInput();

    this.initScaleValueInput();
  }

  private handleScaleValueInputFocusOut(ev: FocusOutEvent) {
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

  private initScaleValueInput() {
    const scaleValueEl = this.getInputEl('scaleValue');
    if (scaleValueEl) {
      const curVal = this.getTextInputValue('scaleValue');
      const val = Array.isArray(curVal)
          ? curVal.map((el) => String(el))
          : curVal;

      $(scaleValueEl).val(val);
      $(scaleValueEl).on('focusout', this.handleScaleValueInputFocusOut);
    }
  }

  private handleLengthInputFocusOut(ev: FocusOutEvent) {
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

  private initLengthInput() {
    const lengthEl = this.getInputEl('length');
    if (lengthEl) {
      $(lengthEl).val(this.getTextInputValue('length'));
      $(lengthEl).on('focusout', this.handleLengthInputFocusOut);
    }
  }

  private handleStepSizeInputFocusOut(ev: FocusOutEvent) {
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

  private initStepSizeInput() {
    const stepSizeEl = this.getInputEl('stepSize');
    if (stepSizeEl) {
      $(stepSizeEl).val(this.getTextInputValue('stepSize'));
      $(stepSizeEl).on('focusout', this.handleStepSizeInputFocusOut);
    }
  }

  private initMinMaxInputs() {
    const minEl = this.getInputEl('min');
    const maxEl = this.getInputEl('max');

    if (minEl) {
      if (maxEl) {
        $(minEl).val(this.getTextInputValue('min'));
        $(maxEl).val(this.getTextInputValue('max'));
        $(minEl).on('focusout', this.handleMinMaxInputFocusOut);
        $(maxEl).on('focusout', this.handleMinMaxInputFocusOut);
      } else {
        throw new Error('maxEl is null');
      }
    } else {
      throw new Error('minEl is null');
    }
  }

  private handleMinMaxInputFocusOut(ev: FocusOutEvent) {
    const isValCorrect = $(ev.target).val() && !Number.isNaN(Number($(ev.target).val()));
    if (isValCorrect) {
      this.$slider.slider('changeOptions', {
        [ev.target.dataset.name]: Number($(ev.target).val()),
      });
    }
  }

  private initValueInputs() {
    const firstValueEl = this.getInputEl('value1');
    const firstVal = this.getTextInputValue('value1');
    const secValueEl = this.getInputEl('value2');
    const secVal = this.getTextInputValue('value2');

    if (!firstValueEl) {
      throw new Error('firstValueEl is null');
    }
    if (!secValueEl) {
      throw new Error('secValueEl is null');
    }

    $(firstValueEl).val(firstVal);
    $(secValueEl).val(secVal);

    $(firstValueEl).on('focusout', this.handleValueInputFocusOut);
    $(secValueEl).on('focusout', this.handleValueInputFocusOut);

    this.updateSecondValueInputEl();
  }

  private handleValueInputFocusOut() {
    const firstEl = this.getInputEl('value1');
    if (firstEl) {
      const firstVal = $(firstEl).val() !== ''
          ? Number($(firstEl).val())
          : this.getTextInputValue('value1');
      if (Array.isArray(this.$slider.slider('value'))) {
        const secEl = this.getInputEl('value2');
        if (secEl) {
          const secVal = $(secEl).val() !== ''
              ? Number($(secEl).val())
              : this.getTextInputValue('value2');
          const isValuesValid = !Number.isNaN(firstVal) && !Number.isNaN(secVal);
          if (isValuesValid) {
            this.$slider.slider('changeOptions', {
              value: [firstVal, secVal],
            });
          }
        }
      } else {
        const isValValid = !Number.isNaN(Number(firstVal));
        if (isValValid) {
          this.$slider.slider('changeOptions', {
            value: firstVal,
          });
        }
      }
    }
  }

  private getInputElements(): Array<HTMLElement> {
    const result: Array<HTMLElement> = [];
    const nodeList = this.elem.querySelectorAll<HTMLElement>(this.inputElSelector);
    nodeList.forEach((el) => {
      result.push(el);
    });

    return result;
  }

  private init() {
    this.initCheckboxes();
    this.initTextInputs();
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

  private getCheckboxValue(optionName: string): boolean | null {
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

  private getTextInputValue(
    optionName: 'value1' | 'value2' | 'stepSize' | 'min' | 'max'
  ): number
  // eslint-disable-next-line no-dupe-class-members
  private getTextInputValue(optionName: 'length'): string
  // eslint-disable-next-line no-dupe-class-members
  private getTextInputValue(optionName: 'scaleValue'): number | Array<number | string>
  // eslint-disable-next-line no-dupe-class-members
  private getTextInputValue(optionName: string): number | string | Array<string | number> | null {
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

  private handleCheckboxChange(evt: JQuery.ChangeEvent) {
    if (evt.target.dataset.name) {
      this.$slider.slider('changeOptions', {
        [evt.target.dataset.name]: evt.target.checked,
      });
      this.updateSecondValueInputEl();
    }
  }

  private getInputEl(optionName: string): HTMLElement | null {
    let result: null | HTMLElement = null;
    this.inputElements.forEach((el) => {
      if (el.dataset.name === optionName) {
        result = el;
      }
    });
    return result;
  }

  private updateSecondValueInputEl() {
    const secValEl = this.getInputEl('value2');
    const secValElValue = this.getTextInputValue('value2');
    if (secValEl) {
      $(secValEl).val(secValElValue);
      $(secValEl).prop('disabled', !this.getCheckboxValue('isRange'));
    } else {
      throw new Error('Input with name `value2` is null');
    }
  }
}

export default SliderConfig;
