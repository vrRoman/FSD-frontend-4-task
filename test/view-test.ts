// Многие тесты для view будут проверяться в браузере

import Model from '../src/modules/Model/Model';
import View from '../src/modules/View/modules/View/View';
import IModel from '../src/modules/Model/interfacesAndTypes';
import IView from '../src/modules/View/modules/View/interfaces';
import IPresenter from '../src/modules/Presenter/interface';
import { ViewOptions } from '../src/modules/View/options';
import { ModelOptions } from '../src/modules/Model/options';
import Presenter from '../src/modules/Presenter/Presenter';

const defaultViewOptionsWithClass: ViewOptions = {
  length: '200px',
  tooltip: false,
  stepsInfo: false,
  valueInfo: false,
  vertical: false,
  responsive: false,
  stepsInfoInteractivity: true,
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
  isRange: false,
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
    model.setIsRange(true);
    model.setValue([3, 7.25]);
    const view = new View(viewOptions, document.body);
    expect(view).toBeDefined();
  });


  it('getParent', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);

    console.log('Parent: ', view.getElem('parent'));
    expect(view.getElem('parent')).toBeDefined();
  });
  it('getSlider', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});

    console.log('Slider: ', view.getElem('slider'));
    expect(view.getElem('slider')).toBeDefined();
  });
  it('getBar', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});

    console.log('Bar: ', view.getElem('bar'));
    expect(view.getElem('bar')).toBeDefined();
  });
  it('getProgressBar isRange false', () => {
    model.setValue(3);
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});
    console.log('ProgressBar isRange=false', view.getElem('progressBar'));
    expect(view.getElem('progressBar')).toBeDefined();
  });
  it('getProgressBar isRange true', () => {
    model.setIsRange(true);
    model.setValue([3, 5]);
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});
    console.log('ProgressBar isRange=true: ', view.getElem('progressBar'));
    expect(view.getElem('progressBar')).toBeDefined();
  });

  it('getThumb, isRange false', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});
    console.log('Thumb not array: ', view.getElem('thumb'));
    expect(view.getElem('thumb')).toBeDefined();
  });
  it('getThumb, isRange true', () => {
    model.setIsRange(true);
    model.setValue([0, 2]);
    const view: IView = new View(defaultViewOptionsWithClass, document.body);
    const presenter = new Presenter(model, view, {});
    console.log('Thumb array: ', view.getElem('thumb'));
    expect(Array.isArray(view.getElem('thumb'))).toBe(true);
  });
  it(`getTooltip returns undefined when options.tooltip = false, and vice versa,
      when isRange true returns array`, () => {
    let view = new View(defaultViewOptionsWithClass, document.body);
    let presenter = new Presenter(model, view, {});
    expect(view.getElem('tooltip')).toBe(undefined);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      tooltip: true,
    };
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    console.log('Tooltip not array: ', view.getElem('tooltip'));
    expect(view.getElem('tooltip')).toBeDefined();

    model = new Model(defaultModelOptions);
    model.setIsRange(true);
    model.setValue([1, 6]);
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    console.log('Tooltip array: ', view.getElem('tooltip'));
    expect(Array.isArray(view.getElem('tooltip'))).toBe(true);
  });
  it('getStepsInfo when options.stepsInfo=false and true', () => {
    let view = new View(defaultViewOptionsWithClass, document.body);
    let presenter = new Presenter(model, view, {});
    expect(view.getElem('stepsInfo')).toBe(undefined);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      stepsInfo: true,
    };
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    console.log('StepsInfo: ', view.getElem('stepsInfo'));
    expect(view.getElem('stepsInfo')).toBeDefined();
  });
  it('getValueInfo when options.valueInfo=false and true', () => {
    let view = new View(defaultViewOptionsWithClass, document.body);
    let presenter = new Presenter(model, view, {});
    expect(view.getElem('valueInfo')).toBe(undefined);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      valueInfo: true,
    };
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    console.log('ValueInfo: ', view.getElem('valueInfo'));
    expect(view.getElem('valueInfo')).toBeDefined();
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
    expect(view.getViewModel().getUseKeyboard()).toBe(true);
  });
  it('getStepsInfoInteractivity', () => {
    expect(view.getViewModel().getStepsInfoInteractivity()).toBe(true);
  });
  it('getStepLength', () => {
    expect(view.getViewModel().getStepLength()).toBe(20);
  });
  it('getResponsive', () => {
    expect(view.getViewModel().getResponsive()).toBe(false);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      responsive: true,
    };
    view = new View(viewOptions, document.body);
    expect(view.getViewModel().getResponsive()).toBe(true);
  });
  it('getValuePosition', () => {
    expect(view.getViewModel().getValuePosition()).toBe(0);

    model.setIsRange(true);
    model.setValue([2, 6]);
    expect(view.getViewModel().getValuePosition()).toEqual([40, 120]);
  });
  it('getStepsInfoSettings', () => {
    expect(view.getViewModel().getStepsInfoSettings()).toBe(false);

    let viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      stepsInfo: true,
    };
    view = new View(viewOptions, document.body);
    expect(view.getViewModel().getStepsInfoSettings()).toBe(true);

    viewOptions = {
      ...defaultViewOptionsWithClass,
      stepsInfo: 7,
    };
    view = new View(viewOptions, document.body);
    expect(view.getViewModel().getStepsInfoSettings()).toBe(7);

    viewOptions = {
      ...defaultViewOptionsWithClass,
      stepsInfo: [1, '5', 'end'],
    };
    view = new View(viewOptions, document.body);
    expect(view.getViewModel().getStepsInfoSettings()).toEqual([1, '5', 'end']);
  });
  it('getLength', () => {
    expect(view.getViewModel().getLengthInPx()).toBe(200);

    const viewOptions = {
      ...defaultViewOptionsWithClass,
      length: '100%',
    };
    document.body.style.width = '100px';
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    // Учитывая margin-left и margin-right по 15
    expect(view.getViewModel().getLengthInPx()).toBe(100 - 15 * 2);
    document.body.style.width = '';
  });
  it('getVertical', () => {
    expect(view.getViewModel().getVertical()).toBe(false);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      vertical: true,
    };
    view = new View(viewOptions, document.body);
    expect(view.getViewModel().getVertical()).toEqual(true);
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
    view.changeOptions({
      stepsInfoInteractivity: true,
    });
    // console.log для проверки в браузере
    console.log('Added stepsInfo interactivity: ', view.getElem('slider'));
    expect(view.getViewModel().getStepsInfoInteractivity()).toBe(true);
  });

  it('removeStepsInfoInteractivity', () => {
    view.changeOptions({
      stepsInfo: true,
      stepsInfoInteractivity: false,
    });
    console.log('Removed stepsInfo interactivity: ', view.getElem('slider'));
    expect(view.getViewModel().getStepsInfoInteractivity()).toBe(false);
  });

  it('addKeyboardListener', () => {
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      useKeyboard: true,
    });
    console.log('Added keyboard listener: ', view.getElem('slider'));
    expect(view.getViewModel().getUseKeyboard()).toBe(true);
  });
  it('removeKeyboardListener', () => {
    view.changeOptions({
      useKeyboard: false,
    });
    console.log('Removed keyboard listener: ', view.getElem('slider'));
    expect(view.getViewModel().getUseKeyboard()).toBe(false);
  });


  it('setActiveThumb', () => {
    view.setActiveThumb();
    console.log('SetActiveThumb isRange false: ', view.getElem('slider'));
    expect(view.getViewModel().getActiveThumb()).toBeDefined();

    model = new Model(defaultModelOptions);
    model.setIsRange(true);
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.setActiveThumb();
    console.log('SetActiveThumb with isRange true', view.getElem('slider'));
    expect(view.getViewModel().getActiveThumb()).toBeDefined();
  });

  it('removeActiveThumb', () => {
    view.setActiveThumb();
    view.removeActiveThumb();
    console.log('RemoveActiveThumb isRange false: ', view.getElem('slider'));
    expect(view.getViewModel().getActiveThumb()).toBe(undefined);

    model = new Model({
      ...defaultModelOptions,
      isRange: true,
    });
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.setActiveThumb();
    view.removeActiveThumb();
    console.log('RemoveActiveThumb with isRange true', view.getElem('slider'));
    expect(view.getViewModel().getActiveThumb()).toBe(undefined);
  });

  it('changeResponsive', () => {
    view = new View({
      ...defaultViewOptionsWithClass,
      length: '70%',
    }, document.body);

    view.changeOptions({
      responsive: true,
    });
    expect(view.getViewModel().getResponsive()).toBe(true);
    view.changeOptions({
      responsive: false,
    });
    expect(view.getViewModel().getResponsive()).toBe(false);
  });
  it('changeLength', () => {
    view.changeOptions({
      length: '100px',
    });
    expect(view.getViewModel().getLengthInPx()).toBe(100);
  });
  it('changeVertical', () => {
    view.changeOptions({
      vertical: true,
    });
    expect(view.getViewModel().getVertical()).toBe(true);
    // создание нового элемента slider для показа в браузере
    view = new View({
      ...defaultViewOptionsWithClass,
      vertical: true,
    }, document.body);
    view.changeOptions({
      vertical: false,
    });
    expect(view.getViewModel().getVertical()).toBe(false);
  });
  it('changeStepsInfoSettings', () => {
    view.changeOptions({
      stepsInfo: true,
    });
    expect(view.getViewModel().getStepsInfoSettings()).toBe(true);
    // console.log для того, чтобы быстро найти имзененное значение
    console.log('Changed steps info settings to true', view.getElem('slider'));

    // создаю новый слайдер
    view = new View({
      ...defaultViewOptionsWithClass,
      stepsInfo: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      stepsInfo: 2,
    });
    expect(view.getViewModel().getStepsInfoSettings()).toBe(2);
    console.log('Changed steps info settings to 2', view.getElem('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      stepsInfo: 2,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      stepsInfo: ['start', '0.25', 'half', '0.75', 'end'],
    });
    expect(view.getViewModel().getStepsInfoSettings()).toEqual(['start', '0.25', 'half', '0.75', 'end']);
    console.log('Changed steps info settings to [\'start\', \'0.25\', \'half\', \'0.75\', \'end\']',
      view.getElem('slider'));
  });

  it('create/remove tooltip isRange false', () => {
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      tooltip: true,
    });
    expect(view.getElem('tooltip')).toBeDefined();
    console.log('Created tooltip isRange=false: ', view.getElem('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      tooltip: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      tooltip: false,
    });
    expect(view.getElem('tooltip')).toBe(undefined);
    console.log('Removed tooltip isRange=false: ', view.getElem('slider'));
  });
  it('create/remove tooltip isRange true', () => {
    model.setIsRange(true);
    model.setValue([0, 5]);
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      tooltip: true,
    });
    expect(Array.isArray(view.getElem('tooltip'))).toBe(true);
    console.log('Created tooltip isRange=true: ', view.getElem('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      tooltip: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      tooltip: false,
    });
    expect(view.getElem('tooltip')).toBe(undefined);
    console.log('Removed tooltip isRange=true: ', view.getElem('slider'));
  });
  it('create/remove stepsInfo', () => {
    view.changeOptions({
      stepsInfo: true,
    });
    expect(view.getElem('stepsInfo')).toBeDefined();
    console.log('Created stepsInfo: ', view.getElem('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      stepsInfo: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      stepsInfo: false,
    });
    expect(view.getElem('stepsInfo')).toBe(undefined);
    console.log('Removed stepsInfo: ', view.getElem('slider'));
  });
  it('create/remove valueInfo', () => {
    view.changeOptions({
      valueInfo: true,
    });
    expect(view.getElem('valueInfo')).toBeDefined();
    console.log('Created valueInfo: ', view.getElem('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      valueInfo: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      valueInfo: false,
    });
    expect(view.getElem('valueInfo')).toBe(undefined);
    console.log('Removed valueInfo: ', view.getElem('slider'));
  });
});
