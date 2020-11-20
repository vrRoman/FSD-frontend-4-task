// Многие тесты для controller будут проверяться в браузере

import View, { IView, ViewOptions } from '../src/ui/View';
import Model, { IModel, ModelOptions } from '../src/model/Model';
import Controller, { IController, ControllerOptions } from '../src/ui/Controller';

let modelOptions: ModelOptions;
let viewOptions: ViewOptions;
let controllerOptions: ControllerOptions;
let model: IModel;
let view: IView;
let controller: IController;
//еще добавить при смене размера и responsive
describe('Controller', () => {
  beforeEach(() => {
    modelOptions = {
      value: 2,
      range: false,
      stepSize: 2,
      min: 0,
      max: 20,
    };
    viewOptions = {
      length: '100%',
      tooltip: false,
      stepsInfo: false,
      valueInfo: false,
      vertical: false,
      responsive: true,
    };
    controllerOptions = {
      useKeyboard: true,
    };
    model = new Model(modelOptions);
    view = new View(model, viewOptions, document.body);
    controller = new Controller(model, view, controllerOptions);
  });

  it('initialized', () => {
    expect(controller).toBeDefined();
  });
  it('getStepLength', () => {
    expect(controller.getStepLength()).toBe(
      view.getLength()
      / ((model.getMax() - model.getMin()) / model.getStepSize()),
    );
  });
});
