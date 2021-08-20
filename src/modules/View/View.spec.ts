import { defaultModelOptions, defaultViewOptions } from 'defaults/defaultOptions';
import defaultClasses from 'defaults/defaultClasses';

import View from './View';
import { IView } from './View.model';

describe('View', () => {
  const { body } = document;
  let target: HTMLElement;
  let view: IView;
  beforeEach(() => {
    target = body.appendChild(document.createElement('div'));
    view = new View(defaultViewOptions, target);
  });

  describe('renderSlider', () => {
    test('when hasTooltip is false, then there should be no tooltips', () => {
      view.setModelData(defaultModelOptions);
      view.renderSlider();
      expect(target.querySelectorAll(`.${defaultClasses.tooltipClass}`)).toHaveLength(0);
    });
    test('when hasTooltip is true, then there should be tooltips', () => {
      view.setModelData(defaultModelOptions);
      view.changeOptions({ hasTooltip: true });
      view.renderSlider();
      expect(target.querySelectorAll(`.${defaultClasses.tooltipClass}`)).not.toHaveLength(0);
    });

    test('when hasScale is false, then there should be no scales', () => {
      view.setModelData(defaultModelOptions);
      view.renderSlider();
      expect(target.querySelectorAll(`.${defaultClasses.scaleClass}`)).toHaveLength(0);
    });
    test('when hasScale is true, then there should be scales', () => {
      view.setModelData(defaultModelOptions);
      view.changeOptions({ hasScale: true });
      view.renderSlider();
      expect(target.querySelectorAll(`.${defaultClasses.scaleClass}`)).not.toHaveLength(0);
    });

    test('when hasValueInfo is false, then there should be no tooltips', () => {
      view.setModelData(defaultModelOptions);
      view.renderSlider();
      expect(target.querySelectorAll(`.${defaultClasses.valueInfoClass}`)).toHaveLength(0);
    });
    test('when hasValueInfo is true, then there should be tooltips', () => {
      view.setModelData(defaultModelOptions);
      view.changeOptions({ hasValueInfo: true });
      view.renderSlider();
      expect(target.querySelectorAll(`.${defaultClasses.valueInfoClass}`)).not.toHaveLength(0);
    });
  });

  describe('getElement', () => {
    test('get parent', () => {
      expect(view.getElement('parent')).toBeInstanceOf(HTMLElement);
    });
    test('get slider', () => {
      expect(view.getElement('slider')).toBeInstanceOf(HTMLElement);
    });
    test('get bar', () => {
      expect(view.getElement('bar')).toBeInstanceOf(HTMLElement);
    });
    test('get progressBar', () => {
      expect(view.getElement('progressBar')).toBeInstanceOf(HTMLElement);
    });
    test('get thumb', () => {
      expect(view.getElement('thumb')).toBeInstanceOf(HTMLElement);
    });
    test('get tooltip', () => {
      expect(view.getElement('tooltip')).toBeInstanceOf(HTMLElement);
    });
    test('get scale', () => {
      expect(view.getElement('scale')).toBeInstanceOf(HTMLElement);
    });
    test('get valueInfo', () => {
      expect(view.getElement('valueInfo')).toBeInstanceOf(HTMLElement);
    });
  });

  describe('setModelData', () => {
    test('multiple values', () => {
      view.setModelData(defaultModelOptions);
      view.setModelData({
        value: [1, 2],
        isRange: true,
        min: -10,
      });
      expect(view.getViewModel().getData('modelData')).toEqual({
        ...defaultModelOptions,
        value: [1, 2],
        isRange: true,
        min: -10,
      });
    });
  });

  describe('changeOptions', () => {
    beforeEach(() => {
      target = body.appendChild(document.createElement('div'));
      view = new View(defaultViewOptions, target);
      view.setModelData(defaultModelOptions);
      view.renderSlider();
    });

    test('change length', () => {
      view.changeOptions({ length: '200px' });
      expect(view.getElement('bar').style.width).toBe('200px');
      expect(view.getViewModel().getData('length')).toBe('200px');
    });

    test('change length with incorrect value', () => {
      view.changeOptions({ length: '200something' });
      expect(view.getElement('bar').style.width).toBe('100%');
      view.changeOptions({ length: '200' });
      expect(view.getElement('bar').style.width).toBe('100%');
      expect(view.getViewModel().getData('length')).toBe('100%');
    });

    test('change hasTooltip', () => {
      view.changeOptions({ hasTooltip: true });
      expect(target.querySelectorAll(`.${defaultClasses.tooltipClass}`)).not.toHaveLength(0);
      expect(view.getViewModel().getData('hasTooltip')).toBe(true);

      view.changeOptions({ hasTooltip: false });
      expect(target.querySelectorAll(`.${defaultClasses.tooltipClass}`)).toHaveLength(0);
    });

    test('change hasScale', () => {
      view.changeOptions({ hasScale: true });
      expect(target.querySelectorAll(`.${defaultClasses.scaleClass}`)).not.toHaveLength(0);
      expect(view.getViewModel().getData('hasScale')).toBe(true);

      view.changeOptions({ hasScale: false });
      expect(target.querySelectorAll(`.${defaultClasses.scaleClass}`)).toHaveLength(0);
    });

    test('change scaleValue', () => {
      view.changeOptions({ hasScale: true });
      view.changeOptions({ scaleValue: 1 });
      expect(target.querySelectorAll(`.${defaultClasses.scaleElementClass}`)).toHaveLength(11);
      expect(view.getViewModel().getData('scaleValue')).toBe(1);
    });

    test('change hasValueInfo', () => {
      view.changeOptions({ hasValueInfo: true });
      expect(target.querySelectorAll(`.${defaultClasses.valueInfoClass}`)).not.toHaveLength(0);
      expect(view.getViewModel().getData('hasValueInfo')).toBe(true);

      view.changeOptions({ hasValueInfo: false });
      expect(target.querySelectorAll(`.${defaultClasses.valueInfoClass}`)).toHaveLength(0);
    });

    test('change isVertical', () => {
      view.changeOptions({ isVertical: true });
      expect(view.getElement('bar').style.height).toBe('100%');
      expect(view.getViewModel().getData('isVertical')).toBe(true);
    });

    test('many options', () => {
      view.changeOptions({
        length: '200px',
        hasTooltip: true,
        hasScale: true,
        scaleValue: 5,
        hasValueInfo: true,
        isVertical: true,
        useKeyboard: false,
        isScaleClickable: false,
        isBarClickable: false,
      });
      expect(view.getViewModel().getData('length')).toBe('200px');
      expect(view.getViewModel().getData('hasTooltip')).toBe(true);
      expect(view.getViewModel().getData('hasScale')).toBe(true);
      expect(view.getViewModel().getData('scaleValue')).toBe(5);
      expect(view.getViewModel().getData('hasValueInfo')).toBe(true);
      expect(view.getViewModel().getData('isVertical')).toBe(true);
      expect(view.getViewModel().getData('useKeyboard')).toBe(false);
      expect(view.getViewModel().getData('isScaleClickable')).toBe(false);
      expect(view.getViewModel().getData('isBarClickable')).toBe(false);
    });
  });

  describe('getElementProperties', () => {
    const whenIsVertical = {
      leftOrTop: 'top',
      rightOrBottom: 'bottom',
      widthOrHeight: 'height',
      offsetWidthOrHeight: 'offsetHeight',
      clientXOrY: 'clientY',
      opposites: null,
    };
    const whenIsNotVertical = {
      leftOrTop: 'left',
      rightOrBottom: 'right',
      widthOrHeight: 'width',
      offsetWidthOrHeight: 'offsetWidth',
      clientXOrY: 'clientX',
      opposites: null,
    };
    test('when isVertical is false getElementProperties should return object of horizontal properties with opposites', () => {
      expect(view.getElementProperties()).toEqual({
        ...whenIsNotVertical,
        opposites: whenIsVertical,
      });
    });
    test('when isVertical is true getElementProperties should return object of horizontal properties with opposites', () => {
      view.changeOptions({ isVertical: true });
      expect(view.getElementProperties()).toEqual({
        ...whenIsVertical,
        opposites: whenIsNotVertical,
      });
    });
  });

  describe('getThumbNumberThatCloserToPosition', () => {
    beforeEach(() => {
      view.getViewModel().setLengthInPx(100);
      view.setModelData({
        ...defaultModelOptions,
        isRange: true,
        value: [3, 6],
      });
    });

    test('when position closer to first thumb should return 0', () => {
      expect(view.getThumbNumberThatCloserToPosition(40)).toBe(0);
    });

    test('when position closer to second thumb should return 1', () => {
      expect(view.getThumbNumberThatCloserToPosition(50)).toBe(1);
    });
  });
});
