// Многие тесты для presenter будут проверяться в браузере

import Model from '../src/Model';
import View from '../src/View';
import Presenter from '../src/Presenter';
import { IModel } from '../src/interfacesAndTypes/modelTypesAndInterfaces';
import { IView } from '../src/interfacesAndTypes/viewInterfaces';
import { IPresenter } from '../src/interfacesAndTypes/presenterInterfaces';
import { PresenterOptions, ViewOptions, ModelOptions } from '../src/interfacesAndTypes/options';


const defaultModelOptions: ModelOptions = {
  value: 0,
  range: false,
  stepSize: 1,
  min: 0,
  max: 10,
};
const defaultViewOptions: ViewOptions = {
  length: '200px',
  tooltip: false,
  stepsInfo: false,
  valueInfo: false,
  vertical: false,
  responsive: false,
  useKeyboard: true,
  interactiveStepsInfo: true,
};
const defaultPresenterOptions: PresenterOptions = {
};

describe('Presenter with different options in model and view', () => {
  let model: IModel;
  let view: IView;
  let presenter: IPresenter;

  it('View all true, vertical=false and responsive with %', () => {
    model = new Model({
      ...defaultModelOptions,
      min: -2,
    });
    view = new View({
      length: '80%',
      vertical: false,
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
      interactiveStepsInfo: true,
      useKeyboard: true,
    }, document.body);
    presenter = new Presenter(model, view, defaultPresenterOptions);
    console.log('View all true, vertical=false and responsive with %: ', view.getSlider());
  });
  it('View all true, vertical=false and responsive with vh', () => {
    model = new Model(defaultModelOptions);
    view = new View({
      length: '30vh',
      vertical: true,
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
      interactiveStepsInfo: true,
      useKeyboard: true,
    }, document.body);
    presenter = new Presenter(model, view, defaultPresenterOptions);
  });
  it('model range true, stepSize', () => {
    model = new Model({
      value: [2, 8.25],
      range: true,
      stepSize: 3.5,
      min: 0,
      max: 12,
    });
    view = new View({
      length: '80%',
      vertical: false,
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
      interactiveStepsInfo: true,
      useKeyboard: true,
    }, document.body);
    presenter = new Presenter(model, view, defaultPresenterOptions);
  });

  it('onChange', () => {
    model = new Model(defaultModelOptions);
    view = new View(defaultViewOptions, document.body);
    presenter = new Presenter(model, view, {
      ...defaultPresenterOptions,
      onChange: () => {
        console.log(model.getValue());
      },
    });
    console.log('onChange: ', view.getSlider());
  });
});
