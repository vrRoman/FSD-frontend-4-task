// Многие тесты для controller будут проверяться в браузере

import View, { IView, ViewOptions } from '../src/ui/View';
import Model, { IModel, ModelOptions } from '../src/model/Model';
import Controller, { IController, ControllerOptions } from '../src/ui/Controller';


const defaultModelOptions: ModelOptions = {
  value: 0,
  range: true,
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

    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
    controller.setActiveThumb(0);
    console.log('SetActiveThumb with range true', view.getSlider());
    expect(controller.getActiveThumb()).toBeDefined();
  });

  it('removeActiveThumb', () => {
    controller.setActiveThumb();
    controller.removeActiveThumb();
    console.log('RemoveActiveThumb range false: ', view.getSlider());
    expect(controller.getActiveThumb()).toBe(undefined);


    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
    controller.setActiveThumb(0);
    controller.removeActiveThumb();
    console.log('RemoveActiveThumb with range true', view.getSlider());
    expect(controller.getActiveThumb()).toBe(undefined);
  });
});




// let modelOptions: ModelOptions;
// let viewOptions: ViewOptions;
// let controllerOptions: ControllerOptions;
// let model: IModel;
// let view: IView;
// let controller: IController;
// //еще добавить при смене размера и responsive
// describe('Controller', () => {
//   beforeEach(() => {
//     modelOptions = {
//       value: 2,
//       range: false,
//       stepSize: 2,
//       min: 0,
//       max: 20,
//     };
//     viewOptions = {
//       length: '100%',
//       tooltip: false,
//       stepsInfo: false,
//       valueInfo: false,
//       vertical: false,
//       responsive: true,
//     };
//     controllerOptions = {
//       useKeyboard: true,
//     };
//     model = new Model(modelOptions);
//     view = new View(model, viewOptions, document.body);
//     controller = new Controller(model, view, controllerOptions);
//   });
//
//   it('initialized', () => {
//     expect(controller).toBeDefined();
//   });
//   it('getStepLength', () => {
//     expect(controller.getStepLength()).toBe(
//       view.getLength()
//       / ((model.getMax() - model.getMin()) / model.getStepSize()),
//     );
//   });
// });
