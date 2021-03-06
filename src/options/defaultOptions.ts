import { ModelOptions } from '../modules/Model/options';
import { ViewOptions } from '../modules/View/options';
import PresenterOptions from '../modules/Presenter/options';
import { SliderOptions } from './options';

const defaultModelOptions: ModelOptions = {
  value: 0,
  isRange: false,
  stepSize: 1,
  min: 0,
  max: 10,
};

const defaultViewOptions: ViewOptions = {
  length: '100%',
  hasTooltip: false,
  hasScale: false,
  scaleValue: 2,
  hasValueInfo: false,
  isVertical: false,
  useKeyboard: true,
  isScaleClickable: true,
  isBarClickable: true,
};

const defaultPresenterOptions: PresenterOptions = {};

const defaultSliderOptions: SliderOptions = {
  ...defaultModelOptions,
  ...defaultViewOptions,
  ...defaultPresenterOptions,
};

export {
  defaultModelOptions,
  defaultViewOptions,
  defaultPresenterOptions,
  defaultSliderOptions,
};
