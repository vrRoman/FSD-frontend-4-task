import Model from 'Model/Model';
import IModel, { Value } from 'Model/interfacesAndTypes';
import View from 'View/modules/View/View';
import IView from 'View/modules/View/interfacesAndTypes';
import { IViewModel } from 'View/modules/ViewModel/interfacesAndTypes';
import { IObserver } from 'ObserverAndSubject/interfacesAndTypes';
import Presenter from 'Presenter/Presenter';
import IPresenter from 'Presenter/interface';
import { SliderOptionsPartial } from 'options/options';
import { defaultSliderOptions } from 'options/defaultOptions';

declare global {
  // eslint-disable-next-line
  interface JQuery {
    slider(options?: SliderOptionsPartial): JQuery
    slider(action: 'changeOptions', newOptions: SliderOptionsPartial): JQuery
    slider(action: 'subscribe', observer: IObserver): JQuery
    slider(action: 'value'): Value
    slider(action: 'model'): IModel
    slider(action: 'view'): IView
    slider(action: 'viewModel'): IViewModel
    slider(action: 'presenter'): IPresenter
  }
}

(function initialization($) {
  // eslint-disable-next-line no-param-reassign
  $.fn.slider = function start(
    action?: SliderOptionsPartial
    | 'changeOptions' | 'subscribe' | 'value' | 'model' | 'view' | 'viewModel' | 'presenter',
    additionalInfo?: SliderOptionsPartial | IObserver,
  ) {
    if (typeof action === 'object' || !action) {
      if (this.data('slider')) {
        $.error('Slider has already been called for this element');
      }

      return this.each(function init() {
        const settings = {
          ...defaultSliderOptions,
          ...action,
        };

        const model: IModel = new Model(settings);
        const view: IView = new View(settings, this);
        const presenter: IPresenter = new Presenter(model, view, settings);

        const slider = view.getElement('slider');
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
