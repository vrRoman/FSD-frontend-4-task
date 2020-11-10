// добавить в changelength изменение thumb

import { IModel } from '../model/Model';

export interface ViewOptions {
  length: string
  tooltip: boolean
  stepsInfo: boolean | Array<number | string> | number
  valueInfo: boolean
  vertical: boolean
}

export interface IView {
  sliderClass: string
  sliderVerticalClass: string
  barClass: string
  thumbClass: string

  createSlider(): HTMLElement

  createBar(): HTMLElement
  createThumb(): HTMLElement | Array<HTMLElement>

  createTooltip(): HTMLElement
  removeTooltip(): void

  createStepsInfo(): HTMLElement | undefined
  removeStepsInfo(): void

  createValueInfo(): HTMLElement
  removeValueInfo(): void

  getModel(): IModel
  getParent(): Element
  getSlider(): HTMLElement

  getBar(): HTMLElement
  getThumb(): HTMLElement | Array<HTMLElement>
  getThumbPosition(): number | number[]

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
  sliderClass: string
  sliderVerticalClass: string
  barClass: string
  thumbClass: string

  private _model: IModel
  private _parent: Element
  private _slider: HTMLElement
  private _bar: HTMLElement
  private _thumb: HTMLElement | Array<HTMLElement>
  private _tooltip: HTMLElement | undefined
  private _stepsInfo: HTMLElement | undefined
  private _valueInfo: HTMLElement | undefined
  private _length: string
  private _vertical: boolean
  private _stepsInfoSettings: boolean | Array<number | string> | number

  constructor(model: IModel, viewOptions: ViewOptions, parent: Element) {
    this.sliderClass = 'slider';
    this.sliderVerticalClass = 'slider_vertical';
    this.barClass = 'slider__bar';
    this.thumbClass = 'slider__thumb';

    this._model = model;

    this._length = viewOptions.length;

    this._vertical = viewOptions.vertical;
    this._stepsInfoSettings = viewOptions.stepsInfo;

    this._parent = parent;
    this._slider = this.createSlider();
    this._bar = this.createBar();
    this._thumb = this.createThumb();
    this._tooltip = viewOptions.tooltip ? this.createTooltip() : undefined;
    this._stepsInfo = viewOptions.stepsInfo ? this.createStepsInfo() : undefined;
    this._valueInfo = viewOptions.valueInfo ? this.createValueInfo() : undefined;
  }



  getModel(): IModel {
    return this._model;
  }
  getSlider(): HTMLElement {
    return this._slider;
  }
  getParent(): Element {
    return this._parent;
  }
  getBar(): HTMLElement {
    return this._bar;
  }
  getThumb(): HTMLElement | Array<HTMLElement> {
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
    return +this.getBar().clientWidth;
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
  getThumbPosition(): number | number[] {
    const value = this.getModel().getValue();
    let thumbPosition;
    // value === 'number' при range = false
    if (typeof value === 'number') {
      thumbPosition = (this.getLength() / this.getModel().getMaxDiapason()) * value;
    } else {
      thumbPosition = [
        (this.getLength() / this.getModel().getMaxDiapason()) * value[0],
        (this.getLength() / this.getModel().getMaxDiapason()) * value[1],
      ];
    }

    return thumbPosition;
  }


  // Изменяет длину слайдера, меняет значения ширины / высоты слайдера
  changeLength(newLength: string): number {
    this._length = newLength;
    if (!this._vertical) {
      this.getBar().style.width = this._length;
    } else {
      this.getBar().style.height = this._length;
    }
    return this.getLength();
  }
  // Изменяет направление слайдера, меняет местами значения ширины и высоты
  // слайдера, информации о шагах
  changeVertical(newVertical: boolean): boolean {
    this._vertical = newVertical;
    if (!this._vertical) {
      this.getBar().style.width = this._length;
      this.getBar().style.height = '';
      this.getSlider().classList.remove(this.sliderVerticalClass);
      if (this._stepsInfo) {
        this._stepsInfo.style.width = '100%';
        this._stepsInfo.style.height = '';
      }
    } else {
      this.getBar().style.height = this._length;
      this.getBar().style.width = '';
      this.getSlider().classList.add(this.sliderVerticalClass);
      if (this._stepsInfo) {
        this._stepsInfo.style.height = '100%';
        this._stepsInfo.style.width = '';
      }
    }
    return this._vertical;
  }








  createSlider(): HTMLElement {
    const slider = document.createElement('div');
    slider.classList.add(this.sliderClass);

    this._parent.appendChild(slider);

    return slider;
  }
  createBar(): HTMLElement {
    const bar = document.createElement('div');
    bar.classList.add(this.barClass);
    bar.style.position = 'relative';

    if (!this._vertical) {
      bar.style.width = this._length;
    } else {
      bar.style.height = this._length;
      bar.classList.add(this.sliderVerticalClass);
    }

    this.getSlider().appendChild(bar);
    return bar;
  }
  createThumb(): HTMLElement | Array<HTMLElement> {
    const thumbPosition = this.getThumbPosition();

    // thumbPosition === 'number' при range = false
    if (typeof thumbPosition === 'number') {
      const thumb = document.createElement('div');

      thumb.classList.add(this.thumbClass);
      thumb.style.position = 'absolute';

      this.getBar().appendChild(thumb);

      if (this.getVertical()) {
        thumb.style.top = `${thumbPosition - thumb.offsetHeight / 2}px`;
      } else {
        thumb.style.left = `${thumbPosition - thumb.offsetWidth / 2}px`;
      }

      this._thumb = thumb;
    } else {
      this._thumb = [];
      for (let i = 0; i <= 1; i++) {
        const thumb = document.createElement('div');
        thumb.classList.add(this.thumbClass);
        thumb.style.position = 'absolute';
        thumb.dataset.number = String(i);

        this.getBar().appendChild(thumb);

        if (this.getVertical()) {
          thumb.style.top = `${thumbPosition[i] - thumb.offsetHeight / 2}px`;
        } else {
          thumb.style.left = `${thumbPosition[i] - thumb.offsetWidth / 2}px`;
        }

        this._thumb.push(thumb);
      }
    }
    return this._thumb;
  }


  createTooltip(): HTMLElement {
    const tooltip = document.createElement('div');
    // @ts-ignore
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
