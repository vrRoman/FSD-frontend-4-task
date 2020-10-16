import { assert } from 'chai';
import Model from '../src/model/Model';

describe('model', () => {
  it('model value', () => {
    const modelTrueRange = new Model({
      value: 12,
      range: true,
      stepSize: 1,
      min: 0,
      max: 15,
    });

    // @ts-ignore
    assert.strictEqual(modelTrueRange.value[0], 12);
    // @ts-ignore
    assert.strictEqual(modelTrueRange.value[1], 12);

    const modelFalseRange = new Model({
      value: [12, 12],
      range: false,
      stepSize: 1,
      min: 0,
      max: 15,
    });

    assert.strictEqual(modelFalseRange.value, 12);
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
    const modelTrueRange = new Model({
      value: [12, 14],
      range: true,
      stepSize: 1,
      min: 0,
      max: 10,
    });
    // @ts-ignore
    assert.strictEqual(modelTrueRange.changeValue(10)[0], 10);
    // @ts-ignore
    assert.strictEqual(modelTrueRange.changeValue(10)[1], 10);

    // @ts-ignore
    assert.strictEqual(modelTrueRange.changeValue([10, 15])[0], 10);
    // @ts-ignore
    assert.strictEqual(modelTrueRange.changeValue([10, 15])[1], 15);

    // const modelFalseRange = new Model({
    //   value: 12,
    //   range: false,
    //   stepSize: 1,
    //   min: 0,
    //   max: 10,
    // });
    // assert.strictEqual(modelFalseRange.changeValue(10), 10);
    // assert.strictEqual(modelFalseRange.changeValue([10, 15]), 10);
  });
});
