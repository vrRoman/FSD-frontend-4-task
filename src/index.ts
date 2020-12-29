import './styles/main.scss';


import Model from './Model';
import { IModel } from './interfacesAndTypes/modelTypesAndInterfaces';
import View from './View';
import { IView } from './interfacesAndTypes/viewInterfaces';
import Presenter from './Presenter';
import { IPresenter } from './interfacesAndTypes/presenterInterfaces';

import { SliderOptions, SliderOptionsOptionalParams } from './interfacesAndTypes/options';


declare global {
  // eslint-disable-next-line
  interface JQuery {
    slider: (
      options?: SliderOptionsOptionalParams | 'changeOptions',
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
    interactiveStepsInfo: false,
  };

  // eslint-disable-next-line no-param-reassign
  $.fn.slider = function start(options?: SliderOptionsOptionalParams | 'changeOptions' | 'value' | 'model' | 'view' | 'presenter',
                               newOptions?: SliderOptionsOptionalParams) {
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
    if (options === 'changeOptions' && newOptions) {
      this.data('presenter').changeOptions(newOptions);
    } else if (options === 'value') {
      return this.data('model').getValue();
    } else if (options === 'model') {
      return this.data('model');
    } else if (options === 'view') {
      return this.data('view');
    } else if (options === 'presenter') {
      return this.data('presenter');
    }
    return this;
  };
}(jQuery));
