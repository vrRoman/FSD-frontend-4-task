import {
  defaultModelOptions,
  defaultPresenterOptions,
  defaultViewOptions,
} from 'constants/defaultOptions';
import View, { IView } from 'View';
import Model, { IModel } from 'Model';

import Presenter from './Presenter';
import { IPresenter } from './Presenter.model';

let model: IModel;
let view: IView;
let presenter: IPresenter;
beforeEach(() => {
  model = new Model(defaultModelOptions);
  view = new View(defaultViewOptions, document.body);
  view.setModelData(defaultModelOptions);
  presenter = new Presenter(model, view, defaultPresenterOptions);
  view.getViewModel().changeData({ lengthInPx: 100 });
});

test('changeOptions change options of model', () => {
  presenter.changeOptions({
    value: 1,
  });
  expect(model.getData('value')).toBe(1);
});

test('changeOptions change options of view', () => {
  presenter.changeOptions({
    isVertical: true,
  });
  expect(view.getViewModel().getData('isVertical')).toBe(true);
});

test('changeOptions change options of presenter', () => {
  const emptyFunction = () => {};
  presenter.changeOptions({
    onChange: emptyFunction,
  });
  expect(presenter.onChange).toBe(emptyFunction);
});

test('changeOptions change options of model and view', () => {
  presenter.changeOptions({
    value: 1,
    isVertical: true,
  });
  expect(model.getData('value')).toBe(1);
  expect(view.getViewModel().getData('isVertical')).toBe(true);
});

test('it should pass data from the View to the Model', () => {
  view.setActiveThumb();
  view.getViews().thumb.moveActiveThumb(2);
  expect(model.getData('value')).toBe(2);
});

test('it should pass data from the View to the Model', () => {
  presenter.changeOptions({ hasScale: true });

  model.changeData({ value: 3 });
  const thumb = view.getElement('thumb');
  if (thumb instanceof HTMLElement) {
    expect(thumb.style.left).toBe('30px');
  }

  model.changeData({ isRange: true });
  expect(Array.isArray(view.getElement('thumb'))).toBe(true);

  model.changeData({ min: -2 });
  const firstScaleElement = view.getElement('scale').children[0];
  if (firstScaleElement instanceof HTMLElement) {
    expect(firstScaleElement.innerText).toBe('-2');
  }

  model.changeData({ max: 12 });
  const scale = view.getElement('scale');
  const lastScaleElement = scale.children[scale.children.length - 1];
  if (lastScaleElement instanceof HTMLElement) {
    expect(lastScaleElement.innerText).toBe('12');
  }

  model.changeData({ stepSize: 3 });
  expect(view.getViewModel().getData('modelData')?.stepSize).toBe(3);
});
