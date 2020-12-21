// Многие тесты для controller будут проверяться в браузере

import Model from '../src/Model';
import View from '../src/View';
import Controller from '../src/Controller';
import { IModel } from '../src/interfaces/modelTypesAndInterfaces';
import { IView } from '../src/interfaces/viewInterfaces';
import { IController } from '../src/interfaces/controllerInterfaces';
import { ControllerOptions, ViewOptions, ModelOptions } from '../src/interfaces/options';


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
const defaultControllerOptions: ControllerOptions = {
};

describe('Controller with different options in model and view', () => {
  let model: IModel;
  let view: IView;
  let controller: IController;

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
    controller = new Controller(model, view, defaultControllerOptions);
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
    controller = new Controller(model, view, defaultControllerOptions);
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
    controller = new Controller(model, view, defaultControllerOptions);
  });

  it('onChange', () => {
    model = new Model(defaultModelOptions);
    view = new View(defaultViewOptions, document.body);
    controller = new Controller(model, view, {
      ...defaultControllerOptions,
      onChange: () => {
        console.log(model.getValue());
      },
    });
    console.log('onChange: ', view.getSlider());
  });
});
