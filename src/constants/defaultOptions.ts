import type { ModelOptions } from 'Model';
import type { ViewOptions } from 'View';
import type { PresenterOptions, SliderOptions } from 'Presenter';

const defaultModelOptions: ModelOptions = {
  value: 0,
  isRange: false,
  stepSize: 1,
  min: 0,
  max: 10,
} as const;

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
} as const;

const defaultPresenterOptions: PresenterOptions = {} as const;

const defaultSliderOptions: SliderOptions = {
  ...defaultModelOptions,
  ...defaultViewOptions,
  ...defaultPresenterOptions,
} as const;

export {
  defaultModelOptions,
  defaultViewOptions,
  defaultPresenterOptions,
  defaultSliderOptions,
};
