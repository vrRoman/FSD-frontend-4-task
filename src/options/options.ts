import { ModelOptions, ModelOptionsPartial } from 'Model/options';
import { ViewOptions, ViewOptionsPartial } from 'View/options';
import { PresenterOptions } from 'Presenter/options';

type SliderOptions = ModelOptions & ViewOptions & PresenterOptions

type SliderOptionsPartial = ModelOptionsPartial
  & ViewOptionsPartial
  & PresenterOptions

export { SliderOptions, SliderOptionsPartial };
