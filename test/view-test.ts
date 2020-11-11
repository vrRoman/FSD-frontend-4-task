import View, { IView, ViewOptions } from '../src/ui/View';
import Model, { IModel, ModelOptions } from '../src/model/Model';

let modelOptions: ModelOptions;
let viewOptions: ViewOptions;
let model: IModel;
let view: IView;

beforeEach(() => {
  modelOptions = {
    value: [2, 15],
    range: true,
    stepSize: 1,
    min: 0,
    max: 20,
  };
  viewOptions = {
    length: '200px',
    tooltip: false,
    stepsInfo: false,
    valueInfo: false,
    vertical: false,
  };
  model = new Model(modelOptions);
  view = new View(model, viewOptions, document.body);
});

describe('View is created and has methods', () => {
  it('created', () => {
    expect(view).toBeDefined();
  });
  it('getSlider', () => {
    expect(view.getSlider()).toBeDefined();
  });
  it('getParent', () => {
    expect(view.getParent()).toBeDefined();
  });

  it('getThumb', () => {
    expect(view.getThumb()).toBeDefined();
  });

  it('getTooltip returns undefined', () => {
    expect(view.getTooltip()).toBe(undefined);
  });
  it('create tooltip and getTooltip returns this tooltip', () => {
    expect(view.createTooltip()).toEqual(view.getTooltip());
  });
  it('remove tooltip and getTooltip returns undefined', () => {
    expect(view.createTooltip()).toBeDefined();
    view.removeTooltip();
    expect(view.getTooltip()).toBe(undefined);
  });

  it('getModel', () => {
    expect(view.getModel()).toEqual(model);
  });
  it('getLength', () => {
    expect(view.getLength()).toBe(+view.getBar().clientWidth);
  });
  it('changeLength', () => {
    expect(view.changeLength('100px')).toBe(+view.getBar().clientWidth);
  });
  it('getStepLength', () => {
    expect(view.getStepLength()).toBe(
      view.getLength()
      / ((view.getModel().max - view.getModel().min) / view.getModel().stepSize),
    );
  });

  it('changeVertical', () => {
    expect(view.changeVertical(true)).toBe(true);
  });
  it('change stepsInfoSettings to number and create steps info', () => {
    view.changeStepsInfoSettings(5);
  });
  it('change stepsInfoSettings to array and create steps info', () => {
    view.changeStepsInfoSettings(['start', 0.25, 'half', 0.75, 'end']);
  });
  it('remove steps info', () => {
    view.removeStepsInfo();
    expect(view.getStepsInfo()).toBe(undefined);
  });

  it('remove valueInfo', () => {
    view.removeValueInfo();
    expect(view.getValueInfo()).toBe(undefined);
  });
});
