import { IModel } from '../model/Model';
import { IView } from './View';


export interface ControllerOptions {
  updateOnMove: boolean
  onChange?: Function
}

export interface IController {
  getActiveThumb(): HTMLElement
  removeActiveThumb(): void
  getStepLength(): number

  onChange: Function | undefined
}


export default class Controller implements IController {
  private _model: IModel;
  private _view: IView;
  private _activeThumb: HTMLElement | null;
  private _clientX: number;
  private _clientY: number;

  updateOnMove: boolean

  onChange: Function | undefined


  constructor(model: IModel, view: IView, controllerOptions: ControllerOptions) {
    this._model = model;
    this._view = view;

    this._clientX = 0;
    this._clientY = 0;

    this.updateOnMove = controllerOptions.updateOnMove;

    this._activeThumb = this.getActiveThumb();

    this.onChange = controllerOptions.onChange;

    this.thumbOnDown = this.thumbOnDown.bind(this);
    this.thumbOnUp = this.thumbOnUp.bind(this);
    this.thumbOnMove = this.thumbOnMove.bind(this);
    this.removeActiveThumb = this.removeActiveThumb.bind(this);

    const thumb = this._view.getThumb();
    if (Array.isArray(thumb)) {
      for (let i = 0; i <= 1; i += 1) {
        thumb[i].addEventListener('mousedown', this.thumbOnDown);
      }
    } else {
      thumb.addEventListener('mousedown', this.thumbOnDown);
    }
  }

  getActiveThumb(): HTMLElement {
    if (!this._activeThumb) {
      const thumb = this._view.getThumb();
      if (Array.isArray(thumb)) {
        [, this._activeThumb] = thumb;
      } else {
        this._activeThumb = thumb;
      }
    }
    return this._activeThumb;
  }
  removeActiveThumb(): void {
    if (this._activeThumb) {
      this._activeThumb.classList.remove(this._view.activeThumbClass);
      this._activeThumb = null;
    }
  }

  getStepLength(): number {
    const numOfSteps = (this._model.max - this._model.min)
      / this._model.stepSize;
    return this._view.getLength() / numOfSteps;
  }

  private addStepsToActiveThumb(numOfSteps = 1): void {
    if (this._activeThumb) {
      const thumb = this._view.getThumb();

      let activeThumbIsFirst: boolean = false;
      if (Array.isArray(thumb)) {
        if (thumb[0].isEqualNode(this._activeThumb)) {
          activeThumbIsFirst = true;
        }
      }

      let offsetWidthOrHeight: 'offsetHeight' | 'offsetWidth';
      let leftOrTop: 'left' | 'top';
      if (this._view.getVertical()) {
        offsetWidthOrHeight = 'offsetHeight';
        leftOrTop = 'top';
      } else {
        offsetWidthOrHeight = 'offsetWidth';
        leftOrTop = 'left';
      }

      let maxPos: number = this._view.getLength() - this._activeThumb[offsetWidthOrHeight] / 2;
      let minPos: number = -this._activeThumb[offsetWidthOrHeight] / 2;
      if (Array.isArray(thumb)) {
        if (activeThumbIsFirst) {
          maxPos = parseFloat(thumb[1].style[leftOrTop]);
        } else {
          minPos = parseFloat(thumb[0].style[leftOrTop]);
        }
      }

      const offset: number = this.getStepLength() * numOfSteps;
      const pos: number = parseFloat(this._activeThumb.style[leftOrTop]) + offset;
      if (pos <= maxPos) {
        if (pos >= minPos) {
          this._activeThumb.style[leftOrTop] = `${pos}px`;
        } else {
          this._activeThumb.style[leftOrTop] = `${minPos}px`;
        }
      } else {
        this._activeThumb.style[leftOrTop] = `${maxPos}px`;
      }

      // Передаем значение в model
      if (this._model.getRange()) {
        let valueNum: 0 | 1;
        if (activeThumbIsFirst) {
          valueNum = 0;
        } else {
          valueNum = 1;
        }
        this._model.addStepsToValue(numOfSteps, valueNum);
      } else {
        this._model.addStepsToValue(numOfSteps);
      }
    }
  }

  // При нажатии на thumb перезаписывает activeThumb и добавляет обработчик
  // thumbOnMove при движении мыши
  private thumbOnDown(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    this._clientY = evt.clientY;

    const target = <HTMLElement>evt.currentTarget;
    if (target) {
      if (this._activeThumb) {
        this._activeThumb.classList.remove(this._view.activeThumbClass);
      }

      this._activeThumb = target;

      // Тут возможно this._clientX = evt.clientX, но я сделал так,
      // чтобы положение курсора все время было в середине thumb. Т.е.
      // определение прошлого положения курсора зависит не от самого
      // курсора, а от thumb(аналогично в thumbOnMove и при vertical)
      this._clientX = parseFloat(this._activeThumb.style.left)
        + this._view.getBar().getBoundingClientRect().left
        + this._activeThumb.offsetWidth / 2;

      this._activeThumb.classList.add(this._view.activeThumbClass);
    }


    document.addEventListener('mousemove', this.thumbOnMove);
    document.addEventListener('mouseup', this.thumbOnUp);

    document.removeEventListener('mouseup', this.removeActiveThumb);
  }

  private thumbOnUp() {
    document.removeEventListener('mousemove', this.thumbOnMove);
    document.removeEventListener('mouseup', this.thumbOnUp);

    document.addEventListener('mouseup', this.removeActiveThumb);
  }

  private thumbOnMove(evt: MouseEvent) {
    if (this._activeThumb) {
      if (this._view.getVertical()) {
        if (Math.abs(evt.clientY - this._clientY) >= this.getStepLength()) {
          const numOfSteps = Math.trunc((evt.clientY - this._clientY) / this.getStepLength());
          this.addStepsToActiveThumb(numOfSteps);

          // Перезаписываем this._client(X/Y) (смотреть 157 строчку)
          this._clientY = parseFloat(this._activeThumb.style.top)
            + this._view.getBar().getBoundingClientRect().top
            + this._activeThumb.offsetHeight / 2;
        }
      } else {
        if (Math.abs(evt.clientX - this._clientX) >= this.getStepLength()) {
          const numOfSteps = Math.trunc((evt.clientX - this._clientX) / this.getStepLength());
          this.addStepsToActiveThumb(numOfSteps);

          this._clientX = parseFloat(this._activeThumb.style.left)
            + this._view.getBar().getBoundingClientRect().left
            + this._activeThumb.offsetWidth / 2;
        }
      }
    }
  }
}
