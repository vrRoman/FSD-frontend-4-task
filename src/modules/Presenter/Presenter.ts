import IModel from '../Model/interfacesAndTypes';
import IView from '../View/modules/View/interfaces';
import IPresenter from './interface';
import { SliderOptions, SliderOptionsOptionalParams } from '../../options/options';
import { ModelOptionsOptionalParams } from '../Model/options';
import { ViewOptionsOptionalParams } from '../View/options';
import { PresenterOptions, PresenterOptionsOptionalParams } from './options';


import { SubjectAction } from '../../ObserverAndSubject/interfacesAndTypes';
import Observer from '../../ObserverAndSubject/Observer';


class Presenter extends Observer implements IPresenter {
  private _model: IModel;
  private _view: IView;

  onChange: Function | undefined

  constructor(model: IModel, view: IView, presenterOptions: PresenterOptions | SliderOptions) {
    super(model);

    this._model = model;
    this._view = view;
    this.onChange = presenterOptions.onChange;

    this._view.setModelProps({
      value: this._model.getValue(),
      min: this._model.getMin(),
      max: this._model.getMax(),
      isRange: this._model.getIsRange(),
      stepSize: this._model.getStepSize(),
    });
    this._view.drawSlider();

    this._view.setPresenter(this);
  }

  onThumbMove(numOfSteps: number = 1, thumbNumber: 0 | 1 = 1) {
    this._model.addStepsToValue(numOfSteps, thumbNumber, true);
  }

  // Обновляет view
  update(action: SubjectAction): void {
    this._view.updateModelPropsInSlider(action);
    if (this.onChange) {
      this.onChange();
    }
  }

  // Меняет настройки слайдера
  changeOptions(newOptions: SliderOptionsOptionalParams): void {
    // Распределение настроек по модулям
    const modelOptions = ['value', 'isRange', 'stepSize', 'max', 'min'];
    const viewOptions = ['length', 'isVertical', 'isResponsive',
      'hasTooltip', 'stepsInfo', 'hasValueInfo',
      'useKeyboard', 'stepsInfoInteractivity'];
    const presenterOptions = ['onChange'];

    const newModelOptions: { [key: string]: any } = {};
    modelOptions.forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(newOptions, prop)) {
        newModelOptions[prop] = newOptions[prop as keyof ModelOptionsOptionalParams];
      }
    });
    const newViewOptions: { [key: string]: any } = {};
    viewOptions.forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(newOptions, prop)) {
        newViewOptions[prop] = newOptions[prop as keyof ViewOptionsOptionalParams];
      }
    });
    const newPresenterOptions: { [key: string]: any } = {};
    presenterOptions.forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(newOptions, prop)) {
        newPresenterOptions[prop] = newOptions[prop as keyof PresenterOptionsOptionalParams];
      }
    });

    // Передача новых опций
    if (Object.keys(newModelOptions).length !== 0) {
      this._model.changeOptions(newModelOptions);
    }
    if (Object.keys(newViewOptions).length !== 0) {
      this._view.changeOptions(newViewOptions);
    }
    if (Object.keys(newPresenterOptions).length !== 0) {
      if (newPresenterOptions.onChange) {
        this.onChange = newPresenterOptions.onChange;
      }
    }
  }
}

export default Presenter;
