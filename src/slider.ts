import Model from './modules/Model/Model';
import IModel, { Value } from './modules/Model/interfacesAndTypes';
import View from './modules/View/modules/View/View';
import IView from './modules/View/modules/View/interfaces';
import { IViewModel } from './modules/View/modules/ViewModel/interfacesAndTypes';
import { IObserver } from './ObserverAndSubject/interfacesAndTypes';
import Presenter from './modules/Presenter/Presenter';
import IPresenter from './modules/Presenter/interface';
import { SliderOptions, SliderOptionsOptionalParams } from './options/options';

declare global {
  // eslint-disable-next-line
  interface JQuery {
    slider(options?: SliderOptionsOptionalParams): JQuery
    slider(action: 'changeOptions', newOptions: SliderOptionsOptionalParams): JQuery
    slider(action: 'subscribe', observer: IObserver): JQuery
    slider(action: 'value'): Value
    slider(action: 'model'): IModel
    slider(action: 'view'): IView
    slider(action: 'viewModel'): IViewModel
    slider(action: 'presenter'): IPresenter
  }
}

(function initialization($) {
  const defaultOptions: SliderOptions = {
    value: 0,
    isRange: false,
    stepSize: 1,
    min: 0,
    max: 10,

    length: '100%',
    hasTooltip: false,
    hasScale: false,
    scaleValue: 3,
    hasValueInfo: false,
    isVertical: false,
    isResponsive: false,

    useKeyboard: true,
    isScaleClickable: false,
  };

  // eslint-disable-next-line no-param-reassign
  $.fn.slider = function start(
    action?: SliderOptionsOptionalParams
    | 'changeOptions' | 'subscribe' | 'value' | 'model' | 'view' | 'viewModel' | 'presenter',
    additionalInfo?: SliderOptionsOptionalParams | IObserver,
  ) {
    if (typeof action === 'object' || !action) {
      if (this.data('slider')) {
        $.error('Slider has already been called for this element');
      }

      return this.each(function init() {
        const settings = {
          ...defaultOptions,
          ...action,
        };

        const model: IModel = new Model(settings);
        const view: IView = new View(settings, this);
        const presenter: IPresenter = new Presenter(model, view, settings);

        const slider = view.getElem('slider');
        if (slider) {
          $(this).data('slider', slider);
        } else {
          $(this).data('slider', false);
        }
        $(this).data('model', model);
        $(this).data('view', view);
        $(this).data('viewModel', view.getViewModel());
        $(this).data('presenter', presenter);
      });
    }
    if (action === 'changeOptions') {
      this.data('presenter').changeOptions(additionalInfo);
      return this;
    }
    if (action === 'subscribe') {
      if (additionalInfo) {
        $(this).data('model').subscribe(additionalInfo);
        $(this).data('viewModel').subscribe(additionalInfo);
      }
    }
    if (action === 'value') {
      return this.data('model').getValue();
    }
    if (action === 'model') {
      return this.data('model');
    }
    if (action === 'view') {
      return this.data('view');
    }
    if (action === 'viewModel') {
      return this.data('viewModel');
    }
    if (action === 'presenter') {
      return this.data('presenter');
    }
    return this;
  };
}(jQuery));
