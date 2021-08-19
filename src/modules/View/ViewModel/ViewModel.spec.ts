import { defaultModelOptions } from 'defaults/defaultOptions';

import ViewModel from './ViewModel';
import { IViewModel, IViewModelData, ViewClasses } from './ViewModel.model';

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
    test('getClientCoordinates should return current clientCoordinates', () => {
      expect(viewModel.getClientCoordinates()).toEqual([0, 0]);
    });
    test('getModelProperties should return current modelProperties', () => {
      expect(viewModel.getModelData()).toBeNull();
    });
    test('getActiveThumb should return current activeThumb', () => {
      expect(viewModel.getActiveThumb()).toBeNull();
    });
    test('getClasses should return current classes', () => {
      expect(viewModel.getClasses()).toEqual(classes);
    });
    test('getLength should return current length', () => {
      expect(viewModel.getLength()).toBe('100%');
    });
    test('getLengthInPx should return current lengthInPx', () => {
      expect(viewModel.getLengthInPx()).toBe(0);
    });
    test('getIsVertical should return current isVertical', () => {
      expect(viewModel.getIsVertical()).toBe(false);
    });
    test('getHasTooltip should return current hasTooltip', () => {
      expect(viewModel.getHasTooltip()).toBe(false);
    });
    test('getHasValueInfo should return current hasValueInfo', () => {
      expect(viewModel.getHasValueInfo()).toBe(false);
    });
    test('getHasScale should return current hasScale', () => {
      expect(viewModel.getHasScale()).toBe(false);
    });
    test('getScaleValue should return current scaleValue', () => {
      expect(viewModel.getScaleValue()).toBe(2);
    });
    test('getUseKeyboard should return current useKeyboard', () => {
      expect(viewModel.getUseKeyboard()).toBe(true);
    });
    test('getIsScaleClickable should return current isScaleClickable', () => {
      expect(viewModel.getIsScaleClickable()).toBe(true);
    });
    test('getIsBarClickable should return current isBarClickable', () => {
      expect(viewModel.getIsBarClickable()).toBe(true);
    });
    test('getValuePosition when modelData is null should return 0', () => {
      expect(viewModel.getValuePosition()).toBe(0);
    });
    test('getValuePosition when modelData and lengthInPx defined should return position in px of current value', () => {
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
    test('getStepLength when modelData is null should return 0', () => {
      expect(viewModel.getStepLength()).toBe(0);
    });
    test('getStepLength when modelData and lengthInPx defined should return length in px of 1 step', () => {
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
    test('setActiveThumb should change activeThumb', () => {
      const element = document.createElement('div');
      viewModel.setActiveThumb(element);
      expect(viewModel.getActiveThumb()).toEqual(element);
      viewModel.setActiveThumb(null);
      expect(viewModel.getActiveThumb()).toBeNull();
    });

    test('setModelData should change modelData', () => {
      viewModel.setModelData(defaultModelOptions);
      expect(viewModel.getModelData()).toEqual(defaultModelOptions);
    });

    test('setClientCoordinates should change clientCoordinates', () => {
      viewModel.setClientCoordinates([23, 123]);
      expect(viewModel.getClientCoordinates()).toEqual([23, 123]);
    });

    test('setLength should change length', () => {
      viewModel.setLength('200px');
      expect(viewModel.getLength()).toBe('200px');
    });

    test('setLengthInPx should change lengthInPx', () => {
      viewModel.setLengthInPx(200);
      expect(viewModel.getLengthInPx()).toBe(200);
    });

    test('setIsVertical should change isVertical', () => {
      viewModel.setIsVertical(true);
      expect(viewModel.getIsVertical()).toBe(true);
    });

    test('setHasScale should change hasScale', () => {
      viewModel.setHasScale(true);
      expect(viewModel.getHasScale()).toBe(true);
    });

    test('setScaleValue should change scaleValue', () => {
      viewModel.setScaleValue(['start', 'half', 'end']);
      expect(viewModel.getScaleValue()).toEqual(['start', 'half', 'end']);
    });

    test('setHasTooltip should change hasTooltip', () => {
      viewModel.setHasTooltip(true);
      expect(viewModel.getHasTooltip()).toBe(true);
    });

    test('setHasValueInfo should change hasValueInfo', () => {
      viewModel.setHasValueInfo(true);
      expect(viewModel.getHasValueInfo()).toBe(true);
    });

    test('setUseKeyboard should change useKeyboard', () => {
      viewModel.setUseKeyboard(false);
      expect(viewModel.getUseKeyboard()).toBe(false);
    });

    test('setIsScaleClickable should change isScaleClickable', () => {
      viewModel.setIsScaleClickable(false);
      expect(viewModel.getIsScaleClickable()).toBe(false);
    });

    test('setIsBarClickable should change isBarClickable', () => {
      viewModel.setIsBarClickable(false);
      expect(viewModel.getIsBarClickable()).toBe(false);
    });
  });
});
