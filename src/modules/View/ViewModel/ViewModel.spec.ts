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

  describe('getData', () => {
    test('get clientX should return current clientX', () => {
      expect(viewModel.getData('clientX')).toEqual(0);
    });
    test('get clientY should return current clientY', () => {
      expect(viewModel.getData('clientY')).toEqual(0);
    });
    test('get modelData should return current modelProperties', () => {
      expect(viewModel.getData('modelData')).toBeNull();
    });
    test('get activeThumb should return current activeThumb', () => {
      expect(viewModel.getData('activeThumb')).toBeNull();
    });
    test('get classes should return current classes', () => {
      expect(viewModel.getData('classes')).toEqual(classes);
    });
    test('get length should return current length', () => {
      expect(viewModel.getData('length')).toBe('100%');
    });
    test('get lengthInPx should return current lengthInPx', () => {
      expect(viewModel.getData('lengthInPx')).toBe(0);
    });
    test('get isVertical should return current isVertical', () => {
      expect(viewModel.getData('isVertical')).toBe(false);
    });
    test('get hasTooltip should return current hasTooltip', () => {
      expect(viewModel.getData('hasTooltip')).toBe(false);
    });
    test('get hasValueInfo should return current hasValueInfo', () => {
      expect(viewModel.getData('hasValueInfo')).toBe(false);
    });
    test('get hasScale should return current hasScale', () => {
      expect(viewModel.getData('hasScale')).toBe(false);
    });
    test('get scaleValue should return current scaleValue', () => {
      expect(viewModel.getData('scaleValue')).toBe(2);
    });
    test('get useKeyboard should return current useKeyboard', () => {
      expect(viewModel.getData('useKeyboard')).toBe(true);
    });
    test('get isScaleClickable should return current isScaleClickable', () => {
      expect(viewModel.getData('isScaleClickable')).toBe(true);
    });
    test('get isBarClickable should return current isBarClickable', () => {
      expect(viewModel.getData('isBarClickable')).toBe(true);
    });
  });

  describe('getValuePosition', () => {
    test('when modelData is null should return 0', () => {
      expect(viewModel.getValuePosition()).toBe(0);
    });
    test('when modelData and lengthInPx defined should return position in px of current value', () => {
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
  });

  describe('getStepLength', () => {
    test('when modelData is null should return 0', () => {
      expect(viewModel.getStepLength()).toBe(0);
    });
    test('when modelData and lengthInPx defined should return length in px of 1 step', () => {
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
      expect(viewModel.getData('activeThumb')).toEqual(element);
      viewModel.setActiveThumb(null);
      expect(viewModel.getData('activeThumb')).toBeNull();
    });

    test('setModelData should change modelData', () => {
      viewModel.setModelData(defaultModelOptions);
      expect(viewModel.getData('modelData')).toEqual(defaultModelOptions);
    });

    test('setClientCoordinates should change clientX and clientY', () => {
      viewModel.setClientCoordinates([23, 123]);
      expect(viewModel.getData('clientX')).toEqual(23);
      expect(viewModel.getData('clientY')).toEqual(123);
    });

    test('setLength should change length', () => {
      viewModel.setLength('200px');
      expect(viewModel.getData('length')).toBe('200px');
    });

    test('setLengthInPx should change lengthInPx', () => {
      viewModel.setLengthInPx(200);
      expect(viewModel.getData('lengthInPx')).toBe(200);
    });

    test('setIsVertical should change isVertical', () => {
      viewModel.setIsVertical(true);
      expect(viewModel.getData('isVertical')).toBe(true);
    });

    test('setHasScale should change hasScale', () => {
      viewModel.setHasScale(true);
      expect(viewModel.getData('hasScale')).toBe(true);
    });

    test('setScaleValue should change scaleValue', () => {
      viewModel.setScaleValue(['start', 'half', 'end']);
      expect(viewModel.getData('scaleValue')).toEqual(['start', 'half', 'end']);
    });

    test('setHasTooltip should change hasTooltip', () => {
      viewModel.setHasTooltip(true);
      expect(viewModel.getData('hasTooltip')).toBe(true);
    });

    test('setHasValueInfo should change hasValueInfo', () => {
      viewModel.setHasValueInfo(true);
      expect(viewModel.getData('hasValueInfo')).toBe(true);
    });

    test('setUseKeyboard should change useKeyboard', () => {
      viewModel.setUseKeyboard(false);
      expect(viewModel.getData('useKeyboard')).toBe(false);
    });

    test('setIsScaleClickable should change isScaleClickable', () => {
      viewModel.setIsScaleClickable(false);
      expect(viewModel.getData('isScaleClickable')).toBe(false);
    });

    test('setIsBarClickable should change isBarClickable', () => {
      viewModel.setIsBarClickable(false);
      expect(viewModel.getData('isBarClickable')).toBe(false);
    });
  });
});
