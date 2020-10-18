import { assert } from 'chai';
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

    // @ts-ignore
    assert.strictEqual(modelTrueRange.value[0], 10);
    // @ts-ignore
    assert.strictEqual(modelTrueRange.value[1], 10);

    const modelFalseRange = new Model({
      value: [12, 12],
      range: false,
      stepSize: 1,
      min: 0,
      max: 10,
    });

    assert.strictEqual(modelFalseRange.value, 10);

    const model = new Model({
      value: [60, -100],
      range: true,
      stepSize: 100,
      min: 50,
      max: -15,
    });
    assert.strictEqual(model.min, -15);
    assert.strictEqual(model.max, 50);
    // @ts-ignore
    assert.strictEqual(model.value[0], -15);
    // @ts-ignore
    assert.strictEqual(model.value[1], 50);
  });

  it('model stepSize', () => {
    const modelNegativeStepSize = new Model({
      value: 12,
      range: true,
      stepSize: -100,
      min: -15,
      max: 10,
    });

    assert.strictEqual(modelNegativeStepSize.stepSize, 1);

    const modelPositiveStepSize = new Model({
      value: 12,
      range: true,
      stepSize: 100,
      min: -15,
      max: 10,
    });

    assert.strictEqual(modelPositiveStepSize.stepSize, 25);
  });

  it('change value and addStepsToValue', () => {
    const model = new Model({
      value: [12, 14],
      range: true,
      stepSize: 1,
      min: 0,
      max: 15,
    });
    // @ts-ignore
    assert.strictEqual(model.changeValue(10)[0], 10);
    // @ts-ignore
    assert.strictEqual(model.changeValue(10)[1], 10);

    // @ts-ignore
    assert.strictEqual(model.changeValue([10, 15])[0], 10);
    // @ts-ignore
    assert.strictEqual(model.changeValue([10, -10])[1], 10);
    // @ts-ignore
    assert.strictEqual(model.changeValue([10, -10])[0], 0);

    model.changeValue([12, 14]);

    // @ts-ignore
    assert.strictEqual(model.addStepsToValue(10)[1], 15);

    model.changeValue([-100, 14]);
    // @ts-ignore
    assert.strictEqual(model.addStepsToValue(10, 0)[0], 10);
  });
});
