import { defaultModelOptions } from 'defaults/defaultOptions';

import Model from './Model';
import { IModel } from './Model.model';

describe('Model', () => {
  let model: IModel;

  beforeEach(() => {
    model = new Model(defaultModelOptions);
  });

  describe('getters with defaultOptions', () => {
    test('getValue should return current value', () => {
      expect(model.getValue()).toBe(0);
    });

    test('getIsRange should return current isRange', () => {
      expect(model.getIsRange()).toBe(false);
    });

    test('getMin should return current min', () => {
      expect(model.getMin()).toBe(0);
    });

    test('getMax should return current max', () => {
      expect(model.getMax()).toBe(10);
    });

    test('getStepSize should return current stepSize', () => {
      expect(model.getStepSize()).toBe(1);
    });

    test('getMaxDiapason should return (max - min)', () => {
      expect(model.getMaxDiapason()).toBe(10);
    });

    test('getMaxDiapason when min and max is float should return (max - min)', () => {
      model = new Model({
        ...defaultModelOptions,
        min: 0.5,
        max: 6.7,
      });
      expect(model.getMaxDiapason()).toBe(6.2);
    });
  });

  describe('initial options', () => {
    test('when max > min should reverse them', () => {
      model = new Model({
        ...defaultModelOptions,
        min: 50,
        max: -12,
      });
      expect(model.getMax()).toBe(50);
      expect(model.getMin()).toBe(-12);
    });

    test('when value > max should change value to max', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 12,
      });
      expect(model.getValue()).toBe(10);
    });

    test('when value < min should change value to min', () => {
      model = new Model({
        ...defaultModelOptions,
        value: -1254,
      });
      expect(model.getValue()).toBe(0);
    });

    test('when range is false but value is array should change value to first element', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 6],
      });
      expect(model.getValue()).toBe(2);
    });

    test('when range is true but value is number should change value to array of equal elements', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
        isRange: true,
      });
      expect(model.getValue()).toEqual([3, 3]);
    });

    test('when range true, first value > second value should reverse values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [6, 2],
        isRange: true,
      });
      expect(model.getValue()).toEqual([2, 6]);
    });

    test('when stepSize < 1 should change to 1', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 0.6,
      });
      expect(model.getStepSize()).toBe(1);
    });

    test('when many incorrect values should change them all', () => {
      model = new Model({
        value: 25,
        isRange: true,
        stepSize: -1,
        min: 15,
        max: -2,
      });
      expect(model.getMin()).toBe(-2);
      expect(model.getMax()).toBe(15);
      expect(model.getValue()).toEqual([15, 15]);
      expect(model.getStepSize()).toBe(1);
    });
  });

  describe('change value', () => {
    describe('when range is false', () => {
      test('should change value', () => {
        model.changeOptions({ value: 3 });
        expect(model.getValue()).toBe(3);
      });

      test('when min < 0 and value < 0 should change to it', () => {
        model = new Model({
          ...defaultModelOptions,
          min: -63,
        });
        model.changeOptions({ value: -26 });
        expect(model.getValue()).toBe(-26);
      });

      test('when value is less than min, value should equal to min', () => {
        model.changeOptions({ value: 3 });
        model.changeOptions({ value: -2 });
        expect(model.getValue()).toBe(model.getMin());
      });

      test('when value is greater than max, value should equal to max', () => {
        model.changeOptions({ value: 11 });
        expect(model.getValue()).toBe(model.getMax());
      });

      test('when value is array, value should be first element', () => {
        model.changeOptions({ value: [2, 4] });
        expect(model.getValue()).toBe(2);
      });

      test('when value is array with incorrect values, value should be fixed first element', () => {
        model.changeOptions({ value: [-2, 4] });
        expect(model.getValue()).toBe(model.getMin());
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
        model.changeOptions({ value: [3, 5] });
        expect(model.getValue()).toEqual([3, 5]);
      });

      test('when values is less than min or greater than max should change them to min or max', () => {
        model.changeOptions({ value: [-2, 11] });
        expect(model.getValue()).toEqual([model.getMin(), model.getMax()]);
      });

      test('when value is not array, should be array with 2 equal values', () => {
        model.changeOptions({ value: 2 });
        expect(model.getValue()).toEqual([2, 2]);
      });

      test('when value is less than min and is not array should change to array of two min values', () => {
        model.changeOptions({ value: -3 });
        expect(model.getValue()).toEqual([model.getMin(), model.getMin()]);
      });

      test('when value is greater than max and is not array should change to array of two max values', () => {
        model.changeOptions({ value: 12 });
        expect(model.getValue()).toEqual([model.getMax(), model.getMax()]);
      });

      test('when value[1] > value[0] should reverse', () => {
        model.changeOptions({ value: [5, 2] });
        expect(model.getValue()).toEqual([2, 5]);
      });

      test('when value[1] > value[0] and greater/less than max/min should change to array of min and max', () => {
        model.changeOptions({ value: [14, -1] });
        expect(model.getValue()).toEqual([model.getMin(), model.getMax()]);
      });
    });
  });

  describe('change min', () => {
    test('should change min', () => {
      model.changeOptions({ min: 2 });
      expect(model.getMin()).toBe(2);
    });

    test('when min > max should reverse them', () => {
      model.changeOptions({ min: 15 });
      expect(model.getMin()).toBe(10);
      expect(model.getMax()).toBe(15);
    });

    test('when not range and value < min should change value', () => {
      model.changeOptions({ min: 3 });
      expect(model.getValue()).toBe(3);
    });

    test('when range and value[0] < min should change value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [0, 5],
        isRange: true,
      });
      model.changeOptions({ min: 3 });
      expect(model.getValue()).toEqual([3, 5]);
    });

    test('when given min > max should change values', () => {
      model.changeOptions({ min: 15 });
      expect(model.getValue()).toBe(10);
    });

    test('when range and given min > max should change values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [0, 5],
        isRange: true,
      });
      model.changeOptions({ min: 15 });
      expect(model.getValue()).toEqual([10, 10]);
    });

    test('if stepSize > max - min should change stepSize', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 8,
      });
      model.changeOptions({ min: 5 });
      expect(model.getStepSize()).toBe(model.getMaxDiapason());
    });
  });

  describe('change max', () => {
    test('should change max', () => {
      model.changeOptions({ max: 12 });
      expect(model.getMax()).toBe(12);
    });

    test('when max < min should reverse them', () => {
      model.changeOptions({ max: -16 });
      expect(model.getMin()).toBe(-16);
      expect(model.getMax()).toBe(0);
    });

    test('when not range and value > max should change value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 10,
      });
      model.changeOptions({ max: 8 });
      expect(model.getValue()).toBe(8);
    });

    test('when range and value[0] > max should change value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 7],
        isRange: true,
      });
      model.changeOptions({ max: 6 });
      expect(model.getValue()).toEqual([2, 6]);
    });

    test('when given max < min should change values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.changeOptions({ max: -15 });
      expect(model.getValue()).toBe(0);
    });

    test('when range and given max < min should change values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 5],
        isRange: true,
      });
      model.changeOptions({ max: -100 });
      expect(model.getValue()).toEqual([0, 0]);
    });

    test('if stepSize > max - min should change stepSize', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 8,
      });
      model.changeOptions({ max: 2 });
      expect(model.getStepSize()).toBe(model.getMaxDiapason());
    });
  });

  describe('change isRange', () => {
    test('should change isRange', () => {
      model.changeOptions({ isRange: true });
      expect(model.getIsRange()).toBe(true);
    });

    test('when new range true should change value to array', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.changeOptions({ isRange: true });
      expect(model.getValue()).toEqual([3, 3]);
    });

    test('when new range false should change value to first element of array', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 7],
        isRange: true,
      });
      model.changeOptions({ isRange: false });
      expect(model.getValue()).toBe(2);
    });
  });

  describe('change stepSize', () => {
    test('should change stepSize', () => {
      model.changeOptions({ stepSize: 2 });
      expect(model.getStepSize()).toBe(2);
    });

    test('when stepSize < 1 should be 1', () => {
      model.changeOptions({ stepSize: -4 });
      expect(model.getStepSize()).toBe(1);
      model.changeOptions({ stepSize: 0 });
      expect(model.getStepSize()).toBe(1);
    });

    test('when stepSize > (max - min) should change to (max - min)', () => {
      model.changeOptions({ stepSize: 11 });
      expect(model.getStepSize()).toBe(model.getMaxDiapason());
      model.changeOptions({ stepSize: 10.5 });
      expect(model.getStepSize()).toBe(model.getMaxDiapason());
    });
  });

  describe('addStepsToValue', () => {
    test('should add to value n steps', () => {
      model.addStepsToValue(2);
      expect(model.getValue()).toBe(2);
    });

    test('should count stepSize', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 3,
      });
      model.addStepsToValue(3);
      expect(model.getValue()).toBe(9);
    });

    test('when numberOfSteps < 0 should decrease value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.addStepsToValue(-2);
      expect(model.getValue()).toBe(1);
    });

    test('when numberOfSteps is 0 should do nothing', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.addStepsToValue(0);
      expect(model.getValue()).toBe(3);
    });

    test('when new value > max should change to max', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 3,
      });
      model.addStepsToValue(6);
      expect(model.getValue()).toBe(10);
    });

    test('when new value < min should change to min', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 3,
      });
      model.addStepsToValue(-6);
      expect(model.getValue()).toBe(0);
    });

    test('when has valueNumber and not range anyway should change value', () => {
      model.addStepsToValue(6, 1);
      expect(model.getValue()).toBe(6);
    });

    test('when isRange is true and has valueNumber should change value[valueNumber]', () => {
      model = new Model({
        ...defaultModelOptions,
        isRange: true,
        stepSize: 2,
      });
      model.addStepsToValue(5, 1);
      model.addStepsToValue(2, 0);
      expect(model.getValue()).toEqual([4, 10]);
    });

    test('when range and addStepsToValue for first value > second value should change to second value', () => {
      model = new Model({
        ...defaultModelOptions,
        isRange: true,
        value: [1, 5],
        stepSize: 2,
      });
      model.addStepsToValue(7, 0);
      expect(model.getValue()).toEqual([5, 5]);

      model.changeOptions({ value: [2, 7] });
      model.addStepsToValue(-8, 1);
      expect(model.getValue()).toEqual([2, 2]);
    });

    test('when stepSize is float should correct change value', () => {
      model = new Model({
        ...defaultModelOptions,
        isRange: true,
        stepSize: 2.2,
      });
      model.addStepsToValue(2, 1);
      expect(model.getValue()).toEqual([0, 4.4]);
    });

    test('when numberOfSteps is float should correct change value', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 2,
      });
      model.addStepsToValue(2.4);
      expect(model.getValue()).toBe(4.8);
    });
  });

  test('changeOptions when many incorrect values should change all of them', () => {
    model.changeOptions({
      value: 25,
      isRange: true,
      stepSize: -1,
      min: 15,
      max: -2,
    });
    expect(model.getMin()).toBe(-2);
    expect(model.getMax()).toBe(15);
    expect(model.getValue()).toEqual([15, 15]);
    expect(model.getStepSize()).toBe(1);
  });
});
