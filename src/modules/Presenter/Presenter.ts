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
  private model: IModel;

  private view: IView;

  onChange: Function | undefined

  constructor(model: IModel, view: IView, presenterOptions: PresenterOptions | SliderOptions) {
    super(model);

    this.model = model;
    this.view = view;
    this.onChange = presenterOptions.onChange;

    this.provideInfoToView();

    this.view.drawSlider();
  }

  onThumbMove(numOfSteps: number = 1, thumbNumber: 0 | 1 = 1) {
    this.model.addStepsToValue(numOfSteps, thumbNumber, true);
  }

  // Обновляет view
  update(action: SubjectAction): void {
    this.view.updateModelPropsInSlider(action);
    if (this.onChange) {
      this.onChange();
    }
  }

  // Меняет настройки слайдера
  changeOptions(newOptions: SliderOptionsOptionalParams): void {
    // Распределение настроек по модулям
    const modelOptions = ['value', 'isRange', 'stepSize', 'max', 'min'];
    const viewOptions = ['length', 'isVertical', 'isResponsive',
      'hasTooltip', 'hasScale', 'scaleValue', 'hasValueInfo',
      'useKeyboard', 'isScaleClickable'];
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
      this.model.changeOptions(newModelOptions);
    }
    if (Object.keys(newViewOptions).length !== 0) {
      this.view.changeOptions(newViewOptions);
    }
    if (Object.keys(newPresenterOptions).length !== 0) {
      if (newPresenterOptions.onChange) {
        this.onChange = newPresenterOptions.onChange;
      }
    }
  }

  // Передает во View modelProps и Presenter
  private provideInfoToView() {
    this.view.setModelProps({
      value: this.model.getValue(),
      min: this.model.getMin(),
      max: this.model.getMax(),
      isRange: this.model.getIsRange(),
      stepSize: this.model.getStepSize(),
    });

    this.view.setPresenter(this);
  }
}

export default Presenter;
