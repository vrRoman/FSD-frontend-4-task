import { IModel } from './interfacesAndTypes/modelTypesAndInterfaces';
import { IView } from './interfacesAndTypes/viewInterfaces';
import { IPresenter } from './interfacesAndTypes/presenterInterfaces';
import {
  ModelOptionsOptionalParams,
  PresenterOptions, PresenterOptionsOptionalParams,
  SliderOptions, SliderOptionsOptionalParams, ViewOptionsOptionalParams,
} from './interfacesAndTypes/options';
import { SubjectAction } from './interfacesAndTypes/observerAndSubjectInterfaces';
import Observer from './ObserverAndSubject/Observer';


class Presenter extends Observer implements IPresenter {
  private _model: IModel;
  private _view: IView;

  onChange: Function | undefined

  constructor(model: IModel, view: IView, presenterOptions: PresenterOptions | SliderOptions) {
    super(model);

    this._model = model;
    this._view = view;
    this.onChange = presenterOptions.onChange;

    this._view.provideModelProps({
      value: this._model.getValue(),
      min: this._model.getMin(),
      max: this._model.getMax(),
      range: this._model.getRange(),
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
    this._view.update(action);
    if (this.onChange) {
      this.onChange();
    }
  }

  // Меняет настройки слайдера
  changeOptions(newOptions: SliderOptionsOptionalParams): void {
    // Распределение настроек по модулям
    const modelOptions = ['value', 'range', 'stepSize', 'max', 'min'];
    const viewOptions = ['length', 'vertical', 'responsive',
      'tooltip', 'stepsInfo', 'valueInfo',
      'useKeyboard', 'interactiveStepsInfo'];
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
