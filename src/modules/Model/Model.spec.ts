import { defaultModelOptions } from 'constants/defaultOptions';

import Model from './Model';
import { IModel } from './Model.model';

describe('Model', () => {
  let model: IModel;

  beforeEach(() => {
    model = new Model(defaultModelOptions);
  });

  describe('getters with defaultOptions', () => {
    test('model.getData("value") should return current value', () => {
      expect(model.getData('value')).toBe(0);
    });

    test('model.getData("isRange") should return current isRange', () => {
      expect(model.getData('isRange')).toBe(false);
    });

    test('model.getData("min") should return current min', () => {
      expect(model.getData('min')).toBe(0);
    });

    test('model.getData("max") should return current max', () => {
      expect(model.getData('max')).toBe(10);
    });

    test('model.getData("stepSize") should return current stepSize', () => {
      expect(model.getData('stepSize')).toBe(1);
    });
  });

  describe('initial options', () => {
    test('when max > min should reverse them', () => {
      model = new Model({
        ...defaultModelOptions,
        min: 50,
        max: -12,
      });
      expect(model.getData('max')).toBe(50);
      expect(model.getData('min')).toBe(-12);
    });

    test('when value > max should change value to max', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 12,
      });
      expect(model.getData('value')).toBe(10);
    });

    test('when value < min should change value to min', () => {
      model = new Model({
        ...defaultModelOptions,
        value: -1254,
      });
      expect(model.getData('value')).toBe(0);
    });

    test('when range is false but value is array should change value to first element', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 6],
      });
      expect(model.getData('value')).toBe(2);
    });

    test('when range is true but value is number should change value to array of equal elements', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
        isRange: true,
      });
      expect(model.getData('value')).toEqual([3, 3]);
    });

    test('when range true, first value > second value should reverse values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [6, 2],
        isRange: true,
      });
      expect(model.getData('value')).toEqual([2, 6]);
    });

    test('when stepSize < 1 should change to 1', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 0.6,
      });
      expect(model.getData('stepSize')).toBe(1);
    });

    test('when many incorrect values should change them all', () => {
      model = new Model({
        value: 25,
        isRange: true,
        stepSize: -1,
        min: 15,
        max: -2,
      });
      expect(model.getData('min')).toBe(-2);
      expect(model.getData('max')).toBe(15);
      expect(model.getData('value')).toEqual([15, 15]);
      expect(model.getData('stepSize')).toBe(1);
    });
  });

  describe('change value', () => {
    describe('when range is false', () => {
      test('should change value', () => {
        model.changeData({ value: 3 });
        expect(model.getData('value')).toBe(3);
      });

      test('when min < 0 and value < 0 should change to it', () => {
        model = new Model({
          ...defaultModelOptions,
          min: -63,
        });
        model.changeData({ value: -26 });
        expect(model.getData('value')).toBe(-26);
      });

      test('when value is less than min, value should equal to min', () => {
        model.changeData({ value: 3 });
        model.changeData({ value: -2 });
        expect(model.getData('value')).toBe(model.getData('min'));
      });

      test('when value is greater than max, value should equal to max', () => {
        model.changeData({ value: 11 });
        expect(model.getData('value')).toBe(model.getData('max'));
      });

      test('when value is array, value should be first element', () => {
        model.changeData({ value: [2, 4] });
        expect(model.getData('value')).toBe(2);
      });

      test('when value is array with incorrect values, value should be fixed first element', () => {
        model.changeData({ value: [-2, 4] });
        expect(model.getData('value')).toBe(model.getData('min'));
      });
    });

    describe('when range is true', () => {
      beforeEach(() => {
        model = new Model({
          ...defaultModelOptions,
          isRange: true,
        });
      });

      test('should change value', () => {
        model.changeData({ value: [3, 5] });
        expect(model.getData('value')).toEqual([3, 5]);
      });

      test('when values is less than min or greater than max should change them to min or max', () => {
        model.changeData({ value: [-2, 11] });
        expect(model.getData('value')).toEqual([model.getData('min'), model.getData('max')]);
      });

      test('when value is not array, should be array with 2 equal values', () => {
        model.changeData({ value: 2 });
        expect(model.getData('value')).toEqual([2, 2]);
      });

      test('when value is less than min and is not array should change to array of two min values', () => {
        model.changeData({ value: -3 });
        expect(model.getData('value')).toEqual([model.getData('min'), model.getData('min')]);
      });

      test('when value is greater than max and is not array should change to array of two max values', () => {
        model.changeData({ value: 12 });
        expect(model.getData('value')).toEqual([model.getData('max'), model.getData('max')]);
      });

      test('when value[1] > value[0] should reverse', () => {
        model.changeData({ value: [5, 2] });
        expect(model.getData('value')).toEqual([2, 5]);
      });

      test('when value[1] > value[0] and greater/less than max/min should change to array of min and max', () => {
        model.changeData({ value: [14, -1] });
        expect(model.getData('value')).toEqual([model.getData('min'), model.getData('max')]);
      });
    });
  });

  describe('change min', () => {
    test('should change min', () => {
      model.changeData({ min: 2 });
      expect(model.getData('min')).toBe(2);
    });

    test('when min > max should reverse them', () => {
      model.changeData({ min: 15 });
      expect(model.getData('min')).toBe(10);
      expect(model.getData('max')).toBe(15);
    });

    test('when not range and value < min should change value', () => {
      model.changeData({ min: 3 });
      expect(model.getData('value')).toBe(3);
    });

    test('when range and value[0] < min should change value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [0, 5],
        isRange: true,
      });
      model.changeData({ min: 3 });
      expect(model.getData('value')).toEqual([3, 5]);
    });

    test('when given min > max should change values', () => {
      model.changeData({ min: 15 });
      expect(model.getData('value')).toBe(10);
    });

    test('when range and given min > max should change values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [0, 5],
        isRange: true,
      });
      model.changeData({ min: 15 });
      expect(model.getData('value')).toEqual([10, 10]);
    });

    test('if stepSize > max - min should change stepSize', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 8,
      });
      model.changeData({ min: 5 });
      expect(model.getData('stepSize')).toBe(model.getData('max') - model.getData('min'));
    });
  });

  describe('change max', () => {
    test('should change max', () => {
      model.changeData({ max: 12 });
      expect(model.getData('max')).toBe(12);
    });

    test('when max < min should reverse them', () => {
      model.changeData({ max: -16 });
      expect(model.getData('min')).toBe(-16);
      expect(model.getData('max')).toBe(0);
    });

    test('when not range and value > max should change value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 10,
      });
      model.changeData({ max: 8 });
      expect(model.getData('value')).toBe(8);
    });

    test('when range and value[0] > max should change value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 7],
        isRange: true,
      });
      model.changeData({ max: 6 });
      expect(model.getData('value')).toEqual([2, 6]);
    });

    test('when given max < min should change values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.changeData({ max: -15 });
      expect(model.getData('value')).toBe(0);
    });

    test('when range and given max < min should change values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 5],
        isRange: true,
      });
      model.changeData({ max: -100 });
      expect(model.getData('value')).toEqual([0, 0]);
    });

    test('if stepSize > max - min should change stepSize', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 8,
      });
      model.changeData({ max: 2 });
      expect(model.getData('stepSize')).toBe(model.getData('max') - model.getData('min'));
    });
  });

  describe('change isRange', () => {
    test('should change isRange', () => {
      model.changeData({ isRange: true });
      expect(model.getData('isRange')).toBe(true);
    });

    test('when new range true should change value to array', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.changeData({ isRange: true });
      expect(model.getData('value')).toEqual([3, 3]);
    });

    test('when new range false should change value to first element of array', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 7],
        isRange: true,
      });
      model.changeData({ isRange: false });
      expect(model.getData('value')).toBe(2);
    });
  });

  describe('change stepSize', () => {
    test('should change stepSize', () => {
      model.changeData({ stepSize: 2 });
      expect(model.getData('stepSize')).toBe(2);
    });

    test('when stepSize < 1 should be 1', () => {
      model.changeData({ stepSize: -4 });
      expect(model.getData('stepSize')).toBe(1);
      model.changeData({ stepSize: 0 });
      expect(model.getData('stepSize')).toBe(1);
    });

    test('when stepSize > (max - min) should change to (max - min)', () => {
      model.changeData({ stepSize: 11 });
      expect(model.getData('stepSize')).toBe(model.getData('max') - model.getData('min'));
      model.changeData({ stepSize: 10.5 });
      expect(model.getData('stepSize')).toBe(model.getData('max') - model.getData('min'));
    });
  });

  describe('addStepsToValue', () => {
    test('should add to value n steps', () => {
      model.addStepsToValue(2);
      expect(model.getData('value')).toBe(2);
    });

    test('should count stepSize', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 3,
      });
      model.addStepsToValue(3);
      expect(model.getData('value')).toBe(9);
    });

    test('when numberOfSteps < 0 should decrease value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.addStepsToValue(-2);
      expect(model.getData('value')).toBe(1);
    });

    test('when numberOfSteps is 0 should do nothing', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.addStepsToValue(0);
      expect(model.getData('value')).toBe(3);
    });

    test('when new value > max should change to max', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 3,
      });
      model.addStepsToValue(6);
      expect(model.getData('value')).toBe(10);
    });

    test('when new value < min should change to min', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 3,
      });
      model.addStepsToValue(-6);
      expect(model.getData('value')).toBe(0);
    });

    test('when has valueNumber and not range anyway should change value', () => {
      model.addStepsToValue(6, 1);
      expect(model.getData('value')).toBe(6);
    });

    test('when isRange is true and has valueNumber should change value[valueNumber]', () => {
      model = new Model({
        ...defaultModelOptions,
        isRange: true,
        stepSize: 2,
      });
      model.addStepsToValue(5, 1);
      model.addStepsToValue(2, 0);
      expect(model.getData('value')).toEqual([4, 10]);
    });

    test('when range and addStepsToValue for first value > second value should change to second value', () => {
      model = new Model({
        ...defaultModelOptions,
        isRange: true,
        value: [1, 5],
        stepSize: 2,
      });
      model.addStepsToValue(7, 0);
      expect(model.getData('value')).toEqual([5, 5]);

      model.changeData({ value: [2, 7] });
      model.addStepsToValue(-8, 1);
      expect(model.getData('value')).toEqual([2, 2]);
    });

    test('when stepSize is float should correct change value', () => {
      model = new Model({
        ...defaultModelOptions,
        isRange: true,
        stepSize: 2.2,
      });
      model.addStepsToValue(2, 1);
      expect(model.getData('value')).toEqual([0, 4.4]);
    });

    test('when numberOfSteps is float should correct change value', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 2,
      });
      model.addStepsToValue(2.4);
      expect(model.getData('value')).toBe(4.8);
    });
  });

  test('changeData when many incorrect values should change all of them', () => {
    model.changeData({
      value: 25,
      isRange: true,
      stepSize: -1,
      min: 15,
      max: -2,
    });
    expect(model.getData('min')).toBe(-2);
    expect(model.getData('max')).toBe(15);
    expect(model.getData('value')).toEqual([15, 15]);
    expect(model.getData('stepSize')).toBe(1);
  });
});
