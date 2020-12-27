import { IModel, ObserverAction, Value } from './interfaces/modelTypesAndInterfaces';
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
    this._view.subscribe(this);
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

  // Обновляет view
  update(action: ObserverAction): void {
    this._view.update(action);
  }
}

export default Presenter;
