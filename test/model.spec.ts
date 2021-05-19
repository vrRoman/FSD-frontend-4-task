import Model from '../src/modules/Model/Model';
import IModel from '../src/modules/Model/interfacesAndTypes';
import { defaultModelOptions } from '../src/options/defaultOptions';

describe('Model', () => {
  let model: IModel;

  beforeEach(() => {
    model = new Model(defaultModelOptions);
  });

  describe('getters with defaultOptions', () => {
    test('getValue', () => {
      expect(model.getValue()).toBe(0);
    });

    test('getIsRange', () => {
      expect(model.getIsRange()).toBe(false);
    });

    test('getMin', () => {
      expect(model.getMin()).toBe(0);
    });

    test('getMax', () => {
      expect(model.getMax()).toBe(10);
    });

    test('getStepSize', () => {
      expect(model.getStepSize()).toBe(1);
    });

    test('getMaxDiapason', () => {
      expect(model.getMaxDiapason()).toBe(10);
    });

    test('getMaxDiapason when min and max is float', () => {
      model = new Model({
        ...defaultModelOptions,
        min: 0.5,
        max: 6.7,
      });
      expect(model.getMaxDiapason()).toBe(6.2);
    });
  });

  describe('initial options', () => {
    test('incorrect min and max', () => {
      model = new Model({
        ...defaultModelOptions,
        min: 50,
        max: -12,
      });
      expect(model.getMax()).toBe(50);
      expect(model.getMin()).toBe(-12);
    });

    test('value > max', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 12,
      });
      expect(model.getValue()).toBe(10);
    });

    test('value < min', () => {
      model = new Model({
        ...defaultModelOptions,
        value: -1254,
      });
      expect(model.getValue()).toBe(0);
    });

    test('range false, value array', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 6],
      });
      expect(model.getValue()).toBe(2);
    });

    test('range true, value number', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
        isRange: true,
      });
      expect(model.getValue()).toEqual([3, 3]);
    });

    test('range true, first value > second value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [6, 2],
        isRange: true,
      });
      expect(model.getValue()).toEqual([2, 6]);
    });

    test('stepSize < 1', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 0.6,
      });
      expect(model.getStepSize()).toBe(1);
    });

    test('many incorrect values', () => {
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

  describe('setValue', () => {
    describe('when range is false', () => {
      test('correct value', () => {
        model.setValue(3);
        expect(model.getValue()).toBe(3);
      });

      test('when min < 0 and value < 0', () => {
        model = new Model({
          ...defaultModelOptions,
          min: -63,
        });
        model.setValue(-26);
        expect(model.getValue()).toBe(-26);
      });

      test('when value is less than min, value should equal to min', () => {
        model.setValue(3);
        model.setValue(-2);
        expect(model.getValue()).toBe(model.getMin());
      });

      test('when value is greater than max, value should equal to max', () => {
        model.setValue(11);
        expect(model.getValue()).toBe(model.getMax());
      });

      test('when value is array, value should be first element', () => {
        model.setValue([2, 4]);
        expect(model.getValue()).toBe(2);
      });

      test('when value is array with incorrect values, value should be fixed first element', () => {
        model.setValue([-2, 4]);
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

      test('correct value', () => {
        model.setValue([3, 5]);
        expect(model.getValue()).toEqual([3, 5]);
      });

      test('when values is less than min or greater tha max', () => {
        model.setValue([-2, 11]);
        expect(model.getValue()).toEqual([model.getMin(), model.getMax()]);
      });

      test('when value is not array, should be array with 2 equal values', () => {
        model.setValue(2);
        expect(model.getValue()).toEqual([2, 2]);
      });

      test('when value is less than min and is not array', () => {
        model.setValue(-3);
        expect(model.getValue()).toEqual([model.getMin(), model.getMin()]);
      });

      test('when value is greater than max and is not array', () => {
        model.setValue(12);
        expect(model.getValue()).toEqual([model.getMax(), model.getMax()]);
      });

      test('when value[1] > value[0] should reverse', () => {
        model.setValue([5, 2]);
        expect(model.getValue()).toEqual([2, 5]);
      });

      test('when value[1] > value[0] with incorrect values', () => {
        model.setValue([14, -1]);
        expect(model.getValue()).toEqual([model.getMin(), model.getMax()]);
      });
    });
  });

  describe('setMin', () => {
    test('correct min value', () => {
      model.setMin(2);
      expect(model.getMin()).toBe(2);
    });

    test('when min > max should reverse them', () => {
      model.setMin(15);
      expect(model.getMin()).toBe(10);
      expect(model.getMax()).toBe(15);
    });

    test('when not range and value < min should change value', () => {
      model.setMin(3);
      expect(model.getValue()).toBe(3);
    });

    test('when range and value[0] < min should change value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [0, 5],
        isRange: true,
      });
      model.setMin(3);
      expect(model.getValue()).toEqual([3, 5]);
    });

    test('when given min > max should change values', () => {
      model.setMin(15);
      expect(model.getValue()).toBe(10);
    });

    test('when range and given min > max should change values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [0, 5],
        isRange: true,
      });
      model.setMin(15);
      expect(model.getValue()).toEqual([10, 10]);
    });

    test('if stepSize > max - min should change stepSize', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 8,
      });
      model.setMin(5);
      expect(model.getStepSize()).toBe(model.getMaxDiapason());
    });
  });

  describe('setMax', () => {
    test('correct max value', () => {
      model.setMax(12);
      expect(model.getMax()).toBe(12);
    });

    test('when max < min should reverse them', () => {
      model.setMax(-16);
      expect(model.getMin()).toBe(-16);
      expect(model.getMax()).toBe(0);
    });

    test('when not range and value > max should change value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 10,
      });
      model.setMax(8);
      expect(model.getValue()).toBe(8);
    });

    test('when range and value[0] > max should change value', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 7],
        isRange: true,
      });
      model.setMax(6);
      expect(model.getValue()).toEqual([2, 6]);
    });

    test('when given max < min should change values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.setMax(-15);
      expect(model.getValue()).toBe(0);
    });

    test('when range and given max < min should change values', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 5],
        isRange: true,
      });
      model.setMax(-100);
      expect(model.getValue()).toEqual([0, 0]);
    });

    test('if stepSize > max - min should change stepSize', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 8,
      });
      model.setMax(2);
      expect(model.getStepSize()).toBe(model.getMaxDiapason());
    });
  });

  describe('setIsRange', () => {
    test('correct range value', () => {
      model.setIsRange(true);
      expect(model.getIsRange()).toBe(true);
    });

    test('when new range true should change value to array', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.setIsRange(true);
      expect(model.getValue()).toEqual([3, 3]);
    });

    test('when new range false should change value to first element of array', () => {
      model = new Model({
        ...defaultModelOptions,
        value: [2, 7],
        isRange: true,
      });
      model.setIsRange(false);
      expect(model.getValue()).toBe(2);
    });
  });

  describe('setStepSize', () => {
    test('correct stepSize value', () => {
      model.setStepSize(2);
      expect(model.getStepSize()).toBe(2);
    });

    test('when stepSize < 1 should be 1', () => {
      model.setStepSize(-4);
      expect(model.getStepSize()).toBe(1);
      model.setStepSize(0);
      expect(model.getStepSize()).toBe(1);
    });

    test('when stepSize > max - min', () => {
      model.setStepSize(11);
      expect(model.getStepSize()).toBe(model.getMaxDiapason());
      model.setStepSize(10.5);
      expect(model.getStepSize()).toBe(model.getMaxDiapason());
    });
  });

  describe('addStepsToValue', () => {
    test('correct steps value', () => {
      model.addStepsToValue(2);
      expect(model.getValue()).toBe(2);
    });

    test('when stepSize not 1', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 3,
      });
      model.addStepsToValue(3);
      expect(model.getValue()).toBe(9);
    });

    test('when numberOfSteps < 0', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.addStepsToValue(-2);
      expect(model.getValue()).toBe(1);
    });

    test('when numberOfSteps == 0', () => {
      model = new Model({
        ...defaultModelOptions,
        value: 3,
      });
      model.addStepsToValue(0);
      expect(model.getValue()).toBe(3);
    });

    test('when new value > max', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 3,
      });
      model.addStepsToValue(6);
      expect(model.getValue()).toBe(10);
    });

    test('when has valueNumber and not range', () => {
      model.addStepsToValue(6, 1);
      expect(model.getValue()).toBe(6);
    });

    test('when range', () => {
      model = new Model({
        ...defaultModelOptions,
        isRange: true,
        stepSize: 2,
      });
      model.addStepsToValue(5, 1);
      model.addStepsToValue(2, 0);
      expect(model.getValue()).toEqual([4, 10]);
    });

    test('when range and addStepsToValue for first value > second value', () => {
      model = new Model({
        ...defaultModelOptions,
        isRange: true,
        value: [1, 5],
        stepSize: 2,
      });
      model.addStepsToValue(7, 0);
      expect(model.getValue()).toEqual([5, 5]);
    });

    test('when stepSize is float', () => {
      model = new Model({
        ...defaultModelOptions,
        isRange: true,
        stepSize: 2.2,
      });
      model.addStepsToValue(2, 1);
      expect(model.getValue()).toEqual([0, 4.4]);
    });

    test('when numberOfSteps is float', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 2,
      });
      model.addStepsToValue(2.4);
      expect(model.getValue()).toBe(4.8);
    });

    test('when shouldRound', () => {
      model.addStepsToValue(4, 0, true);
      expect(model.getValue()).toBe(4);
      model.addStepsToValue(-2, 0, true);
      expect(model.getValue()).toBe(2);
    });

    test('when shouldRound, numberOfSteps is float and stepSize is integer', () => {
      model.addStepsToValue(1.3, 0, true);
      expect(model.getValue()).toBe(1);
    });

    test('when shouldRound true, stepSize is float, numberOfSteps is integer', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 2.7,
      });
      model.addStepsToValue(2, 0, true);
      expect(model.getValue()).toBe(5.4);
    });

    test('when shouldRound true, stepSize and numberOfSteps are float', () => {
      model = new Model({
        ...defaultModelOptions,
        stepSize: 2.7,
      });
      model.addStepsToValue(2.4, 1, true);
      expect(model.getValue()).toBe(6.5);
    });
  });

  describe('changeOptions', () => {
    test('should change value', () => {
      model.changeOptions({
        value: 2,
      });
      expect(model.getValue()).toBe(2);
    });

    test('should change isRange', () => {
      model.changeOptions({
        isRange: true,
      });
      expect(model.getIsRange()).toBe(true);
    });

    test('should change stepSize', () => {
      model.changeOptions({
        stepSize: 4,
      });
      expect(model.getStepSize()).toBe(4);
    });

    test('should change min', () => {
      model.changeOptions({
        min: 4,
      });
      expect(model.getMin()).toBe(4);
    });

    test('should change max', () => {
      model.changeOptions({
        max: 4,
      });
      expect(model.getMax()).toBe(4);
    });

    test('incorrect values', () => {
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
});
