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

  onChange: OnChange | null;

  constructor(model: IModel, view: IView, presenterOptions: PresenterOptions) {
    super(model);

    this.model = model;
    this.view = view;
    this.onChange = presenterOptions.onChange || null;

    this.provideInfoToView();

    this.view.renderSlider();
  }

  // Изменяет значения модели во view
  update(action: SubjectAction) {
    if (action.type === 'CHANGE_MODEL_DATA') {
      this.view.setModelData(action.payload);

      if (this.onChange) {
        this.onChange(this.model.getData('value'));
      }
    }
    if (action.type === 'THUMB_MOVED') {
      const { numberOfSteps, thumbNumber } = action.payload;
      this.model.addStepsToValue(numberOfSteps, thumbNumber);
    }
  }

  // Меняет настройки слайдера
  changeOptions(newOptions: SliderOptionsPartial) {
    this.model.changeData(newOptions);
    this.view.changeOptions(newOptions);

    if (newOptions.onChange) {
      this.onChange = newOptions.onChange;
    }
  }

  // Передает во View modelProperties и Presenter
  private provideInfoToView() {
    this.view.setModelData({
      value: this.model.getData('value'),
      min: this.model.getData('min'),
      max: this.model.getData('max'),
      isRange: this.model.getData('isRange'),
      stepSize: this.model.getData('stepSize'),
    });

    this.view.subscribe(this);
  }
}

export default Presenter;
