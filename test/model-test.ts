import Model from '../src/model/Model';

describe('model', () => {
  it('model options', () => {
    const modelTrueRange = new Model({
      value: 12,
      range: true,
      stepSize: 1,
      min: 0,
      max: 10,
    });

    expect(modelTrueRange.getValue()).toEqual([10, 10]);

    const modelFalseRange = new Model({
      value: [12, 12],
      range: false,
      stepSize: 1,
      min: 0,
      max: 10,
    });

    expect(modelFalseRange.getValue()).toBe(10);

    const model = new Model({
      value: [60, -100],
      range: true,
      stepSize: 100,
      min: 50,
      max: -15,
    });
    expect(model.min).toBe(-15);
    expect(model.max).toBe(50);

    expect(model.getValue()).toEqual([-15, 50]);
  });

  it('model stepSize', () => {
    const modelNegativeStepSize = new Model({
      value: 12,
      range: true,
      stepSize: -100,
      min: -15,
      max: 10,
    });
    expect(modelNegativeStepSize.stepSize).toBe(1);

    const modelPositiveStepSize = new Model({
      value: 12,
      range: true,
      stepSize: 100,
      min: -15,
      max: 10,
    });
    expect(modelPositiveStepSize.stepSize).toBe(10 + 15);
  });

  it('change value and addStepsToValue', () => {
    const model = new Model({
      value: [12, 14],
      range: true,
      stepSize: 1,
      min: 0,
      max: 15,
    });
    expect(model.changeValue(10)).toEqual([10, 10]);

    expect(model.changeValue([10, 15])).toEqual([10, 15]);

    expect(model.changeValue([10, -10])).toEqual([0, 10]);

    model.changeValue([12, 14]);
    expect(model.addStepsToValue(10)).toEqual([12, 15]);

    model.changeValue([-100, 14]);
    expect(model.addStepsToValue(10, 0)).toEqual([10, 14]);
  });
});
