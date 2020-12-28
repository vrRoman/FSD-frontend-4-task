// Многие тесты для view будут проверяться в браузере

import Model from '../src/Model';
import View from '../src/View';
import { IModel } from '../src/interfaces/modelTypesAndInterfaces';
import { IView } from '../src/interfaces/viewInterfaces';
import { ViewOptions, ModelOptions } from '../src/interfaces/options';
import Presenter from '../src/Presenter';
import { IPresenter } from '../src/interfaces/presenterInterfaces';

const defaultViewOptionsWithClass: ViewOptions = {
  length: '200px',
  tooltip: false,
  stepsInfo: false,
  valueInfo: false,
  vertical: false,
  responsive: false,
  interactiveStepsInfo: true,
  useKeyboard: true,
  sliderClass: ['slider'],
  sliderVerticalClass: ['slider_vertical', 'slider_vertical_some-class'],
  barClass: ['slider__bar', 'slider__bar_some-class'],
  progressBarClass: ['slider__progress-bar', 'slider__progress-bar_some-class'],
  thumbClass: ['slider__thumb', 'slider__thumb_some-class'],
  activeThumbClass: ['slider__thumb_active', 'slider__thumb_active_some-class'],
  tooltipClass: ['slider__tooltip', 'slider__tooltip_some-class'],
  stepsInfoClass: ['slider__steps-info', 'slider__steps-info_some-class'],
  valueInfoClass: ['slider__value-info', 'slider__value-info_some-class'],
};

const defaultModelOptions: ModelOptions = {
  value: 0,
  range: false,
  stepSize: 1,
  min: 0,
  max: 10,
};


describe('View with different options and get slider elements methods', () => {
  let model: IModel;
  beforeEach(() => {
    model = new Model(defaultModelOptions);
  });


  it('length in % with all elements and responsive', () => {
    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      length: '90%',
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
    };
    model.setValue(2);
    const view = new View(viewOptions, document.body);
    expect(view).toBeDefined();
  });
  it('vertical and responsive with vh', () => {
    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      length: '20vh',
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      vertical: true,
      responsive: true,
    };
    model.setRange(true);
    model.setValue([3, 7.25]);
    const view = new View(viewOptions, document.body);
    expect(view).toBeDefined();
  });


  it('getParent', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);

    console.log('Parent: ', view.getParent());
    expect(view.getParent()).toBeDefined();
  });
  it('getSlider', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});

    console.log('Slider: ', view.getSlider());
    expect(view.getSlider()).toBeDefined();
  });
  it('getBar', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});

    console.log('Bar: ', view.getBar());
    expect(view.getBar()).toBeDefined();
  });
  it('getProgressBar range false', () => {
    model.setValue(3);
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});
    console.log('ProgressBar range=false', view.getProgressBar());
    expect(view.getProgressBar()).toBeDefined();
  });
  it('getProgressBar range true', () => {
    model.setRange(true);
    model.setValue([3, 5]);
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});
    console.log('ProgressBar range=true: ', view.getProgressBar());
    expect(view.getProgressBar()).toBeDefined();
  });

  it('getThumb, range false', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});
    console.log('Thumb not array: ', view.getThumb());
    expect(view.getThumb()).toBeDefined();
  });
  it('getThumb, range true', () => {
    model.setRange(true);
    model.setValue([0, 2]);
    const view: IView = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});
    console.log('Thumb array: ', view.getThumb());
    expect(Array.isArray(view.getThumb())).toBe(true);
  });
  it('getTooltip returns undefined when options.tooltip = false, and vice versa,'
    + 'when range true returns array', () => {
    let view = new View(defaultViewOptionsWithClass, document.body);
    let presenter = new Presenter(model, view, {});
    expect(view.getTooltip()).toBe(undefined);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      tooltip: true,
    };
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    console.log('Tooltip not array: ', view.getTooltip());
    expect(view.getTooltip()).toBeDefined();

    model = new Model(defaultModelOptions);
    model.setRange(true);
    model.setValue([1, 6]);
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    console.log('Tooltip array: ', view.getTooltip());
    expect(Array.isArray(view.getTooltip())).toBe(true);
  });
  it('getStepsInfo when options.stepsInfo=false and true', () => {
    let view = new View(defaultViewOptionsWithClass, document.body);
    let presenter = new Presenter(model, view, {});
    expect(view.getStepsInfo()).toBe(undefined);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      stepsInfo: true,
    };
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    console.log('StepsInfo: ', view.getStepsInfo());
    expect(view.getStepsInfo()).toBeDefined();
  });
  it('getValueInfo when options.valueInfo=false and true', () => {
    let view = new View(defaultViewOptionsWithClass, document.body);
    let presenter = new Presenter(model, view, {});
    expect(view.getValueInfo()).toBe(undefined);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      valueInfo: true,
    };
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    console.log('ValueInfo: ', view.getValueInfo());
    expect(view.getValueInfo()).toBeDefined();
  });
});

describe('View get values', () => {
  let model: IModel;
  let view: IView;
  let presenter: IPresenter;
  beforeEach(() => {
    model = new Model(defaultModelOptions);
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
  });


  it('getUseKeyboard', () => {
    expect(view.getUseKeyboard()).toBe(true);
  });
  it('getInteractiveStepsInfo', () => {
    expect(view.getInteractiveStepsInfo()).toBe(true);
  });
  it('getStepLength', () => {
    expect(view.getStepLength()).toBe(20);
  });
  it('getResponsive', () => {
    expect(view.getResponsive()).toBe(false);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      responsive: true,
    };
    view = new View(viewOptions, document.body);
    expect(view.getResponsive()).toBe(true);
  });
  it('getThumbPosition', () => {
    expect(view.getThumbPosition()).toBe(0);

    model.setRange(true);
    model.setValue([2, 6]);
    expect(view.getThumbPosition()).toEqual([40, 120]);
  });
  it('getStepsInfoSettings', () => {
    expect(view.getStepsInfoSettings()).toBe(false);

    let viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      stepsInfo: true,
    };
    view = new View(viewOptions, document.body);
    expect(view.getStepsInfoSettings()).toBe(true);

    viewOptions = {
      ...defaultViewOptionsWithClass,
      stepsInfo: 7,
    };
    view = new View(viewOptions, document.body);
    expect(view.getStepsInfoSettings()).toBe(7);

    viewOptions = {
      ...defaultViewOptionsWithClass,
      stepsInfo: [1, '5', 'end'],
    };
    view = new View(viewOptions, document.body);
    expect(view.getStepsInfoSettings()).toEqual([1, '5', 'end']);
  });
  it('getLength', () => {
    expect(view.getLength()).toBe(200);

    const viewOptions = {
      ...defaultViewOptionsWithClass,
      length: '100%',
    };
    document.body.style.width = '100px';
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    // Учитывая margin-left и margin-right по 15
    expect(view.getLength()).toBe(100 - 15 * 2);
    document.body.style.width = '';
  });
  it('getVertical', () => {
    expect(view.getVertical()).toBe(false);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      vertical: true,
    };
    view = new View(viewOptions, document.body);
    expect(view.getVertical()).toEqual(true);
  });
});

describe('View methods', () => {
  let model: IModel;
  let view: IView;
  let presenter: IPresenter;
  beforeEach(() => {
    model = new Model(defaultModelOptions);
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
  });


  it('addStepsInfoInteractivity', () => {
    view = new View({
      ...defaultViewOptionsWithClass,
      stepsInfo: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.addStepsInfoInteractivity();
    // console.log для проверки в браузере
    console.log('Added stepsInfo interactivity: ', view.getSlider());
    expect(view.getInteractiveStepsInfo()).toBe(true);
  });

  it('removeStepsInfoInteractivity', () => {
    view.createStepsInfo();
    view.removeStepsInfoInteractivity();
    console.log('Removed stepsInfo interactivity: ', view.getSlider());
    expect(view.getInteractiveStepsInfo()).toBe(false);
  });

  it('addKeyboardListener', () => {
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.addKeyboardListener();
    console.log('Added keyboard listener: ', view.getSlider());
    expect(view.getUseKeyboard()).toBe(true);
  });
  it('removeKeyboardListener', () => {
    view.removeKeyboardListener();
    console.log('Removed keyboard listener: ', view.getSlider());
    expect(view.getUseKeyboard()).toBe(false);
  });


  it('setActiveThumb', () => {
    view.setActiveThumb();
    console.log('SetActiveThumb range false: ', view.getSlider());
    expect(view.getActiveThumb()).toBeDefined();

    model = new Model(defaultModelOptions);
    model.setRange(true);
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.setActiveThumb();
    console.log('SetActiveThumb with range true', view.getSlider());
    expect(view.getActiveThumb()).toBeDefined();
  });

  it('removeActiveThumb', () => {
    view.setActiveThumb();
    view.removeActiveThumb();
    console.log('RemoveActiveThumb range false: ', view.getSlider());
    expect(view.getActiveThumb()).toBe(undefined);

    model = new Model({
      ...defaultModelOptions,
      range: true,
    });
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.setActiveThumb();
    view.removeActiveThumb();
    console.log('RemoveActiveThumb with range true', view.getSlider());
    expect(view.getActiveThumb()).toBe(undefined);
  });

  it('changeResponsive', () => {
    view = new View({
      ...defaultViewOptionsWithClass,
      length: '70%',
    }, document.body);

    view.changeResponsive(true);
    expect(view.getResponsive()).toBe(true);
    view.changeResponsive(false);
    expect(view.getResponsive()).toBe(false);
  });
  it('changeLength', () => {
    view.changeLength('100px');
    expect(view.getLength()).toBe(100);
  });
  it('changeVertical', () => {
    view.changeVertical(true);
    expect(view.getVertical()).toBe(true);
    // создание нового элемента slider для показа в браузере
    view = new View({
      ...defaultViewOptionsWithClass,
      vertical: true,
    }, document.body);
    view.changeVertical(false);
    expect(view.getVertical()).toBe(false);
  });
  it('changeStepsInfoSettings', () => {
    view.changeStepsInfoSettings(true);
    expect(view.getStepsInfoSettings()).toBe(true);
    // console.log для того, чтобы быстро найти имзененное значение
    console.log('Changed steps info settings to true', view.getSlider());

    // создаю новый слайдер
    view = new View({
      ...defaultViewOptionsWithClass,
      stepsInfo: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeStepsInfoSettings(2);
    expect(view.getStepsInfoSettings()).toBe(2);
    console.log('Changed steps info settings to 2', view.getSlider());

    view = new View({
      ...defaultViewOptionsWithClass,
      stepsInfo: 2,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeStepsInfoSettings(['start', '0.25', 'half', '0.75', 'end']);
    expect(view.getStepsInfoSettings()).toEqual(['start', '0.25', 'half', '0.75', 'end']);
    console.log('Changed steps info settings to [\'start\', \'0.25\', \'half\', \'0.75\', \'end\']', view.getSlider());
  });

  it('create/remove tooltip range false', () => {
    presenter = new Presenter(model, view, {});
    view.createTooltip();
    expect(view.getTooltip()).toBeDefined();
    console.log('Created tooltip range=false: ', view.getSlider());

    view = new View({
      ...defaultViewOptionsWithClass,
      tooltip: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.removeTooltip();
    expect(view.getTooltip()).toBe(undefined);
    console.log('Removed tooltip range=false: ', view.getSlider());
  });
  it('create/remove tooltip range true', () => {
    model.setRange(true);
    model.setValue([0, 5]);
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.createTooltip();
    expect(Array.isArray(view.getTooltip())).toBe(true);
    console.log('Created tooltip range=true: ', view.getSlider());

    view = new View({
      ...defaultViewOptionsWithClass,
      tooltip: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.removeTooltip();
    expect(view.getTooltip()).toBe(undefined);
    console.log('Removed tooltip range=true: ', view.getSlider());
  });
  it('create/remove stepsInfo', () => {
    view.createStepsInfo();
    expect(view.getStepsInfo()).toBeDefined();
    console.log('Created stepsInfo: ', view.getSlider());

    view = new View({
      ...defaultViewOptionsWithClass,
      stepsInfo: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.removeStepsInfo();
    expect(view.getStepsInfo()).toBe(undefined);
    console.log('Removed stepsInfo: ', view.getSlider());
  });
  it('create/remove valueInfo', () => {
    view.createValueInfo();
    expect(view.getValueInfo()).toBeDefined();
    console.log('Created valueInfo: ', view.getSlider());

    view = new View({
      ...defaultViewOptionsWithClass,
      valueInfo: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.removeValueInfo();
    expect(view.getValueInfo()).toBe(undefined);
    console.log('Removed valueInfo: ', view.getSlider());
  });
});
