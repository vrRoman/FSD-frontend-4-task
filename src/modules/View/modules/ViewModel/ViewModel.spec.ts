import ViewModel from './ViewModel';
import { IViewModel, IViewModelData, ViewClasses } from './interfacesAndTypes';
import { defaultModelOptions } from '../../../../options/defaultOptions';

describe('ViewModel', () => {
  const classes: ViewClasses = {
    sliderClass: 'slider',
    sliderVerticalClass: 'slider_vertical',
    barClass: 'slider__bar',
    clickableBarClass: 'slider__bar_clickable',
    progressBarClass: 'slider__progress-bar',
    thumbClass: 'slider__thumb',
    activeThumbClass: 'slider__thumb_active',
    tooltipClass: 'slider__tooltip',
    tooltipValueClass: 'slider__tooltip-value',
    scaleClass: 'slider__scale',
    scaleElementClass: 'slider__scale-element',
    clickableScaleElementClass: 'slider__scale-element_clickable',
    valueInfoClass: 'slider__value-info',
  };
  const defaultViewModelData: IViewModelData = {
    classes,
    length: '100%',
    lengthInPx: 0,
    isVertical: false,
    hasTooltip: false,
    hasValueInfo: false,
    hasScale: false,
    scaleValue: 2,
    useKeyboard: true,
    isScaleClickable: true,
    isBarClickable: true,
    modelData: null,
    activeThumb: null,
    clientX: 0,
    clientY: 0,
  };

  let viewModel: IViewModel;
  beforeEach(() => {
    viewModel = new ViewModel(defaultViewModelData);
  });

  describe('getters', () => {
    test('getClientCoordinates', () => {
      expect(viewModel.getClientCoordinates()).toEqual([0, 0]);
    });
    test('getModelProperties', () => {
      expect(viewModel.getModelData()).toBeNull();
    });
    test('getActiveThumb', () => {
      expect(viewModel.getActiveThumb()).toBeNull();
    });
    test('getClasses', () => {
      expect(viewModel.getClasses()).toEqual(classes);
    });
    test('getLength', () => {
      expect(viewModel.getLength()).toBe('100%');
    });
    test('getLengthInPx', () => {
      expect(viewModel.getLengthInPx()).toBe(0);
    });
    test('getIsVertical', () => {
      expect(viewModel.getIsVertical()).toBe(false);
    });
    test('getHasTooltip', () => {
      expect(viewModel.getHasTooltip()).toBe(false);
    });
    test('getHasValueInfo', () => {
      expect(viewModel.getHasValueInfo()).toBe(false);
    });
    test('getHasScale', () => {
      expect(viewModel.getHasScale()).toBe(false);
    });
    test('getScaleValue', () => {
      expect(viewModel.getScaleValue()).toBe(2);
    });
    test('getUseKeyboard', () => {
      expect(viewModel.getUseKeyboard()).toBe(true);
    });
    test('getIsScaleClickable', () => {
      expect(viewModel.getIsScaleClickable()).toBe(true);
    });
    test('getIsBarClickable', () => {
      expect(viewModel.getIsBarClickable()).toBe(true);
    });
    test('getValuePosition', () => {
      expect(viewModel.getValuePosition()).toBe(0);
    });
    test('getValuePosition when modelData defined', () => {
      viewModel = new ViewModel({
        ...defaultViewModelData,
        modelData: {
          min: -2,
          max: 10,
          value: 2,
          isRange: false,
          stepSize: 1,
        },
        lengthInPx: 200,
      });
      expect(viewModel.getValuePosition()).toBeCloseTo(66.67);
    });
    test('getStepLength', () => {
      expect(viewModel.getStepLength()).toBe(0);
    });
    test('getStepLength when modelData defined', () => {
      viewModel = new ViewModel({
        ...defaultViewModelData,
        modelData: {
          min: -2,
          max: 10,
          value: 2,
          isRange: false,
          stepSize: 1,
        },
        lengthInPx: 200,
      });
      expect(viewModel.getStepLength()).toBeCloseTo(16.67);
    });
  });

  describe('setters', () => {
    test('setActiveThumb', () => {
      const element = document.createElement('div');
      viewModel.setActiveThumb(element);
      expect(viewModel.getActiveThumb()).toEqual(element);
      viewModel.setActiveThumb(null);
      expect(viewModel.getActiveThumb()).toBeNull();
    });

    test('setModelData', () => {
      viewModel.setModelData(defaultModelOptions);
      expect(viewModel.getModelData()).toEqual(defaultModelOptions);
      viewModel.setModelData(null);
      expect(viewModel.getModelData()).toBeNull();
    });

    test('setClientCoordinates', () => {
      viewModel.setClientCoordinates([23, 123]);
      expect(viewModel.getClientCoordinates()).toEqual([23, 123]);
    });

    test('setLength', () => {
      viewModel.setLength('200px');
      expect(viewModel.getLength()).toBe('200px');
    });

    test('setLengthInPx', () => {
      viewModel.setLengthInPx(200);
      expect(viewModel.getLengthInPx()).toBe(200);
    });

    test('setIsVertical', () => {
      viewModel.setIsVertical(true);
      expect(viewModel.getIsVertical()).toBe(true);
    });

    test('setHasScale', () => {
      viewModel.setHasScale(true);
      expect(viewModel.getHasScale()).toBe(true);
    });

    test('setScaleValue', () => {
      viewModel.setScaleValue(['start', 'half', 'end']);
      expect(viewModel.getScaleValue()).toEqual(['start', 'half', 'end']);
    });

    test('setHasTooltip', () => {
      viewModel.setHasTooltip(true);
      expect(viewModel.getHasTooltip()).toBe(true);
    });

    test('setHasValueInfo', () => {
      viewModel.setHasValueInfo(true);
      expect(viewModel.getHasValueInfo()).toBe(true);
    });

    test('setUseKeyboard', () => {
      viewModel.setUseKeyboard(false);
      expect(viewModel.getUseKeyboard()).toBe(false);
    });

    test('setIsScaleClickable', () => {
      viewModel.setIsScaleClickable(false);
      expect(viewModel.getIsScaleClickable()).toBe(false);
    });

    test('setIsBarClickable', () => {
      viewModel.setIsBarClickable(false);
      expect(viewModel.getIsBarClickable()).toBe(false);
    });
  });
});
