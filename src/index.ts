import './styles/main.scss';


import Model from './model/Model';
import { IModel } from './interfaces/modelTypesAndInterfaces';
import View from './ui/View';
import { IView } from './interfaces/viewInterfaces';
import Controller from './ui/Controller';
import { IController } from './interfaces/controllerInterfaces';

import { SliderOptions } from './interfaces/options';

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
  | 'model' | 'view' | 'controller';

declare global {
  // eslint-disable-next-line
  interface JQuery {
    slider: (
      options?: Options | OptionsString,
      otherOptions?: any
    ) => JQuery<Element> | JQuery<Object> | number | number[] | boolean
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
        const view: IView = new View(model, settings, this);
        const controller: IController = new Controller(model, view, settings);

        $(this).data('slider', view.getSlider());
        $(this).data('model', model);
        $(this).data('view', view);
        $(this).data('controller', controller);
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
            $(this).removeData('controller');
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
            if (otherOptions === true && !$(this).data('controller').getUseKeyboard()) {
              $(this).data('controller').addKeyboardListener();
            } else if (otherOptions === false && $(this).data('controller').getUseKeyboard()) {
              $(this).data('controller').removeKeyboardListener();
            }
          });
        case 'interactiveStepsInfo':
          return this.each(function changeInteractiveStepsInfo() {
            if (otherOptions === true && !$(this).data('controller').getInteractiveStepsInfo()) {
              $(this).data('controller').addStepsInfoInteractivity();
            } else if (otherOptions === false && $(this).data('controller').getInteractiveStepsInfo()) {
              $(this).data('controller').removeStepsInfoInteractivity();
            }
          });
        case 'onChange':
          return this.each(function changeOnChange() {
            // eslint-disable-next-line no-param-reassign
            $(this).data('controller').onChange = otherOptions;
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
        case 'controller':
          return this.data('controller');
        case 'value':
          return this.data('model').getValue();
        case 'range':
          return this.data('model').getRange();
        case 'min':
          return this.data('model').getMin();
        case 'max':
          return this.data('model').getMax();
        default:
          $.error(`No ${options} value`);
      }
    }
    return this;
  };
}(jQuery));
