import IModel from '../../../modules/Model/interfacesAndTypes';
import { IViewModel } from '../../../modules/View/modules/ViewModel/interfacesAndTypes';

interface ISliderConfig {

}

class SliderConfig implements ISliderConfig {
  private readonly optionElSelector: string;
  private elem: HTMLElement;
  private $slider: JQuery;
  private optionsElements: Array<HTMLElement>;

  constructor(configElem: HTMLElement, sliderElem: HTMLElement) {
    this.elem = configElem;
    this.$slider = $(sliderElem);
    this.optionsElements = this.getOptionsElements();
    this.optionElSelector = '.option';

    this.init();
  }

  private initValueOptions() {
    const firstValueEl = this.getOptionEl('value1');
    const firstVal = this.getTextOptionValue('value1');
    const secValueEl = this.getOptionEl('value2');
    const secVal = this.getTextOptionValue('value2');

    if (!firstValueEl) {
      throw new Error('firstValueEl is null');
    }
    if (!secValueEl) {
      throw new Error('secValueEl is null');
    }

    $(firstValueEl).val(firstVal);
    $(secValueEl).val(secVal);

    $(firstValueEl).on('focusout', this.handleValueFocusout);
    $(secValueEl).on('focusout', this.handleValueFocusout);
  }

  private handleValueFocusout() {
    const firstElVal = this.getTextOptionValue('value1');
    if (Array.isArray(this.$slider.slider('value'))) {
      const secElVal = this.getTextOptionValue('value2');
      const isValuesValid = !Number.isNaN(Number(firstElVal)) && !Number.isNaN(Number(secElVal));
      if (isValuesValid) {
        this.$slider.slider('changeOptions', {
          value: [firstElVal, secElVal],
        });
      }
    } else {
      const isValValid = !Number.isNaN(Number(firstElVal));
      if (isValValid) {
        this.$slider.slider('changeOptions', {
          value: firstElVal,
        });
      }
    }
  }

  private getOptionsElements(): Array<HTMLElement> {
    const result: Array<HTMLElement> = [];
    const nodeList = this.elem.querySelectorAll(this.optionElSelector);
    nodeList.forEach((el) => {
      if (el instanceof HTMLElement) {
        result.push(el);
      }
    });

    return result;
  }

  private init() {
    this.initCheckboxes();
    this.initValueOptions();
  }

  private initCheckboxes() {
    this.optionsElements.forEach((el) => {
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

  private getTextOptionValue(
    optionName: 'value1' | 'value2' | 'stepSize' | 'min' | 'max'
  ): number
  // eslint-disable-next-line no-dupe-class-members
  private getTextOptionValue(optionName: 'length'): string
  // eslint-disable-next-line no-dupe-class-members
  private getTextOptionValue(optionName: 'scaleValue'): number | Array<number | string>
  // eslint-disable-next-line no-dupe-class-members
  private getTextOptionValue(optionName: string): number | string | Array<string | number> | null {
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
      this.updateSecondValueOptionEl();
    }
  }

  private getOptionEl(optionName: string): HTMLElement | null {
    let result: null | HTMLElement = null;
    this.optionsElements.forEach((el) => {
      if (el.dataset.name === optionName) {
        result = el;
      }
    });
    return result;
  }

  private updateSecondValueOptionEl() {
    const secValEl = this.getOptionEl('value2');
    const secValElValue = this.getTextOptionValue('value2');
    if (secValEl) {
      $(secValEl).val(secValElValue);
      $(secValEl).prop('disabled', this.getCheckboxValue('isRange'));
    } else {
      throw new Error('Option with name `value2` is null');
    }
  }
}

export default SliderConfig;
