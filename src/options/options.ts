import { ModelOptions, ModelOptionsPartial } from '../modules/Model/options';
import { ViewOptions, ViewOptionsPartial } from '../modules/View/options';
import PresenterOptions from '../modules/Presenter/options';

type SliderOptions = ModelOptions & ViewOptions & PresenterOptions

type SliderOptionsPartial = ModelOptionsPartial
  & ViewOptionsPartial
  & PresenterOptions

export { SliderOptions, SliderOptionsPartial };
