import IModel from '../Model/interfacesAndTypes';
import IView from '../View/modules/View/interfaces';
import IPresenter from './interface';
import { SliderOptions, SliderOptionsPartial } from '../../options/options';
import { ModelOptionsPartial } from '../Model/options';
import { ViewOptionsPartial } from '../View/options';
import PresenterOptions from './options';

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

  onThumbMove(numberOfSteps: number = 1, thumbNumber: 0 | 1 = 1) {
    this.model.addStepsToValue(numberOfSteps, thumbNumber, true);
  }

  // Обновляет view
  update(action: SubjectAction): void {
    this.view.updateModelPropertiesInSlider(action);
    if (this.onChange) {
      this.onChange();
    }
  }

  // Меняет настройки слайдера
  changeOptions(newOptions: SliderOptionsPartial): void {
    // Распределение настроек по модулям
    const modelOptions = ['value', 'isRange', 'stepSize', 'max', 'min'];
    const viewOptions = ['length', 'isVertical', 'hasTooltip',
      'hasScale', 'scaleValue', 'hasValueInfo',
      'useKeyboard', 'isScaleClickable'];
    const presenterOptions = ['onChange'];

    const newModelOptions: { [key: string]: any } = {};
    modelOptions.forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(newOptions, property)) {
        newModelOptions[property] = newOptions[property as keyof ModelOptionsPartial];
      }
    });
    const newViewOptions: { [key: string]: any } = {};
    viewOptions.forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(newOptions, property)) {
        newViewOptions[property] = newOptions[property as keyof ViewOptionsPartial];
      }
    });
    const newPresenterOptions: { [key: string]: any } = {};
    presenterOptions.forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(newOptions, property)) {
        newPresenterOptions[property] = newOptions[property as keyof PresenterOptions];
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

  // Передает во View modelProperties и Presenter
  private provideInfoToView() {
    this.view.setModelProperties({
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
