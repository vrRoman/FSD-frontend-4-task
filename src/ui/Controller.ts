import { IModel, ObserverAction } from '../interfaces/modelTypesAndInterfaces';
import { IView } from '../interfaces/viewInterfaces';
import { IController } from '../interfaces/controllerInterfaces';
import { ControllerOptions, SliderOptions } from '../interfaces/options';


export default class Controller implements IController {
  private _model: IModel;
  private _view: IView;
  private _activeThumb: HTMLElement | undefined;
  private _clientX: number;
  private _clientY: number;

  private useKeyboard: boolean
  private interactiveStepsInfo: boolean

  onChange: Function | undefined


  constructor(model: IModel, view: IView, controllerOptions: ControllerOptions | SliderOptions) {
    this._model = model;
    this._view = view;

    this._clientX = 0;
    this._clientY = 0;

    this.useKeyboard = controllerOptions.useKeyboard;
    this.interactiveStepsInfo = controllerOptions.interactiveStepsInfo;

    this._activeThumb = undefined;

    this.onChange = controllerOptions.onChange;

    this.thumbOnDown = this.thumbOnDown.bind(this);
    this.thumbOnUp = this.thumbOnUp.bind(this);
    this.thumbOnMove = this.thumbOnMove.bind(this);
    this.removeActiveThumb = this.removeActiveThumb.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.stepElemOnDown = this.stepElemOnDown.bind(this);

    this.addThumbListener();

    if (this.useKeyboard) {
      this.addKeyboardListener();
    }

    if (this.interactiveStepsInfo) {
      this.addStepsInfoInteractivity();
    }

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
        this.addThumbListener();
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
        if (this.interactiveStepsInfo) {
          this.addStepsInfoInteractivity();
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
        if (this.interactiveStepsInfo) {
          this.addStepsInfoInteractivity();
        }
        this._view.updateValueInfo();
        this._view.updateProgressBar();
        this._view.updateTooltip();
        break;

      default:
        this._view.removeThumb();
        this._view.createThumb();
        this.addThumbListener();
        if (this._view.getStepsInfo()) {
          this._view.removeStepsInfo();
          this._view.createStepsInfo();
        }
        if (this.interactiveStepsInfo) {
          this.addStepsInfoInteractivity();
        }
        this._view.updateProgressBar();
        this._view.updateValueInfo();
        this._view.updateTooltip();
    }
  }

  // Добавляет thumbOnDown к ползунку(ам)
  addThumbListener(): void {
    const thumb = this._view.getThumb();
    if (Array.isArray(thumb)) {
      for (let i = 0; i <= 1; i += 1) {
        thumb[i].addEventListener('mousedown', this.thumbOnDown);
      }
    } else {
      if (thumb) {
        thumb.addEventListener('mousedown', this.thumbOnDown);
      }
    }
  }

  // Убирает класс активного ползунка и _activeThumb = undefined
  removeActiveThumb(): void {
    if (this._activeThumb) {
      if (Array.isArray(this._view.activeThumbClass)) {
        this._activeThumb.classList.remove(...this._view.activeThumbClass);
      } else {
        this._activeThumb.classList.remove(this._view.activeThumbClass);
      }
      this._activeThumb = undefined;
    }
  }

  // Убирает предыдущий активный ползунок, добавляет класс новому
  // _activeThumb, увеличивает z-index нового активного ползунка
  setActiveThumb(numOfThumb: number = 1): void {
    const thumb = this._view.getThumb();

    if (thumb) {
      this.removeActiveThumb();

      if (Array.isArray(thumb)) {
        this._activeThumb = thumb[numOfThumb];
      } else {
        this._activeThumb = thumb;
      }

      if (Array.isArray(this._view.activeThumbClass)) {
        this._activeThumb.classList.add(...this._view.activeThumbClass);
      } else {
        this._activeThumb.classList.add(this._view.activeThumbClass);
      }

      if (Array.isArray(thumb) && this._activeThumb) {
        if (this._activeThumb.isEqualNode(thumb[0])) {
          const zIndex: number = window.getComputedStyle(thumb[1]).zIndex === 'auto'
            ? 0 : +window.getComputedStyle(thumb[1]).zIndex;
          this._activeThumb.style.zIndex = String(zIndex + 1);
        } else {
          const zIndex: number = window.getComputedStyle(thumb[0]).zIndex === 'auto'
            ? 0 : +window.getComputedStyle(thumb[0]).zIndex;
          this._activeThumb.style.zIndex = String(zIndex + 1);
        }
      }
    }
  }


  // При нажатии на ползунок убирает z-index предыдущего активного ползунка,
  // перезаписывает activeThumb, _clientX/Y, добавляет обработчики
  // thumbOnMove, thumbOnUp и убирает слушатель
  // document-mouseup-removeActiveThumb
  private thumbOnDown(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    const target = <HTMLElement>evt.currentTarget;
    if (target) {
      if (this._activeThumb) {
        this._activeThumb.style.zIndex = '';
      }
      this.setActiveThumb(target.dataset.number ? +target.dataset.number : undefined);

      // Тут возможно this._clientX/Y = evt.clientX/Y, но я сделал так,
      // чтобы положение курсора все время было в середине thumb. Т.е.
      // определение прошлого положения курсора зависит не от самого
      // курсора, а от thumb(аналогично в thumbOnMove)
      if (this._activeThumb) {
        this._clientX = parseFloat(this._activeThumb.style.left)
          + this._view.getBar().getBoundingClientRect().left
          + this._activeThumb.offsetWidth / 2;

        this._clientY = parseFloat(this._activeThumb.style.top)
          + this._view.getBar().getBoundingClientRect().top
          + this._activeThumb.offsetHeight / 2;
      }
    }

    document.addEventListener('mousemove', this.thumbOnMove);
    document.addEventListener('mouseup', this.thumbOnUp);

    document.removeEventListener('mouseup', this.removeActiveThumb);
  }

  // При отжатии кнопки после ползунка убирает обработчики thumbOnMove и
  // thumbOnUp, добавляет слушатель document-mouseup, который убирает
  // активный тамб при клике в любое место документа
  private thumbOnUp() {
    document.removeEventListener('mousemove', this.thumbOnMove);
    document.removeEventListener('mouseup', this.thumbOnUp);
    document.addEventListener('mouseup', this.removeActiveThumb);
  }

  // Возвращает значение useKeyboard
  getUseKeyboard(): boolean {
    return this.useKeyboard;
  }
  // Возвращает значение interactiveStepsInfo
  getInteractiveStepsInfo(): boolean {
    return this.interactiveStepsInfo;
  }

  // Добавляет stepElemOnDown при клике на элементы шкалы значений и
  // interactiveStepsInfo = true
  addStepsInfoInteractivity(): void {
    const stepsInfo = this._view.getStepsInfo();
    if (stepsInfo) {
      const stepElems = Array.from(stepsInfo.children) as HTMLElement[];
      for (let i = 0; i < stepElems.length; i += 1) {
        stepElems[i].addEventListener('mousedown', this.stepElemOnDown);
      }
      this.interactiveStepsInfo = true;
    }
  }
  // Убирает слушатель клика у элементов шкалы значений и
  // interactiveStepsInfo = false
  removeStepsInfoInteractivity(): void {
    const stepsInfo = this._view.getStepsInfo();
    if (stepsInfo) {
      const stepElems = Array.from(stepsInfo.children) as HTMLElement[];
      for (let i = 0; i < stepElems.length; i += 1) {
        stepElems[i].removeEventListener('mousedown', this.stepElemOnDown);
      }
      this.interactiveStepsInfo = false;
    }
  }

  // При клике на элементы шкалы значений вызывает addStepsToActiveThumb и
  // убирает активный ползунок
  private stepElemOnDown(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    const stepElem = <HTMLElement>evt.currentTarget;

    if (!this._activeThumb) {
      this.setActiveThumb();
    }

    if (this._view.getVertical()) {
      if (this._activeThumb) {
        const stepValue = (
          parseFloat(stepElem.style.top) + stepElem.offsetHeight / 2
        ) / (this.getStepLength() / this._model.getStepSize());
        const thumbValue = (
          parseFloat(this._activeThumb.style.top) + this._activeThumb.offsetHeight / 2
        ) / (this.getStepLength() / this._model.getStepSize());

        this.addStepsToActiveThumb((stepValue - thumbValue) / this._model.getStepSize());
        this.removeActiveThumb();
      }
    } else {
      if (this._activeThumb) {
        const stepValue = (
          parseFloat(stepElem.style.left) + stepElem.offsetWidth / 2
        ) / (this.getStepLength() / this._model.getStepSize());
        const thumbValue = (
          parseFloat(this._activeThumb.style.left) + this._activeThumb.offsetWidth / 2
        ) / (this.getStepLength() / this._model.getStepSize());

        this.addStepsToActiveThumb((stepValue - thumbValue) / this._model.getStepSize());
        this.removeActiveThumb();
      }
    }
  }

  // Добавить обработчик onKeydown и useKeyboard = true
  addKeyboardListener(): void {
    document.addEventListener('keydown', this.onKeydown);
    this.useKeyboard = true;
  }
  // Убирает слушатель клавиатуры и useKeyboard = false
  removeKeyboardListener() {
    document.removeEventListener('keydown', this.onKeydown);
    this.useKeyboard = false;
  }

  // При нажатии клавиш wasd и стрелок вызывается addStepsToActiveThumb(1/-1)
  private onKeydown(evt: KeyboardEvent): void {
    if (evt.key === 'ArrowRight' || evt.key === 'ArrowBottom'
      || evt.key === 'd' || evt.key === 's') {
      this.addStepsToActiveThumb(1);
    } else if (evt.key === 'ArrowLeft' || evt.key === 'ArrowTop'
      || evt.key === 'a' || evt.key === 'w') {
      this.addStepsToActiveThumb(-1);
    }
  }

  // Получить активный ползунок
  getActiveThumb(): HTMLElement | undefined {
    return this._activeThumb;
  }

  // Получить длину шага
  getStepLength(): number {
    const numOfSteps = (this._model.getMax() - this._model.getMin())
      / this._model.getStepSize();
    return this._view.getLength() / numOfSteps;
  }

  // Перемещает ползунок на numOfSteps шагов и передает значение в model
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
      let stepsToAdd: number = numOfSteps;
      if (pos <= maxPos) {
        if (pos >= minPos) {
          this._activeThumb.style[leftOrTop] = `${pos}px`;
        } else {
          stepsToAdd = (minPos - parseFloat(this._activeThumb.style[leftOrTop]))
            / this.getStepLength();
          this._activeThumb.style[leftOrTop] = `${minPos}px`;
        }
      } else {
        stepsToAdd = (maxPos - parseFloat(this._activeThumb.style[leftOrTop]))
          / this.getStepLength();
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
        this._model.addStepsToValue(stepsToAdd, valueNum);
      } else {
        this._model.addStepsToValue(stepsToAdd);
      }

      // this._view.updateProgressBar();

      if (this.onChange) {
        this.onChange();
      }
    }
  }

  // При перемещении мыши вызывается addStepsToActiveThumb с numOfSteps,
  // зависящим от смещения мыши и перезаписывается this._client(X/Y)
  private thumbOnMove(evt: MouseEvent) {
    if (this._activeThumb) {
      if (this._view.getVertical()) {
        if (Math.abs(evt.clientY - this._clientY) >= this.getStepLength()) {
          const numOfSteps = Math.trunc((evt.clientY - this._clientY) / this.getStepLength());
          this.addStepsToActiveThumb(numOfSteps);

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
