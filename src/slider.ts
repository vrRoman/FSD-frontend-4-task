import Model, { IModel, Value } from 'Model';
import View, { IView } from 'View';
import { IViewModel } from 'View/ViewModel';
import Presenter, { IPresenter } from 'Presenter';
import type { SliderOptionsPartial } from 'Presenter';
import { IObserver } from 'ObserverAndSubject';
import { defaultSliderOptions } from 'defaults/defaultOptions';

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
      return this.data('model').getData('value');
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
