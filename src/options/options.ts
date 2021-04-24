import { ModelOptions, ModelOptionsOptionalParams } from '../modules/Model/options';
import { ViewOptions, ViewOptionsOptionalParams } from '../modules/View/options';
import PresenterOptions from '../modules/Presenter/options';

type SliderOptions = ModelOptions & ViewOptions & PresenterOptions

type SliderOptionsOptionalParams = ModelOptionsOptionalParams
  & ViewOptionsOptionalParams
  & PresenterOptions

export { SliderOptions, SliderOptionsOptionalParams };
