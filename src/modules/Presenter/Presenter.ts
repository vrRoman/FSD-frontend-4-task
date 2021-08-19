import { Observer } from 'ObserverAndSubject';
import type { SubjectAction } from 'ObserverAndSubject';
import type { IModel } from 'Model';
import type { IView } from 'View';

import type {
  IPresenter,
  OnChange,
  PresenterOptions,
  SliderOptionsPartial,
} from './Presenter.model';

class Presenter extends Observer implements IPresenter {
  private model: IModel;

  private view: IView;

  onChange: OnChange | null

  constructor(model: IModel, view: IView, presenterOptions: PresenterOptions) {
    super(model);

    this.model = model;
    this.view = view;
    this.onChange = presenterOptions.onChange || null;

    this.provideInfoToView();

    this.view.renderSlider();
  }

  onThumbMove(numberOfSteps: number = 1, thumbNumber: 0 | 1 = 1) {
    this.model.addStepsToValue(numberOfSteps, thumbNumber);
  }

  // Изменяет значения модели во view
  update(action: SubjectAction): void {
    if (action.type === 'CHANGE_OPTIONS') {
      this.view.setModelData(action.payload);
    }

    if (this.onChange) {
      this.onChange(this.model.getValue());
    }
  }

  // Меняет настройки слайдера
  changeOptions(newOptions: SliderOptionsPartial): void {
    // Распределение настроек по модулям
    const modelOptions = ['value', 'isRange', 'stepSize', 'max', 'min'] as const;
    const viewOptions = ['length', 'isVertical', 'hasTooltip',
      'hasScale', 'scaleValue', 'hasValueInfo',
      'useKeyboard', 'isScaleClickable', 'isBarClickable'] as const;
    const presenterOptions = ['onChange'] as const;

    const newModelOptions: { [key: string]: any } = {};
    modelOptions.forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(newOptions, property)) {
        newModelOptions[property] = newOptions[property];
      }
    });
    const newViewOptions: { [key: string]: any } = {};
    viewOptions.forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(newOptions, property)) {
        newViewOptions[property] = newOptions[property];
      }
    });
    const newPresenterOptions: { [key: string]: any } = {};
    presenterOptions.forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(newOptions, property)) {
        newPresenterOptions[property] = newOptions[property];
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
    this.view.setModelData({
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
