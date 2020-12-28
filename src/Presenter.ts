import { IModel, ObserverAction } from './interfaces/modelTypesAndInterfaces';
import { IView } from './interfaces/viewInterfaces';
import { IPresenter } from './interfaces/presenterInterfaces';
import { PresenterOptions, SliderOptions } from './interfaces/options';


class Presenter implements IPresenter {
  private _model: IModel;
  private _view: IView;

  onChange: Function | undefined

  constructor(model: IModel, view: IView, presenterOptions: PresenterOptions | SliderOptions) {
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

    this._model.subscribe(this);

    this._view.setPresenter(this);
  }

  onThumbMove(numOfSteps: number = 1, thumbNumber: 0 | 1 = 1) {
    this._model.addStepsToValue(numOfSteps, thumbNumber);
  }

  // Обновляет view
  update(action: ObserverAction): void {
    this._view.update(action);
  }
}

export default Presenter;
