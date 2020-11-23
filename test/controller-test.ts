// Многие тесты для controller будут проверяться в браузере

import Model from '../src/model/Model';
import View from '../src/ui/View';
import Controller from '../src/ui/Controller';
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
};
const defaultControllerOptions: ControllerOptions = {
  useKeyboard: true,
  interactiveStepsInfo: true,
};


describe('Controller methods', () => {
  let model: IModel;
  let view: IView;
  let controller: IController;
  beforeEach(() => {
    model = new Model(defaultModelOptions);
    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
  });

  it('getUseKeyboard', () => {
    expect(controller.getUseKeyboard()).toBe(true);
  });
  it('getInteractiveStepsInfo', () => {
    expect(controller.getInteractiveStepsInfo()).toBe(true);
  });
  it('getStepLength', () => {
    expect(controller.getStepLength()).toBe(20);
  });


  it('addStepsInfoInteractivity', () => {
    view = new View(model, {
      ...defaultViewOptions,
      stepsInfo: true,
    }, document.body);
    controller = new Controller(model, view, {
      ...defaultControllerOptions,
      interactiveStepsInfo: false,
    });
    controller.addStepsInfoInteractivity();
    // console.log для проверки в браузере
    console.log('Added stepsInfo interactivity: ', view.getSlider());
    expect(controller.getInteractiveStepsInfo()).toBe(true);
  });

  it('removeStepsInfoInteractivity', () => {
    view.createStepsInfo();
    controller.removeStepsInfoInteractivity();
    console.log('Removed stepsInfo interactivity: ', view.getSlider());
    expect(controller.getInteractiveStepsInfo()).toBe(false);
  });

  it('addKeyboardListener', () => {
    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, {
      ...defaultControllerOptions,
      useKeyboard: false,
    });
    controller.addKeyboardListener();
    console.log('Added keyboard listener: ', view.getSlider());
    expect(controller.getUseKeyboard()).toBe(true);
  });
  it('removeKeyboardListener', () => {
    controller.removeKeyboardListener();
    console.log('Removed keyboard listener: ', view.getSlider());
    expect(controller.getUseKeyboard()).toBe(false);
  });


  it('setActiveThumb', () => {
    controller.setActiveThumb();
    console.log('SetActiveThumb range false: ', view.getSlider());
    expect(controller.getActiveThumb()).toBeDefined();

    model = new Model(defaultModelOptions);
    model.setRange(true);
    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
    controller.setActiveThumb();
    console.log('SetActiveThumb with range true', view.getSlider());
    expect(controller.getActiveThumb()).toBeDefined();
  });

  it('removeActiveThumb', () => {
    controller.setActiveThumb();
    controller.removeActiveThumb();
    console.log('RemoveActiveThumb range false: ', view.getSlider());
    expect(controller.getActiveThumb()).toBe(undefined);

    model = new Model({
      ...defaultModelOptions,
      range: true,
    });
    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
    controller.setActiveThumb();
    controller.removeActiveThumb();
    console.log('RemoveActiveThumb with range true', view.getSlider());
    expect(controller.getActiveThumb()).toBe(undefined);
  });
});

describe('Controller with different options in model and view', () => {
  let model: IModel;
  let view: IView;
  let controller: IController;

  it('View all true, vertical=false and responsive with %', () => {
    model = new Model({
      ...defaultModelOptions,
      min: -2,
    });
    view = new View(model, {
      length: '80%',
      vertical: false,
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
    }, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
    console.log('View all true, vertical=false and responsive with %: ', view.getSlider());
  });
  it('View all true, vertical=false and responsive with vh', () => {
    model = new Model(defaultModelOptions);
    view = new View(model, {
      length: '30vh',
      vertical: true,
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
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
    view = new View(model, {
      length: '80%',
      vertical: false,
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
    }, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
  });

  it('onChange', () => {
    model = new Model(defaultModelOptions);
    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, {
      ...defaultControllerOptions,
      onChange: () => {
        console.log(model.getValue());
      },
    });
    console.log('onChange: ', view.getSlider());
  });
});
