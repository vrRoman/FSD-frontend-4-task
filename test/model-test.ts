import Model from '../src/Model';
import View from '../src/View';
import Presenter from '../src/Presenter';
import { IModel } from '../src/interfaces/modelTypesAndInterfaces';
import { IView } from '../src/interfaces/viewInterfaces';
import { IPresenter } from '../src/interfaces/presenterInterfaces';
import { PresenterOptions, ViewOptions, ModelOptions } from '../src/interfaces/options';

const defaultOptions = {
  value: 0,
  range: false,
  stepSize: 1,
  min: 0,
  max: 10,
};


describe('model get methods and props', () => {
  let model: IModel;

  beforeEach(() => {
    model = new Model(defaultOptions);
  });

  it('getValue', () => {
    expect(model.getValue()).toBe(0);
  });
  it('getRange', () => {
    expect(model.getRange()).toBe(false);
  });
  it('getStepSize', () => {
    expect(model.getStepSize()).toBe(1);
  });
  it('max and min', () => {
    expect(model.getMin()).toBe(0);
    expect(model.getMax()).toBe(10);
  });
  it('get max diapason', () => {
    expect(model.getMaxDiapason()).toBe(10);
  });
});


describe('Model value, stepSize, min/max checking', () => {
  it('value is array when range = true', () => {
    const options: ModelOptions = {
      ...defaultOptions,
      range: true,
      value: 2,
    };
    const modelRange = new Model(options);
    expect(modelRange.getValue()).toEqual([2, 2]);
  });
  it('value is number(value[0]) when range = false', () => {
    const options: ModelOptions = {
      ...defaultOptions,
      range: false,
      value: [2, 8],
    };
    const modelRange = new Model(options);
    expect(modelRange.getValue()).toBe(2);
  });

  it('value is reversed if value[0] > value[1]', () => {
    const options: ModelOptions = {
      ...defaultOptions,
      range: true,
      value: [3, 1],
    };
    const modelValue = new Model(options);
    expect(modelValue.getValue()).toEqual([1, 3]);
  });
  it('checking of min and max values', () => {
    let options: ModelOptions = {
      ...defaultOptions,
      value: -10,
    };
    const modelMin = new Model(options);
    expect(modelMin.getValue()).toBe(0);

    options = {
      ...defaultOptions,
      value: 30,
    };
    const modelMax = new Model(options);
    expect(modelMax.getValue()).toBe(10);

    options = {
      ...defaultOptions,
      value: [-10, 30],
      range: true,
    };
    const modelMinMaxRange = new Model(options);
    expect(modelMinMaxRange.getValue()).toEqual([0, 10]);
  });

  it('min-max, range, value checking together', () => {
    const options: ModelOptions = {
      ...defaultOptions,
      value: [-100, 59],
      range: false,
    };
    const modelValue = new Model(options);
    expect(modelValue.getValue()).toBe(0);
  });

  it('when stepSize < 0, stepSize = 1', () => {
    const options: ModelOptions = {
      ...defaultOptions,
      stepSize: -12,
    };
    const modelNegativeStep = new Model(options);
    expect(modelNegativeStep.getStepSize()).toBe(1);
  });

  it('if max > min, swap them, value is correct', () => {
    const options: ModelOptions = {
      ...defaultOptions,
      min: 12,
      max: 0,
      value: -30,
    };
    const modelMinMax = new Model(options);
    expect(modelMinMax.getMin()).toBe(0);
    expect(modelMinMax.getMax()).toBe(12);

    expect(modelMinMax.getValue()).toBe(0);
  });
});


describe('model props change', () => {
  let model: IModel;
  beforeEach(() => {
    model = new Model(defaultOptions);
  });

  it('set value', () => {
    model.setValue(2);
    expect(model.getValue()).toBe(2);
  });
  it('setValue with incorrect value', () => {
    model.setValue([-10, 12763]);
    expect(model.getValue()).toBe(0);
  });

  it('setRange change range and value', () => {
    model.setRange(true);
    expect(model.getRange()).toBe(true);
    expect(model.getValue()).toEqual([0, 0]);
  });

  it('setStepSize', () => {
    model.setStepSize(3);
    expect(model.getStepSize()).toBe(3);
  });
  it('setStepSize with incorrect stepSize', () => {
    model.setStepSize(-100);
    expect(model.getStepSize()).toBe(1);
  });

  it('addStepsToValue with range=false and stepSize=1', () => {
    model.addStepsToValue(2);
    expect(model.getValue()).toBe(2);
  });
  it('addStepsToValue with range=false and stepSize != 1', () => {
    model.setStepSize(3);
    model.addStepsToValue(2);
    expect(model.getValue()).toBe(6);
  });
  it('addStepsToValue with range=true', () => {
    model.setRange(true);
    model.setValue([0, 6]);

    model.addStepsToValue(2);
    expect(model.getValue()).toEqual([0, 8]);

    model.addStepsToValue(2, 0);
    expect(model.getValue()).toEqual([2, 8]);
  });
  it('addStepsToValue with negative numOfSteps', () => {
    model.setValue(7);
    model.addStepsToValue(-3);
    expect(model.getValue()).toBe(4);
  });
  it('addStepsToValue check min and max', () => {
    model.setRange(true);
    model.addStepsToValue(-15, 0);
    model.addStepsToValue(17, 1);
    expect(model.getValue()).toEqual([0, 10]);
  });
  it('addStepsToValue when range=true and value[0]>value[1]', () => {
    model.setRange(true);
    model.setValue([1, 4]);
    model.addStepsToValue(5, 0);
    expect(model.getValue()).toEqual([4, 4]);
    model.setValue([1, 4]);
    model.addStepsToValue(-5, 1);
    expect(model.getValue()).toEqual([1, 1]);
  });
  it('setMin', () => {
    model.setMin(2);
    expect(model.getMin()).toBe(2);
    expect(model.getValue()).toBe(2);
    model.setMin(-1);
    expect(model.getMin()).toBe(-1);
    expect(model.getValue()).toBe(2);
  });
  it('setMax', () => {
    model.setValue(10);
    model.setMax(2);
    expect(model.getMax()).toBe(2);
    expect(model.getValue()).toBe(2);
    model.setMax(7);
    expect(model.getMax()).toBe(7);
    expect(model.getValue()).toBe(2);
  });
});

describe('Model change range, value with Observer', () => {
  let model: IModel;
  let view: IView;
  let presenter: IPresenter;
  const defaultViewOptions: ViewOptions = {
    length: '200px',
    tooltip: false,
    stepsInfo: false,
    valueInfo: false,
    vertical: false,
    responsive: false,
    interactiveStepsInfo: false,
    useKeyboard: true,
  };
  const defaultPresenterOptions: PresenterOptions = {};

  beforeEach(() => {
    model = new Model(defaultOptions);
    view = new View(defaultViewOptions, document.body);
    presenter = new Presenter(model, view, defaultPresenterOptions);
  });

  it('Change value, range=false', () => {
    model.setValue(4);
    console.log('Changed value to 4, range=false', view.getSlider());
  });
  it('Change range to true', () => {
    model.setRange(true);
    console.log('Changed range to true', view.getSlider());
  });
  it('Change range to false', () => {
    model.setRange(true);
    model.setRange(false);
    console.log('Changed range to false', view.getSlider());
  });
  it('Changed value when range true', () => {
    model.setRange(true);
    model.setValue([4, 9.5]);
    console.log('Changed value to [4, 9.5], range=true', view.getSlider());
  });
  it('setMin', () => {
    presenter.onChange = () => {
      console.log(view.getThumbPosition());
    };
    model.setMin(2);
    console.log('setMin to 2', view.getSlider());

    model = new Model(defaultOptions);
    view = new View({
      ...defaultViewOptions,
      stepsInfo: true,
      valueInfo: true,
      tooltip: true,
    }, document.body);
    presenter = new Presenter(model, view, defaultPresenterOptions);
    presenter.onChange = () => {
      console.log(view.getThumbPosition());
    };
    model.setMin(-1);
    console.log('setMin to -1', view.getSlider());
  });
  it('setMax', () => {
    presenter.onChange = () => {
      console.log(view.getThumbPosition());
    };
    model.setMax(8);
    console.log('setMax to 8', view.getSlider());

    model = new Model(defaultOptions);
    view = new View({
      ...defaultViewOptions,
      stepsInfo: true,
      valueInfo: true,
      tooltip: true,
    }, document.body);
    presenter = new Presenter(model, view, defaultPresenterOptions);
    presenter.onChange = () => {
      console.log(view.getThumbPosition());
    };
    model.setMax(15);
    console.log('setMax to 15', view.getSlider());

    model = new Model(defaultOptions);
    view = new View({
      ...defaultViewOptions,
      stepsInfo: true,
      valueInfo: true,
      tooltip: true,
    }, document.body);
    presenter = new Presenter(model, view, defaultPresenterOptions);
    presenter.onChange = () => {
      console.log(view.getThumbPosition());
    };
    model.setMax(-1);
    console.log('setMax to -1', view.getSlider());
  });
});
