import { IModel } from '../model/Model';

export interface ViewOptions {
  length: string
  tooltip: boolean
  stepsInfo: boolean | Array<number | string> | number
  valueInfo: boolean
  vertical: boolean
}

export interface IView {
  init(): void
  createSlider(): HTMLElement
  createThumb(): HTMLElement

  createTooltip(): HTMLElement
  removeTooltip(): void

  createStepsInfo(): HTMLElement | undefined
  removeStepsInfo(): void

  createValueInfo(): HTMLElement
  removeValueInfo(): void

  getModel(): IModel
  getParent(): Element
  getSlider(): HTMLElement
  getThumb(): HTMLElement

  getTooltip(): HTMLElement | undefined

  getStepsInfo(): HTMLElement | undefined
  changeStepsInfoSettings(newStepsInfoSettings: boolean | Array<number | string> | number)
    : HTMLElement | undefined
  getStepsInfoSettings(): boolean | Array<number | string> | number

  getValueInfo(): HTMLElement | undefined
  
  getLength(): number
  getStepLength(): number
  getVertical(): boolean

  changeLength(newLength: string): number
  changeVertical(newVertical: boolean): boolean
}

export default class View implements IView {
  private _model: IModel

  private _parent: Element
  private _slider: HTMLElement
  private _thumb: HTMLElement
  private _tooltip: HTMLElement | undefined
  private _stepsInfo: HTMLElement | undefined
  private _valueInfo: HTMLElement | undefined
  private _length: string
  private _vertical: boolean
  private _stepsInfoSettings: boolean | Array<number | string> | number

  constructor(model: IModel, viewOptions: ViewOptions, parent: Element) {
    this._model = model;

    this._length = viewOptions.length;

    this._vertical = viewOptions.vertical;
    this._stepsInfoSettings = viewOptions.stepsInfo;

    this._parent = parent;
    this._slider = this.createSlider();
    this._thumb = this.createThumb();
    this._tooltip = viewOptions.tooltip ? this.createTooltip() : undefined;
    this._stepsInfo = viewOptions.stepsInfo ? this.createStepsInfo() : undefined;
    this._valueInfo = viewOptions.valueInfo ? this.createValueInfo() : undefined;

    this.init();
  }

  init(): void {
    this._parent.appendChild(this._slider);
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
  getStepsInfo(): HTMLElement | undefined {
    return this._stepsInfo;
  }
  getValueInfo(): HTMLElement | undefined {
    return this._valueInfo;
  }

  getLength(): number {
    return +this.getSlider().clientWidth;
  }
  getVertical(): boolean {
    return this._vertical;
  }
  getStepsInfoSettings(): boolean | Array<number | string> | number {
    return this._stepsInfoSettings;
  }
  getStepLength(): number {
    const numOfSteps = (this.getModel().max - this.getModel().min)
      / this.getModel().stepSize;
    return this.getLength() / numOfSteps;
  }

  // Изменяет длину слайдера, меняет значения ширины / высоты слайдера
  changeLength(newLength: string): number {
    this._length = newLength;
    if (!this._vertical) {
      this.getSlider().style.width = this._length;
    } else {
      this.getSlider().style.height = this._length;
    }
    return this.getLength();
  }
  // Изменяет направление слайдера, меняет местами значения ширины и высоты
  // слайдера, информации о шагах
  changeVertical(newVertical: boolean): boolean {
    this._vertical = newVertical;
    if (!this._vertical) {
      this.getSlider().style.width = this._length;
      this.getSlider().style.height = '';
      this.getSlider().classList.remove('slider-reverse');
      if (this._stepsInfo) {
        this._stepsInfo.style.width = '100%';
        this._stepsInfo.style.height = '';
      }
    } else {
      this.getSlider().style.height = this._length;
      this.getSlider().style.width = '';
      this.getSlider().classList.add('slider-reverse');
      if (this._stepsInfo) {
        this._stepsInfo.style.height = '100%';
        this._stepsInfo.style.width = '';
      }
    }
    return this._vertical;
  }

  createSlider(): HTMLElement {
    const slider = document.createElement('div');
    slider.classList.add('slider');

    if (!this._vertical) {
      slider.style.width = this._length;
    } else {
      slider.style.height = this._length;
      slider.classList.add('slider_reverse');
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
  createStepsInfo(): HTMLElement | undefined {
    const stepsInfo = document.createElement('div');
    stepsInfo.classList.add('slider-steps-info');
    if (this._stepsInfoSettings) {
      // длина как слайдер
      // if (!this.vertical) {
      //   stepsInfo.style.width = '100%';
      // } else {
      //   stepsInfo.style.height = '100%';
      // }
    } else {
      this._stepsInfoSettings = true;
    }

    this.getParent().appendChild(stepsInfo);
    return stepsInfo;
  }
  removeStepsInfo() {
    if (this._stepsInfo) {
      this._stepsInfo.remove();
    }
  }
  changeStepsInfoSettings(newStepsInfoSettings
                            : boolean | Array<number | string> | number)
    : HTMLElement | undefined {
    this._stepsInfoSettings = newStepsInfoSettings;

    this.removeStepsInfo();
    return this.createStepsInfo();
  }

  createValueInfo(): HTMLElement {
    const valueInfo = document.createElement('div');
    this.getParent().appendChild(valueInfo);
    return valueInfo;
  }
  removeValueInfo(): void {
    if (this._valueInfo) {
      this._valueInfo.remove();
    }
  }
}
