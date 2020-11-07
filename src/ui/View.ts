interface ViewOptions {
  stepSize: number
  vertical: boolean
}

export default class View {
  private _parent: Element
  private _slider: Element
  private _length: number
  stepSize: number

  constructor(parent: Element, options: ViewOptions) {
    this._slider = document.createElement('div');
    this._parent = parent;
    this._length = options.vertical ? parent.clientHeight : parent.clientWidth;

    this.stepSize = options.stepSize;
  }

  getSlider(): Element {
    return this._slider;
  }
  getParent(): Element {
    return this._parent;
  }

  draw(): void {
    this._parent.appendChild(this._slider);
  }
}
