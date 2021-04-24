import { ModelOptions, ModelOptionsOptionalParams } from '../modules/Model/options';
import { ViewOptions, ViewOptionsOptionalParams } from '../modules/View/options';
import { PresenterOptions, PresenterOptionsOptionalParams } from '../modules/Presenter/options';

type SliderOptions = ModelOptions & ViewOptions & PresenterOptions

type SliderOptionsOptionalParams = ModelOptionsOptionalParams
  & ViewOptionsOptionalParams
  & PresenterOptionsOptionalParams

export { SliderOptions, SliderOptionsOptionalParams };
