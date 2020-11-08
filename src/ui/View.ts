import { IModel } from '../model/Model';

export interface ViewOptions {
  length: string
  tooltip: boolean
  vertical: boolean
}

export interface IView {
  vertical: boolean
  init(): void
  getSlider(): Element
  getParent(): Element
}

export default class View implements IView {
  private _model: IModel

  private _parent: Element
  private _slider: Element
  private _length: number
  vertical: boolean

  constructor(model: IModel, viewOptions: ViewOptions, parent: Element) {
    this._model = model;

    this.vertical = viewOptions.vertical;

    this._slider = document.createElement('div');
    this._parent = parent;
    this._length = this.vertical ? parent.clientHeight : parent.clientWidth;

    this.init();
  }

  getSlider(): Element {
    return this._slider;
  }
  getParent(): Element {
    return this._parent;
  }

  init(): void {
    this._parent.appendChild(this._slider);
  }
}
