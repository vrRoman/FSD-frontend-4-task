import './styles/main.scss';


import Model from './Model';
import { IModel } from './interfacesAndTypes/modelTypesAndInterfaces';
import View from './View';
import { IView } from './interfacesAndTypes/viewInterfaces';
import Presenter from './Presenter';
import { IPresenter } from './interfacesAndTypes/presenterInterfaces';

import { SliderOptions } from './interfacesAndTypes/options';

// копия SliderOptions, но с необязательными параметрами
interface Options {
  value?: [number, number] | number
  range?: boolean
  stepSize?: number
  max?: number
  min?: number
  length?: string
  tooltip?: boolean
  stepsInfo?: boolean | Array<number | string> | number
  valueInfo?: boolean
  vertical?: boolean
  responsive?: boolean
  sliderClass?: string | string[]
  sliderVerticalClass?: string | string[]
  barClass?: string | string[]
  progressBarClass?: string | string[]
  thumbClass?: string | string[]
  activeThumbClass?: string | string[]
  tooltipClass?: string | string[]
  stepsInfoClass?: string | string[]
  valueInfoClass?: string | string[]
  useKeyboard?: boolean
  interactiveStepsInfo?: boolean
  onChange?: Function
}

type OptionsString = 'destroy' | 'value' | 'range' | 'stepSize' | 'max' | 'min'
  | 'length' | 'tooltip' | 'stepsInfo' | 'valueInfo' | 'vertical' | 'responsive'
  | 'useKeyboard' | 'interactiveStepsInfo' | 'onChange'
  | 'model' | 'view' | 'presenter';

declare global {
  // eslint-disable-next-line
  interface JQuery {
    slider: (
      options?: Options | OptionsString,
      otherOptions?: any
    ) => JQuery<Element> | JQuery<Object> | number | number[] | boolean | undefined
  }
}



(function initialization($) {
  const defaultOptions: SliderOptions = {
    value: 0,
    range: false,
    stepSize: 1,
    min: 0,
    max: 10,

    length: '100%',
    tooltip: false,
    stepsInfo: false,
    valueInfo: false,
    vertical: false,
    responsive: false,

    useKeyboard: true,
    interactiveStepsInfo: true,
  };

  // eslint-disable-next-line no-param-reassign
  $.fn.slider = function start(options?: Options | OptionsString, otherOptions?: any) {
    if (typeof options === 'object' || !options) {
      if (this.data('slider')) {
        $.error('Slider has already been called for this element');
      }

      return this.each(function init() {
        const settings = {
          ...defaultOptions,
          ...options,
        };

        const model: IModel = new Model(settings);
        const view: IView = new View(settings, this);
        const presenter: IPresenter = new Presenter(model, view, settings);

        const slider = view.getSlider();
        if (slider) {
          $(this).data('slider', slider);
        } else {
          $(this).data('slider', false);
        }
        $(this).data('model', model);
        $(this).data('view', view);
        $(this).data('presenter', presenter);
      });
    }
    if (otherOptions !== undefined) {
      switch (options) {
        case 'destroy':
          return this.each(function destroy() {
            $(this).data('slider').remove();
            $(this).removeData('slider');
            $(this).removeData('model');
            $(this).removeData('view');
            $(this).removeData('presenter');
          });
        case 'value':
          return this.each(function changeValue() {
            $(this).data('model').setValue(otherOptions);
          });
        case 'range':
          return this.each(function changeRange() {
            $(this).data('model').setRange(otherOptions);
          });
        case 'stepSize':
          return this.each(function changeStepSize() {
            $(this).data('model').setStepSize(otherOptions);
          });
        case 'max':
          return this.each(function changeMax() {
            $(this).data('model').setMax(otherOptions);
          });
        case 'min':
          return this.each(function changeMin() {
            $(this).data('model').setMin(otherOptions);
          });
        case 'length':
          return this.each(function changeLength() {
            $(this).data('view').changeLength(otherOptions);
          });
        case 'tooltip':
          return this.each(function changeTooltip() {
            if (otherOptions === true && !$(this).data('view').getTooltip()) {
              $(this).data('view').createTooltip();
            } else if (otherOptions === false && $(this).data('view').getTooltip()) {
              $(this).data('view').removeTooltip();
            }
          });
        case 'stepsInfo':
          return this.each(function changeStepsInfo() {
            $(this).data('view').changeStepsInfoSettings(otherOptions);
          });
        case 'valueInfo':
          return this.each(function changeValueInfo() {
            if (otherOptions === true && !$(this).data('view').getValueInfo()) {
              $(this).data('view').createValueInfo();
            } else if (otherOptions === false && $(this).data('view').getValueInfo()) {
              $(this).data('view').removeValueInfo();
            }
          });
        case 'vertical':
          return this.each(function changeVertical() {
            $(this).data('view').changeVertical(otherOptions);
          });
        case 'responsive':
          return this.each(function changeResponsive() {
            $(this).data('view').changeResponsive(otherOptions);
          });
        case 'useKeyboard':
          return this.each(function changeUseKeyboard() {
            if (otherOptions === true && !$(this).data('view').getUseKeyboard()) {
              $(this).data('view').addKeyboardListener();
            } else if (otherOptions === false && $(this).data('view').getUseKeyboard()) {
              $(this).data('view').removeKeyboardListener();
            }
          });
        case 'interactiveStepsInfo':
          return this.each(function changeInteractiveStepsInfo() {
            if (otherOptions === true && !$(this).data('view').getInteractiveStepsInfo()) {
              $(this).data('view').addStepsInfoInteractivity();
            } else if (otherOptions === false && $(this).data('view').getInteractiveStepsInfo()) {
              $(this).data('view').removeStepsInfoInteractivity();
            }
          });
        case 'onChange':
          return this.each(function changeOnChange() {
            // eslint-disable-next-line no-param-reassign
            $(this).data('presenter').onChange = otherOptions;
          });
        default:
          $.error(`${options} option not found`);
      }
    } else {
      switch (options) {
        case 'model':
          return this.data('model');
        case 'view':
          return this.data('view');
        case 'presenter':
          return this.data('presenter');
        case 'value':
          return this.data('model').getValue();
        case 'range':
          return this.data('model').getRange();
        case 'stepSize':
          return this.data('model').getStepSize();
        case 'min':
          return this.data('model').getMin();
        case 'max':
          return this.data('model').getMax();
        case 'vertical':
          return this.data('view').getVertical();
        case 'responsive':
          return this.data('view').getResponsive();
        case 'tooltip':
          return this.data('view').getTooltip();
        case 'stepsInfo':
          return this.data('view').getStepsInfo();
        case 'valueInfo':
          return this.data('view').getValueInfo();
        case 'useKeyboard':
          return this.data('view').getUseKeyboard();
        case 'interactiveStepsInfo':
          return this.data('view').getInteractiveStepsInfo();
        default:
          $.error(`No ${options} value`);
      }
    }
    return this;
  };
}(jQuery));
