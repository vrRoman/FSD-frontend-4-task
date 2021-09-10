import { defaultModelOptions } from 'constants/defaultOptions';

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
    thumbOffset: 0,
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

  describe('changeData', () => {
    test('change activeThumb should change activeThumb', () => {
      const element = document.createElement('div');
      viewModel.changeData({ activeThumb: element });
      expect(viewModel.getData('activeThumb')).toEqual(element);
      viewModel.changeData({ activeThumb: null });
      expect(viewModel.getData('activeThumb')).toBeNull();
    });

    test('change modelData should change modelData', () => {
      viewModel.changeData({ modelData: defaultModelOptions });
      expect(viewModel.getData('modelData')).toEqual(defaultModelOptions);
    });

    test('change clientX should change clientX', () => {
      viewModel.changeData({ clientX: 23 });
      expect(viewModel.getData('clientX')).toEqual(23);
    });

    test('change clientX should change clientX', () => {
      viewModel.changeData({ clientX: 123 });
      expect(viewModel.getData('clientX')).toEqual(123);
    });

    test('change length should change length', () => {
      viewModel.changeData({ length: '200px' });
      expect(viewModel.getData('length')).toBe('200px');
    });

    test('change lengthInPx should change lengthInPx', () => {
      viewModel.changeData({ lengthInPx: 200 });
      expect(viewModel.getData('lengthInPx')).toBe(200);
    });

    test('change isVertical should change isVertical', () => {
      viewModel.changeData({ isVertical: true });
      expect(viewModel.getData('isVertical')).toBe(true);
    });

    test('change hasScale should change hasScale', () => {
      viewModel.changeData({ hasScale: true });
      expect(viewModel.getData('hasScale')).toBe(true);
    });

    test('change scaleValue should change scaleValue', () => {
      viewModel.changeData({ scaleValue: ['start', 'half', 'end'] });
      expect(viewModel.getData('scaleValue')).toEqual(['start', 'half', 'end']);
    });

    test('change hasTooltip should change hasTooltip', () => {
      viewModel.changeData({ hasTooltip: true });
      expect(viewModel.getData('hasTooltip')).toBe(true);
    });

    test('change hasValueInfo should change hasValueInfo', () => {
      viewModel.changeData({ hasValueInfo: true });
      expect(viewModel.getData('hasValueInfo')).toBe(true);
    });

    test('change useKeyboard should change useKeyboard', () => {
      viewModel.changeData({ useKeyboard: false });
      expect(viewModel.getData('useKeyboard')).toBe(false);
    });

    test('change isScaleClickable should change isScaleClickable', () => {
      viewModel.changeData({ isScaleClickable: false });
      expect(viewModel.getData('isScaleClickable')).toBe(false);
    });

    test('change isBarClickable should change isBarClickable', () => {
      viewModel.changeData({ isBarClickable: false });
      expect(viewModel.getData('isBarClickable')).toBe(false);
    });
  });
});
