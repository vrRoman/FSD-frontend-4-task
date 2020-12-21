import { IModel, ObserverAction, Value } from './interfaces/modelTypesAndInterfaces';
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

    this._view.provideModelProps({
      value: this._model.getValue(),
      min: this._model.getMin(),
      max: this._model.getMax(),
      range: this._model.getRange(),
      stepSize: this._model.getStepSize(),
    });
    this.drawSlider();

    this._model.subscribe(this);
    this._view.subscribe(this);
  }

  drawSlider() {
    this._view.createSlider();
    this._view.createBar();
    this._view.createProgressBar();
    this._view.createThumb();
    if (this._view.getOptions().tooltip) {
      this._view.createTooltip();
    }
    if (this._view.getOptions().stepsInfo) {
      this._view.createStepsInfo();
    }
    if (this._view.getOptions().valueInfo) {
      this._view.createValueInfo();
    }
    this._view.addThumbListener();
    if (this._view.getUseKeyboard()) {
      this._view.addKeyboardListener();
    }
    if (this._view.getInteractiveStepsInfo()) {
      this._view.addStepsInfoInteractivity();
    }
    this._view.changeResponsive(this._view.getResponsive());
  }
  roundValue(value: Value): Value {
    const symbolsAfterCommaStepSize = this._model.getStepSize().toString().includes('.')
        ? this._model.getStepSize().toString().split('.').pop()
        : false;
    const numOfSymbolsAfterCommaStepSize = symbolsAfterCommaStepSize
        ? symbolsAfterCommaStepSize.length
        : 0;
    if (Array.isArray(value)) {
      return [
        +value[0].toFixed(numOfSymbolsAfterCommaStepSize),
        +value[1].toFixed(numOfSymbolsAfterCommaStepSize),
      ];
    }
    return +value.toFixed(numOfSymbolsAfterCommaStepSize);
  }

  onThumbMove() {
    const thumb = this._view.getThumb();
    const stepLength = this._view.getStepLength();
    if (thumb && stepLength) {
      const leftOrTop = this._view.getVertical() ? 'top' : 'left';
      const offsetWidthOrHeight = this._view.getVertical() ? 'offsetHeight' : 'offsetWidth';
      let value: Value;
      if (Array.isArray(thumb)) {
        const thumbPos = [
          (parseFloat(thumb[0].style[leftOrTop]) + thumb[0][offsetWidthOrHeight] / 2),
          (parseFloat(thumb[1].style[leftOrTop]) + thumb[1][offsetWidthOrHeight] / 2),
        ];
        value = [
          thumbPos[0] / stepLength + this._model.getMin(),
          thumbPos[1] / stepLength + this._model.getMin(),
        ];
      } else {
        const thumbPos = (parseFloat(thumb.style[leftOrTop]) + thumb[offsetWidthOrHeight] / 2);
        value = thumbPos / stepLength + this._model.getMin();
      }

      this._model.setValue(this.roundValue(value));

      if (this.onChange) {
        this.onChange();
      }
    }
  }

  // В зависимости от changes обновляет view
  update(action: ObserverAction): void {
    switch (action.type) {
      case 'UPDATE_VALUE':
        this._view.provideModelProps({
          value: this._model.getValue(),
          min: this._model.getMin(),
          max: this._model.getMax(),
          range: this._model.getRange(),
          stepSize: this._model.getStepSize(),
        });
        this._view.updateThumb();
        this._view.updateValueInfo();
        this._view.updateProgressBar();
        this._view.updateTooltip();
        break;

      case 'UPDATE_RANGE':
        this._view.provideModelProps({
          value: this._model.getValue(),
          min: this._model.getMin(),
          max: this._model.getMax(),
          range: this._model.getRange(),
          stepSize: this._model.getStepSize(),
        });
        this._view.removeThumb();
        this._view.createThumb();
        this._view.addThumbListener();
        this._view.updateProgressBar();
        this._view.updateValueInfo();
        this._view.updateTooltip();
        break;

      case 'UPDATE_MIN':
        this._view.provideModelProps({
          value: this._model.getValue(),
          min: this._model.getMin(),
          max: this._model.getMax(),
          range: this._model.getRange(),
          stepSize: this._model.getStepSize(),
        });
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
        this._view.provideModelProps({
          value: this._model.getValue(),
          min: this._model.getMin(),
          max: this._model.getMax(),
          range: this._model.getRange(),
          stepSize: this._model.getStepSize(),
        });
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

      case 'UPDATE_STEPSIZE':
        this._view.provideModelProps({
          value: this._model.getValue(),
          min: this._model.getMin(),
          max: this._model.getMax(),
          range: this._model.getRange(),
          stepSize: this._model.getStepSize(),
        });
        break;

      default:
        this._view.provideModelProps({
          value: this._model.getValue(),
          min: this._model.getMin(),
          max: this._model.getMax(),
          range: this._model.getRange(),
          stepSize: this._model.getStepSize(),
        });
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
