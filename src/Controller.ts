import { IModel, ObserverAction } from './interfaces/modelTypesAndInterfaces';
import { IView } from './interfaces/viewInterfaces';
import { IController } from './interfaces/controllerInterfaces';
import { ControllerOptions, SliderOptions } from './interfaces/options';


class Controller implements IController {
  private _model: IModel;
  private _view: IView;

  onChange: Function | undefined


  constructor(model: IModel, view: IView, controllerOptions: ControllerOptions | SliderOptions) {
    this._model = model;
    this._view = view;

    this.onChange = controllerOptions.onChange;

    this._model.subscribe(this);
  }

  // В зависимости от changes обновляет view
  update(action: ObserverAction): void {
    switch (action.type) {
      case 'UPDATE_VALUE':
        this._view.updateThumb();
        this._view.updateValueInfo();
        this._view.updateProgressBar();
        this._view.updateTooltip();
        break;

      case 'UPDATE_RANGE':
        this._view.removeThumb();
        this._view.createThumb();
        this._view.addThumbListener();
        this._view.updateProgressBar();
        this._view.updateValueInfo();
        this._view.updateTooltip();
        break;

      case 'UPDATE_MIN':
        this._view.updateThumb();
        if (this._view.getStepsInfo()) {
          this._view.removeStepsInfo();
          this._view.createStepsInfo();
        }
        if (this._view.getInteractiveStepsInfo()) {
          this._view.addStepsInfoInteractivity();
        }
        this._view.updateValueInfo();
        this._view.updateProgressBar();
        this._view.updateTooltip();
        break;

      case 'UPDATE_MAX':
        this._view.updateThumb();
        if (this._view.getStepsInfo()) {
          this._view.removeStepsInfo();
          this._view.createStepsInfo();
        }
        if (this._view.getInteractiveStepsInfo()) {
          this._view.addStepsInfoInteractivity();
        }
        this._view.updateValueInfo();
        this._view.updateProgressBar();
        this._view.updateTooltip();
        break;

      default:
        this._view.removeThumb();
        this._view.createThumb();
        this._view.addThumbListener();
        if (this._view.getStepsInfo()) {
          this._view.removeStepsInfo();
          this._view.createStepsInfo();
        }
        if (this._view.getInteractiveStepsInfo()) {
          this._view.addStepsInfoInteractivity();
        }
        this._view.updateProgressBar();
        this._view.updateValueInfo();
        this._view.updateTooltip();
    }
  }
}

export default Controller;
