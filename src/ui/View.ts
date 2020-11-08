import { IModel } from '../model/Model';

export interface ViewOptions {
  length: string
  tooltip: boolean
  vertical: boolean
}

export interface IView {
  vertical: boolean
  init(): void
  createSlider(): HTMLElement
  createThumb(): HTMLElement
  createTooltip(): HTMLElement
  removeTooltip(): void
  getModel(): IModel
  getSlider(): HTMLElement
  getThumb(): HTMLElement
  getTooltip(): HTMLElement | undefined
  getParent(): Element
  getLength(): number
  getStepLength(): number
  changeLength(newLength: string): number
  changeVertical(newVertical: boolean): boolean
}

export default class View implements IView {
  private _model: IModel

  private _parent: Element
  private _slider: HTMLElement
  private _thumb: HTMLElement
  private _tooltip: HTMLElement | undefined
  private _length: string
  vertical: boolean

  constructor(model: IModel, viewOptions: ViewOptions, parent: Element) {
    this._model = model;

    this._length = viewOptions.length;

    this.vertical = viewOptions.vertical;

    this._parent = parent;
    this._slider = this.createSlider();
    this._thumb = this.createThumb();
    this._tooltip = viewOptions.tooltip ? this.createTooltip() : undefined;

    this.init();
  }

  getModel(): IModel {
    return { ...this._model };
  }
  getSlider(): HTMLElement {
    return this._slider;
  }
  getParent(): Element {
    return this._parent;
  }
  getThumb(): HTMLElement {
    return this._thumb;
  }
  getTooltip(): HTMLElement | undefined {
    return this._tooltip;
  }

  getLength(): number {
    return +this.getSlider().clientWidth;
  }
  getStepLength(): number {
    const numOfSteps = (this.getModel().max - this.getModel().min)
      / this.getModel().stepSize;
    return this.getLength() / numOfSteps;
  }

  changeLength(newLength: string): number {
    this._length = newLength;
    if (!this.vertical) {
      this.getSlider().style.width = this._length;
    } else {
      this.getSlider().style.height = this._length;
    }
    return this.getLength();
  }
  changeVertical(newVertical: boolean): boolean {
    this.vertical = newVertical;
    if (!this.vertical) {
      this.getSlider().style.width = this._length;
      this.getSlider().style.height = '';
    } else {
      this.getSlider().style.height = this._length;
      this.getSlider().style.width = '';
    }
    return this.vertical;
  }

  init(): void {
    this._parent.appendChild(this._slider);
  }

  createSlider(): HTMLElement {
    const slider = document.createElement('div');
    if (!this.vertical) {
      slider.style.width = this._length;
    } else {
      slider.style.height = this._length;
    }

    slider.style.position = 'relative';

    return slider;
  }
  createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    thumb.style.position = 'absolute';

    this.getSlider().appendChild(thumb);
    return thumb;
  }
  createTooltip(): HTMLElement {
    const tooltip = document.createElement('div');
    this.getThumb().appendChild(tooltip);

    this._tooltip = tooltip;
    return this._tooltip;
  }
  removeTooltip(): void {
    if (this.getTooltip()) {
      this.getTooltip()!.remove();
      this._tooltip = undefined;
    }
  }
}
