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
  hasTooltip: false,
  hasScale: false,
  scaleValue: 3,
  hasValueInfo: false,
  isVertical: false,
  isScaleClickable: true,
  useKeyboard: true,
  sliderClass: ['slider'],
  sliderVerticalClass: ['slider_vertical', 'slider_vertical_some-class'],
  barClass: ['slider__bar', 'slider__bar_some-class'],
  progressBarClass: ['slider__progress-bar', 'slider__progress-bar_some-class'],
  thumbClass: ['slider__thumb', 'slider__thumb_some-class'],
  activeThumbClass: ['slider__thumb_active', 'slider__thumb_active_some-class'],
  tooltipClass: ['slider__tooltip', 'slider__tooltip_some-class'],
  scaleClass: ['slider__scale', 'slider__scale_some-class'],
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

  it('length in % with all elements', () => {
    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      length: '90%',
      hasTooltip: true,
      hasScale: true,
      hasValueInfo: true,
    };
    model.setValue(2);
    const view = new View(viewOptions, document.body);
    expect(view).toBeDefined();
  });
  it('vertical', () => {
    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      length: '20vh',
      hasTooltip: true,
      hasScale: true,
      hasValueInfo: true,
      isVertical: true,
    };
    model.setIsRange(true);
    model.setValue([3, 7.25]);
    const view = new View(viewOptions, document.body);
    expect(view).toBeDefined();
  });

  it('getParent', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);

    console.log('Parent: ', view.getElement('parent'));
    expect(view.getElement('parent')).toBeDefined();
  });
  it('getSlider', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);
    // eslint-disable-next-line no-unused-vars
    const presenter = new Presenter(model, view, {});

    console.log('Slider: ', view.getElement('slider'));
    expect(view.getElement('slider')).toBeDefined();
  });
  it('getBar', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);
    // eslint-disable-next-line no-unused-vars
    const presenter = new Presenter(model, view, {});

    console.log('Bar: ', view.getElement('bar'));
    expect(view.getElement('bar')).toBeDefined();
  });
  it('getProgressBar isRange false', () => {
    model.setValue(3);
    const view = new View(defaultViewOptionsWithClass, document.body);
    // eslint-disable-next-line no-unused-vars
    const presenter = new Presenter(model, view, {});
    console.log('ProgressBar isRange=false', view.getElement('progressBar'));
    expect(view.getElement('progressBar')).toBeDefined();
  });
  it('getProgressBar isRange true', () => {
    model.setIsRange(true);
    model.setValue([3, 5]);
    const view = new View(defaultViewOptionsWithClass, document.body);
    // eslint-disable-next-line no-unused-vars
    const presenter = new Presenter(model, view, {});
    console.log('ProgressBar isRange=true: ', view.getElement('progressBar'));
    expect(view.getElement('progressBar')).toBeDefined();
  });

  it('getThumb, isRange false', () => {
    const view = new View(defaultViewOptionsWithClass, document.body);
    // eslint-disable-next-line no-unused-vars
    const presenter = new Presenter(model, view, {});
    console.log('Thumb not array: ', view.getElement('thumb'));
    expect(view.getElement('thumb')).toBeDefined();
  });
  it('getThumb, isRange true', () => {
    model.setIsRange(true);
    model.setValue([0, 2]);
    const view: IView = new View(defaultViewOptionsWithClass, document.body);
    // eslint-disable-next-line no-unused-vars
    const presenter = new Presenter(model, view, {});
    console.log('Thumb array: ', view.getElement('thumb'));
    expect(Array.isArray(view.getElement('thumb'))).toBe(true);
  });
  it(`getTooltip returns undefined when options.hasTooltip = false, and vice versa,
      when isRange true returns array`, () => {
    let view = new View(defaultViewOptionsWithClass, document.body);
    let presenter = new Presenter(model, view, {});
    expect(view.getElement('tooltip')).toBe(undefined);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      hasTooltip: true,
    };
    view = new View(viewOptions, document.body);
    presenter = new Presenter(model, view, {});
    console.log('Tooltip not array: ', view.getElement('tooltip'));
    expect(view.getElement('tooltip')).toBeDefined();

    model = new Model(defaultModelOptions);
    model.setIsRange(true);
    model.setValue([1, 6]);
    view = new View(viewOptions, document.body);
    // eslint-disable-next-line no-unused-vars
    presenter = new Presenter(model, view, {});
    console.log('Tooltip array: ', view.getElement('tooltip'));
    expect(Array.isArray(view.getElement('tooltip'))).toBe(true);
  });
  it('getscale when options.scale=false and true', () => {
    let view = new View(defaultViewOptionsWithClass, document.body);
    let presenter = new Presenter(model, view, {});
    expect(view.getElement('scale')).toBe(undefined);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      hasScale: true,
    };
    view = new View(viewOptions, document.body);
    // eslint-disable-next-line no-unused-vars
    presenter = new Presenter(model, view, {});
    console.log('scale: ', view.getElement('scale'));
    expect(view.getElement('scale')).toBeDefined();
  });
  it('getValueInfo when options.hasValueInfo=false and true', () => {
    let view = new View(defaultViewOptionsWithClass, document.body);
    let presenter = new Presenter(model, view, {});
    expect(view.getElement('valueInfo')).toBe(undefined);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      hasValueInfo: true,
    };
    view = new View(viewOptions, document.body);
    // eslint-disable-next-line no-unused-vars
    presenter = new Presenter(model, view, {});
    console.log('ValueInfo: ', view.getElement('valueInfo'));
    expect(view.getElement('valueInfo')).toBeDefined();
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
  it('getIsScaleClickable', () => {
    expect(view.getViewModel().getIsScaleClickable()).toBe(true);
  });
  it('getStepLength', () => {
    expect(view.getViewModel().getStepLength()).toBe(20);
  });
  it('getValuePosition', () => {
    expect(view.getViewModel().getValuePosition()).toBe(0);

    model.setIsRange(true);
    model.setValue([2, 6]);
    expect(view.getViewModel().getValuePosition()).toEqual([40, 120]);
  });
  it('getHasScale and getScaleValue', () => {
    expect(view.getViewModel().getHasScale()).toBe(false);

    let viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      hasScale: true,
    };
    view = new View(viewOptions, document.body);
    expect(view.getViewModel().getHasScale()).toBe(true);

    viewOptions = {
      ...defaultViewOptionsWithClass,
      hasScale: true,
      scaleValue: 7,
    };
    view = new View(viewOptions, document.body);
    expect(view.getViewModel().getHasScale()).toBe(true);
    expect(view.getViewModel().getScaleValue()).toBe(7);

    viewOptions = {
      ...defaultViewOptionsWithClass,
      hasScale: true,
      scaleValue: [1, '5', 'end'],
    };
    view = new View(viewOptions, document.body);
    expect(view.getViewModel().getHasScale()).toBe(true);
    expect(view.getViewModel().getScaleValue()).toEqual([1, '5', 'end']);
  });
  it('getLength', () => {
    expect(view.getViewModel().getLengthInPx()).toBe(200);

    const viewOptions = {
      ...defaultViewOptionsWithClass,
      length: '100%',
    };
    document.body.style.width = '100px';
    view = new View(viewOptions, document.body);
    // eslint-disable-next-line no-unused-vars
    presenter = new Presenter(model, view, {});
    // Учитывая margin-left и margin-right по 15
    expect(view.getViewModel().getLengthInPx()).toBe(100);
    console.log(view.getElement('slider'));
    document.body.style.width = '';
  });
  it('getIsVertical', () => {
    expect(view.getViewModel().getIsVertical()).toBe(false);

    const viewOptions: ViewOptions = {
      ...defaultViewOptionsWithClass,
      isVertical: true,
    };
    view = new View(viewOptions, document.body);
    expect(view.getViewModel().getIsVertical()).toEqual(true);
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

  it('add scale interactivity', () => {
    view = new View({
      ...defaultViewOptionsWithClass,
      hasScale: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      isScaleClickable: true,
    });
    // console.log для проверки в браузере
    console.log('Added scale interactivity: ', view.getElement('slider'));
    expect(view.getViewModel().getIsScaleClickable()).toBe(true);
  });

  it('remove scale interactivity', () => {
    view.changeOptions({
      hasScale: true,
      isScaleClickable: false,
    });
    console.log('Removed scale interactivity: ', view.getElement('slider'));
    expect(view.getViewModel().getIsScaleClickable()).toBe(false);
  });

  it('addKeyboardListener', () => {
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      useKeyboard: true,
    });
    console.log('Added keyboard listener: ', view.getElement('slider'));
    expect(view.getViewModel().getUseKeyboard()).toBe(true);
  });
  it('removeKeyboardListener', () => {
    view.changeOptions({
      useKeyboard: false,
    });
    console.log('Removed keyboard listener: ', view.getElement('slider'));
    expect(view.getViewModel().getUseKeyboard()).toBe(false);
  });

  it('setActiveThumb', () => {
    view.setActiveThumb();
    console.log('SetActiveThumb isRange false: ', view.getElement('slider'));
    expect(view.getViewModel().getActiveThumb()).toBeDefined();

    model = new Model(defaultModelOptions);
    model.setIsRange(true);
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.setActiveThumb();
    console.log('SetActiveThumb with isRange true', view.getElement('slider'));
    expect(view.getViewModel().getActiveThumb()).toBeDefined();
  });

  it('removeActiveThumb', () => {
    view.setActiveThumb();
    view.removeActiveThumb();
    console.log('RemoveActiveThumb isRange false: ', view.getElement('slider'));
    expect(view.getViewModel().getActiveThumb()).toBe(undefined);

    model = new Model({
      ...defaultModelOptions,
      isRange: true,
    });
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.setActiveThumb();
    view.removeActiveThumb();
    console.log('RemoveActiveThumb with isRange true', view.getElement('slider'));
    expect(view.getViewModel().getActiveThumb()).toBe(undefined);
  });
  it('changeLength', () => {
    view.changeOptions({
      length: '100px',
    });
    expect(view.getViewModel().getLengthInPx()).toBe(100);
  });
  it('changeVertical', () => {
    view.changeOptions({
      isVertical: true,
    });
    expect(view.getViewModel().getIsVertical()).toBe(true);
    // создание нового элемента slider для показа в браузере
    view = new View({
      ...defaultViewOptionsWithClass,
      isVertical: true,
    }, document.body);
    view.changeOptions({
      isVertical: false,
    });
    expect(view.getViewModel().getIsVertical()).toBe(false);
  });
  it('change scale settings', () => {
    view.changeOptions({
      hasScale: true,
    });
    expect(view.getViewModel().getHasScale()).toBe(true);

    console.log('Changed hasScale to true', view.getElement('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      hasScale: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      scaleValue: 2,
    });
    expect(view.getViewModel().getScaleValue()).toBe(2);
    console.log('Changed steps info settings to 2', view.getElement('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      hasScale: true,
      scaleValue: 2,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      scaleValue: ['start', '0.25', 'half', '0.75', 'end'],
    });
    expect(view.getViewModel().getScaleValue()).toEqual(['start', '0.25', 'half', '0.75', 'end']);
    console.log('Changed steps info settings to [\'start\', \'0.25\', \'half\', \'0.75\', \'end\']',
      view.getElement('slider'));
  });

  it('create/remove tooltip isRange false', () => {
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      hasTooltip: true,
    });
    expect(view.getElement('tooltip')).toBeDefined();
    console.log('Created tooltip isRange=false: ', view.getElement('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      hasTooltip: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      hasTooltip: false,
    });
    expect(view.getElement('tooltip')).toBe(undefined);
    console.log('Removed tooltip isRange=false: ', view.getElement('slider'));
  });
  it('create/remove tooltip isRange true', () => {
    model.setIsRange(true);
    model.setValue([0, 5]);
    view = new View(defaultViewOptionsWithClass, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      hasTooltip: true,
    });
    expect(Array.isArray(view.getElement('tooltip'))).toBe(true);
    console.log('Created tooltip isRange=true: ', view.getElement('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      hasTooltip: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      hasTooltip: false,
    });
    expect(view.getElement('tooltip')).toBe(undefined);
    console.log('Removed tooltip isRange=true: ', view.getElement('slider'));
  });
  it('create/remove scale', () => {
    view.changeOptions({
      hasScale: true,
    });
    expect(view.getElement('scale')).toBeDefined();
    console.log('Created scale: ', view.getElement('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      hasScale: true,
    }, document.body);
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      hasScale: false,
    });
    expect(view.getElement('scale')).toBe(undefined);
    console.log('Removed scale: ', view.getElement('slider'));
  });
  it('create/remove valueInfo', () => {
    view.changeOptions({
      hasValueInfo: true,
    });
    expect(view.getElement('valueInfo')).toBeDefined();
    console.log('Created valueInfo: ', view.getElement('slider'));

    view = new View({
      ...defaultViewOptionsWithClass,
      hasValueInfo: true,
    }, document.body);
    // eslint-disable-next-line no-unused-vars
    presenter = new Presenter(model, view, {});
    view.changeOptions({
      hasValueInfo: false,
    });
    expect(view.getElement('valueInfo')).toBe(undefined);
    console.log('Removed valueInfo: ', view.getElement('slider'));
  });
});
