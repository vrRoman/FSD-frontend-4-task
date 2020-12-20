import { IModel } from './interfaces/modelTypesAndInterfaces';
import { SliderOptions, ViewOptions } from './interfaces/options';
import { IView } from './interfaces/viewInterfaces';

class View implements IView {
  sliderClass: string | string[]
  sliderVerticalClass: string | string[]
  barClass: string | string[]
  progressBarClass: string | string[]
  thumbClass: string | string[]
  activeThumbClass: string | string[]
  tooltipClass: string | string[]
  stepsInfoClass: string | string[]
  valueInfoClass: string | string[]

  private useKeyboard: boolean
  private interactiveStepsInfo: boolean
  private _activeThumb: HTMLElement | undefined;
  private _clientX: number;
  private _clientY: number;
  private _responsive: boolean
  private _lastLength: number
  private readonly _model: IModel
  private _parent: Element
  private _slider: HTMLElement
  private _bar: HTMLElement
  private _progressBar: HTMLElement
  private _thumb: HTMLElement | Array<HTMLElement> | undefined
  private _tooltip: HTMLElement | Array<HTMLElement> | undefined
  private _stepsInfo: HTMLElement | undefined
  private _valueInfo: HTMLElement | undefined
  private _length: string
  private _vertical: boolean
  private _stepsInfoSettings: boolean | Array<number | string> | number

  constructor(model: IModel, viewOptions: ViewOptions | SliderOptions, parent: Element) {
    this.sliderClass = viewOptions.sliderClass ? viewOptions.sliderClass : 'slider';
    this.sliderVerticalClass = viewOptions.sliderVerticalClass ? viewOptions.sliderVerticalClass : 'slider_vertical';
    this.barClass = viewOptions.barClass ? viewOptions.barClass : 'slider__bar';
    this.progressBarClass = viewOptions.progressBarClass ? viewOptions.progressBarClass : 'slider__progress-bar';
    this.thumbClass = viewOptions.thumbClass ? viewOptions.thumbClass : 'slider__thumb';
    this.activeThumbClass = viewOptions.activeThumbClass ? viewOptions.activeThumbClass : 'slider__thumb_active';
    this.tooltipClass = viewOptions.tooltipClass ? viewOptions.tooltipClass : 'slider__tooltip';
    this.stepsInfoClass = viewOptions.stepsInfoClass ? viewOptions.stepsInfoClass : 'slider__steps-info';
    this.valueInfoClass = viewOptions.valueInfoClass ? viewOptions.valueInfoClass : 'slider__value-info';

    this._clientX = 0;
    this._clientY = 0;
    this._activeThumb = undefined;

    this._model = model;

    this._length = viewOptions.length;

    this._vertical = viewOptions.vertical;
    this._stepsInfoSettings = viewOptions.stepsInfo;

    this._parent = parent;
    this._slider = this.createSlider();
    this._bar = this.createBar();
    this._progressBar = this.createProgressBar();
    this._thumb = this.createThumb();
    this._tooltip = viewOptions.tooltip ? this.createTooltip() : undefined;
    this._stepsInfo = viewOptions.stepsInfo ? this.createStepsInfo() : undefined;
    this._valueInfo = viewOptions.valueInfo ? this.createValueInfo() : undefined;
    this.useKeyboard = viewOptions.useKeyboard;
    this.interactiveStepsInfo = viewOptions.interactiveStepsInfo;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.handleThumbMouseDown = this.handleThumbMouseDown.bind(this);
    this.handleThumbMouseUp = this.handleThumbMouseUp.bind(this);
    this.handleThumbMouseMove = this.handleThumbMouseMove.bind(this);
    this.removeActiveThumb = this.removeActiveThumb.bind(this);

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleStepElemMouseDown = this.handleStepElemMouseDown.bind(this);

    if (this.useKeyboard) {
      this.addKeyboardListener();
    }

    if (this.interactiveStepsInfo) {
      this.addStepsInfoInteractivity();
    }

    this._lastLength = this.getLength();

    this._responsive = this.changeResponsive(viewOptions.responsive);

    this.addThumbListener();
  }

  // Возвращает значение responsive
  getResponsive(): boolean {
    return this._responsive;
  }
  // Изменяет значение responsive, добавляет/убирает слушатели window resize
  // Возвращает новое значение responsive
  changeResponsive(newResponsive: boolean): boolean {
    if (this._responsive !== newResponsive) {
      if (newResponsive) {
        window.addEventListener('resize', this.onWindowResize);
      } else {
        window.removeEventListener('resize', this.onWindowResize);
      }
      this._responsive = newResponsive;
    }
    return this.getResponsive();
  }
  // Используется в слушателях window-resize
  private onWindowResize(): void {
    if (this.getLength() !== this._lastLength) {
      this.updateProgressBar();
      this.updateThumb();
      this.updateStepsInfo();

      this._lastLength = this.getLength();
    }
  }

  private getModel(): IModel {
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
  getProgressBar(): HTMLElement {
    return this._progressBar;
  }
  getThumb(): HTMLElement | Array<HTMLElement> | undefined {
    return this._thumb;
  }
  getTooltip(): HTMLElement | Array<HTMLElement> | undefined {
    return this._tooltip;
  }
  getStepsInfo(): HTMLElement | undefined {
    return this._stepsInfo;
  }
  getValueInfo(): HTMLElement | undefined {
    return this._valueInfo;
  }

  // Возвращает длину слайдер-бара в px
  getLength(): number {
    if (this.getVertical()) {
      return +this.getBar().offsetHeight;
    }
    return +this.getBar().offsetWidth;
  }
  // Получить длину шага
  getStepLength(): number {
    const numOfSteps = (this._model.getMax() - this._model.getMin())
        / this._model.getStepSize();
    return this.getLength() / numOfSteps;
  }
  getVertical(): boolean {
    return this._vertical;
  }
  // Возвращает заданные настройки stepsInfo
  getStepsInfoSettings(): boolean | Array<number | string> | number {
    return this._stepsInfoSettings;
  }
  // Возвращает нужное положение ползунка(ов), исходя из значений модели
  getThumbPosition(): number | number[] {
    const value = this.getModel().getValue();
    let thumbPosition;
    // value === 'number' при range = false
    if (typeof value === 'number') {
      thumbPosition = (this.getLength() / this.getModel().getMaxDiapason())
        * (value - this.getModel().getMin());
    } else {
      thumbPosition = [
        (this.getLength() / this.getModel().getMaxDiapason())
          * (value[0] - this.getModel().getMin()),
        (this.getLength() / this.getModel().getMaxDiapason())
          * (value[1] - this.getModel().getMin()),
      ];
    }

    return thumbPosition;
  }


  // Изменяет ширину/высоту слайдера, обновляет положение элементов
  // слайдера, возвращает новую длину
  changeLength(newLength: string): number {
    this._length = newLength;

    if (this.getVertical()) {
      this.getBar().style.height = this._length;
    } else {
      this.getBar().style.width = this._length;
    }

    this.updateThumb();

    this.updateProgressBar();

    this.updateStepsInfo();

    return this.getLength();
  }

  // Меняет положение всех элементов на новое значение vertical и возвращает его
  changeVertical(newVertical: boolean): boolean {
    this._vertical = newVertical;

    const stepsInfo = this.getStepsInfo();

    if (!this._vertical) {
      this.getBar().style.width = this._length;
      this.getBar().style.height = '';
      if (Array.isArray(this.sliderVerticalClass)) {
        this.getSlider().classList.remove(...this.sliderVerticalClass);
      } else {
        this.getSlider().classList.remove(this.sliderVerticalClass);
      }
      const thumb = this.getThumb();
      const thumbPosition = this.getThumbPosition();
      const progressBar = this.getProgressBar();

      if (thumb) {
        if (!Array.isArray(thumb) && typeof thumbPosition === 'number') {
          thumb.style.top = '';
          thumb.style.left = `${thumbPosition - thumb.offsetHeight / 2}px`;

          progressBar.style.width = `${thumbPosition}px`;
          progressBar.style.height = '';
          progressBar.style.left = '0';
          progressBar.style.top = '';
        } else if (Array.isArray(thumb) && Array.isArray(thumbPosition)) {
          for (let i = 0; i <= 1; i += 1) {
            thumb[i].style.left = `${thumbPosition[i] - thumb[i].offsetHeight / 2}px`;
            thumb[i].style.top = '';

            progressBar.style.width = `${thumbPosition[1] - thumbPosition[0]}px`;
            progressBar.style.height = '';
            progressBar.style.left = `${thumbPosition[0]}px`;
            progressBar.style.top = '';
          }
        }
      }
    } else {
      this.getBar().style.height = this._length;
      this.getBar().style.width = '';
      if (Array.isArray(this.sliderVerticalClass)) {
        this.getSlider().classList.add(...this.sliderVerticalClass);
      } else {
        this.getSlider().classList.add(this.sliderVerticalClass);
      }
      const thumb = this.getThumb();
      const thumbPosition = this.getThumbPosition();
      const progressBar = this.getProgressBar();

      if (thumb) {
        if (!Array.isArray(thumb) && typeof thumbPosition === 'number') {
          thumb.style.left = '';
          thumb.style.top = `${thumbPosition - thumb.offsetHeight / 2}px`;

          progressBar.style.height = `${thumbPosition}px`;
          progressBar.style.width = '';
          progressBar.style.top = '0';
          progressBar.style.left = '';
        } else if (Array.isArray(thumb) && Array.isArray(thumbPosition)) {
          for (let i = 0; i <= 1; i += 1) {
            thumb[i].style.top = `${thumbPosition[i] - thumb[i].offsetHeight / 2}px`;
            thumb[i].style.left = '';

            progressBar.style.height = `${thumbPosition[1] - thumbPosition[0]}px`;
            progressBar.style.width = '';
            progressBar.style.top = `${thumbPosition[0]}px`;
            progressBar.style.left = '';
          }
        }
      }
    }

    if (stepsInfo) {
      stepsInfo.remove();
      this.createStepsInfo();
    }

    return this._vertical;
  }

  // Создает и возвращает слайдер в this._parent
  createSlider(): HTMLElement {
    const slider = document.createElement('div');
    if (Array.isArray(this.sliderClass)) {
      slider.classList.add(...this.sliderClass);
    } else {
      slider.classList.add(this.sliderClass);
    }

    if (this.getVertical()) {
      if (Array.isArray(this.sliderVerticalClass)) {
        slider.classList.add(...this.sliderVerticalClass);
      } else {
        slider.classList.add(this.sliderVerticalClass);
      }
    }

    this._parent.appendChild(slider);

    return slider;
  }
  // Создает и возвращает бар в this._slider
  createBar(): HTMLElement {
    const bar = document.createElement('div');
    if (Array.isArray(this.barClass)) {
      bar.classList.add(...this.barClass);
    } else {
      bar.classList.add(this.barClass);
    }
    bar.style.position = 'relative';

    if (!this._vertical) {
      bar.style.width = this._length;
    } else {
      bar.style.height = this._length;
    }

    this.getSlider().appendChild(bar);
    return bar;
  }
  // Создает и возвращает прогресс-бар в баре
  createProgressBar(): HTMLElement {
    const progressBar = document.createElement('div');
    this.getBar().appendChild(progressBar);

    if (Array.isArray(this.progressBarClass)) {
      progressBar.classList.add(...this.progressBarClass);
    } else {
      progressBar.classList.add(this.progressBarClass);
    }
    progressBar.style.position = 'absolute';

    this._progressBar = progressBar;

    this.updateProgressBar();

    return progressBar;
  }
  // Обновляет положение прогресс-бара
  updateProgressBar(): void {
    const thumbPosition = this.getThumbPosition();

    if (typeof thumbPosition === 'number') {
      if (this.getVertical()) {
        this.getProgressBar().style.height = `${thumbPosition}px`;
        this.getProgressBar().style.top = '0';
      } else {
        this.getProgressBar().style.width = `${thumbPosition}px`;
        this.getProgressBar().style.left = '0';
      }
    } else {
      if (this.getVertical()) {
        this.getProgressBar().style.height = `${thumbPosition[1] - thumbPosition[0]}px`;
        this.getProgressBar().style.top = `${thumbPosition[0]}px`;
      } else {
        this.getProgressBar().style.width = `${thumbPosition[1] - thumbPosition[0]}px`;
        this.getProgressBar().style.left = `${thumbPosition[0]}px`;
      }
    }
  }
  // Создает и возвращает ползунок(ки) в баре
  createThumb(): HTMLElement | Array<HTMLElement> {
    const thumbPosition = this.getThumbPosition();

    // thumbPosition === 'number' при range = false
    if (typeof thumbPosition === 'number') {
      const thumb = document.createElement('div');

      if (Array.isArray(this.thumbClass)) {
        thumb.classList.add(...this.thumbClass);
      } else {
        thumb.classList.add(this.thumbClass);
      }
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
      for (let i = 0; i <= 1; i += 1) {
        const thumb = document.createElement('div');
        if (Array.isArray(this.thumbClass)) {
          thumb.classList.add(...this.thumbClass);
        } else {
          thumb.classList.add(this.thumbClass);
        }
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
  // Обновляет положение ползунков
  updateThumb() {
    const thumbPosition = this.getThumbPosition();
    const thumb = this.getThumb();

    if (thumb) {
      if (typeof thumbPosition === 'number' && !Array.isArray(thumb)) {
        if (this.getVertical()) {
          thumb.style.top = `${thumbPosition - thumb.offsetHeight / 2}px`;
        } else {
          thumb.style.left = `${thumbPosition - thumb.offsetWidth / 2}px`;
        }
      } else if (Array.isArray(thumbPosition) && Array.isArray(thumb)) {
        for (let i = 0; i <= 1; i += 1) {
          if (this.getVertical()) {
            thumb[i].style.top = `${thumbPosition[i] - thumb[i].offsetHeight / 2}px`;
          } else {
            thumb[i].style.left = `${thumbPosition[i] - thumb[i].offsetWidth / 2}px`;
          }
        }
      }
    }
  }
  // Удаляет ползунок(ки)
  removeThumb() {
    const thumb = this.getThumb();

    if (thumb) {
      if (Array.isArray(thumb)) {
        thumb.forEach((thumbElem) => {
          thumbElem.remove();
        });
      } else {
        thumb.remove();
      }
    }

    this._thumb = undefined;
  }
  // Получить активный ползунок
  getActiveThumb(): HTMLElement | undefined {
    return this._activeThumb;
  }
  // Убирает класс активного ползунка и _activeThumb = undefined
  removeActiveThumb(): void {
    if (this._activeThumb) {
      if (Array.isArray(this.activeThumbClass)) {
        this._activeThumb.classList.remove(...this.activeThumbClass);
      } else {
        this._activeThumb.classList.remove(this.activeThumbClass);
      }
      this._activeThumb = undefined;
    }
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
    const stepsInfo = this.getStepsInfo();
    if (stepsInfo) {
      const stepElems = Array.from(stepsInfo.children) as HTMLElement[];
      for (let i = 0; i < stepElems.length; i += 1) {
        stepElems[i].addEventListener('mousedown', this.handleStepElemMouseDown);
      }
      this.interactiveStepsInfo = true;
    }
  }
  // Убирает слушатель клика у элементов шкалы значений и
  // interactiveStepsInfo = false
  removeStepsInfoInteractivity(): void {
    const stepsInfo = this.getStepsInfo();
    if (stepsInfo) {
      const stepElems = Array.from(stepsInfo.children) as HTMLElement[];
      for (let i = 0; i < stepElems.length; i += 1) {
        stepElems[i].removeEventListener('mousedown', this.handleStepElemMouseDown);
      }
      this.interactiveStepsInfo = false;
    }
  }
  // При клике на элементы шкалы значений вызывает addStepsToActiveThumb и
  // убирает активный ползунок
  private handleStepElemMouseDown(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    const stepElem = <HTMLElement>evt.currentTarget;

    if (!this._activeThumb) {
      this.setActiveThumb();
    }

    if (this.getVertical()) {
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
    document.addEventListener('keydown', this.handleDocumentKeyDown);
    this.useKeyboard = true;
  }
  // Убирает слушатель клавиатуры и useKeyboard = false
  removeKeyboardListener() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    this.useKeyboard = false;
  }

  // При нажатии клавиш wasd и стрелок вызывается addStepsToActiveThumb(1/-1)
  private handleDocumentKeyDown(evt: KeyboardEvent): void {
    const isThisNextKey = evt.key === 'ArrowRight' || evt.key === 'ArrowBottom'
        || evt.key === 'd' || evt.key === 's';
    const isThisPrevKey = evt.key === 'ArrowLeft' || evt.key === 'ArrowTop'
        || evt.key === 'a' || evt.key === 'w';

    if (isThisNextKey) {
      this.addStepsToActiveThumb(1);
    } else if (isThisPrevKey) {
      this.addStepsToActiveThumb(-1);
    }
  }

  // Убирает предыдущий активный ползунок, добавляет класс новому
  // _activeThumb, увеличивает z-index нового активного ползунка
  setActiveThumb(numOfThumb: number = 1): void {
    const thumb = this.getThumb();

    if (thumb) {
      this.removeActiveThumb();

      if (Array.isArray(thumb)) {
        this._activeThumb = thumb[numOfThumb];
      } else {
        this._activeThumb = thumb;
      }

      if (Array.isArray(this.activeThumbClass)) {
        this._activeThumb.classList.add(...this.activeThumbClass);
      } else {
        this._activeThumb.classList.add(this.activeThumbClass);
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
  // Перемещает ползунок на numOfSteps шагов и передает значение в model
  private addStepsToActiveThumb(numOfSteps = 1): void {
    if (this._activeThumb) {
      const thumb = this.getThumb();

      let activeThumbIsFirst: boolean = false;
      if (Array.isArray(thumb)) {
        if (thumb[0].isEqualNode(this._activeThumb)) {
          activeThumbIsFirst = true;
        }
      }

      let offsetWidthOrHeight: 'offsetHeight' | 'offsetWidth';
      let leftOrTop: 'left' | 'top';
      if (this.getVertical()) {
        offsetWidthOrHeight = 'offsetHeight';
        leftOrTop = 'top';
      } else {
        offsetWidthOrHeight = 'offsetWidth';
        leftOrTop = 'left';
      }

      let maxPos: number = this.getLength() - this._activeThumb[offsetWidthOrHeight] / 2;
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

      // if (this.onChange) {
      //   this.onChange();
      // }
    }
  }


  // При нажатии на ползунок убирает z-index предыдущего активного ползунка,
  // перезаписывает activeThumb, _clientX/Y, добавляет обработчики
  // handleThumbMouseMove, thumbOnUp и убирает слушатель
  // document-mouseup-removeActiveThumb
  private handleThumbMouseDown(evt: MouseEvent | TouchEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    const target = <HTMLElement>evt.target;
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
            + this.getBar().getBoundingClientRect().left
            + this._activeThumb.offsetWidth / 2;

        this._clientY = parseFloat(this._activeThumb.style.top)
            + this.getBar().getBoundingClientRect().top
            + this._activeThumb.offsetHeight / 2;
      }
    }

    document.addEventListener('mousemove', this.handleThumbMouseMove);
    document.addEventListener('touchmove', this.handleThumbMouseMove);
    document.addEventListener('mouseup', this.handleThumbMouseUp);
    document.addEventListener('touchend', this.handleThumbMouseUp);

    document.removeEventListener('mouseup', this.removeActiveThumb);
    document.removeEventListener('touchend', this.removeActiveThumb);
  }
  // При отжатии кнопки после ползунка убирает обработчики handleThumbMouseMove и
  // handleThumbMouseUp, добавляет слушатель document-mouseup, который убирает
  // активный тамб при клике в любое место документа
  private handleThumbMouseUp() {
    document.removeEventListener('mousemove', this.handleThumbMouseMove);
    document.removeEventListener('touchmove', this.handleThumbMouseMove);
    document.removeEventListener('mouseup', this.handleThumbMouseUp);
    document.removeEventListener('touchend', this.handleThumbMouseUp);
    document.addEventListener('mouseup', this.removeActiveThumb);
    document.addEventListener('touchend', this.removeActiveThumb);
  }
  // При перемещении мыши вызывается addStepsToActiveThumb с numOfSteps,
  // зависящим от смещения мыши и перезаписывается this._client(X/Y)
  private handleThumbMouseMove(evt: MouseEvent | TouchEvent) {
    if (this._activeThumb) {
      let clientX;
      let clientY;
      if ('clientX' in evt) {
        clientX = evt.clientX;
        clientY = evt.clientY;
      } else {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
      }
      if (this.getVertical()) {
        if (Math.abs(clientY - this._clientY) >= this.getStepLength()) {
          const numOfSteps = Math.trunc((clientY - this._clientY) / this.getStepLength());
          this.addStepsToActiveThumb(numOfSteps);

          this._clientY = parseFloat(this._activeThumb.style.top)
              + this.getBar().getBoundingClientRect().top
              + this._activeThumb.offsetHeight / 2;
        }
      } else {
        if (Math.abs(clientX - this._clientX) >= this.getStepLength()) {
          const numOfSteps = Math.trunc((clientX - this._clientX) / this.getStepLength());
          this.addStepsToActiveThumb(numOfSteps);

          this._clientX = parseFloat(this._activeThumb.style.left)
              + this.getBar().getBoundingClientRect().left
              + this._activeThumb.offsetWidth / 2;
        }
      }
    }
  }

  // Добавляет слушатель thumb onMouseDown к ползунку(ам)
  addThumbListener(): void {
    const thumb = this.getThumb();
    if (Array.isArray(thumb)) {
      for (let i = 0; i <= 1; i += 1) {
        thumb[i].addEventListener('mousedown', this.handleThumbMouseDown);
        thumb[i].addEventListener('touchstart', this.handleThumbMouseDown);
      }
    } else {
      if (thumb) {
        thumb.addEventListener('mousedown', this.handleThumbMouseDown);
        thumb.addEventListener('touchstart', this.handleThumbMouseDown);
      }
    }
  }

  // Создает и возвращает подсказки в ползунках
  createTooltip(): HTMLElement | Array<HTMLElement> | undefined {
    const thumb = this.getThumb();
    const value = this.getModel().getValue();

    if (Array.isArray(thumb)) {
      this._tooltip = [];
      for (let i = 0; i <= 1; i += 1) {
        const tooltip = document.createElement('div');
        if (Array.isArray(this.tooltipClass)) {
          tooltip.classList.add(...this.tooltipClass);
        } else {
          tooltip.classList.add(this.tooltipClass);
        }

        if (Array.isArray(value)) {
          tooltip.innerHTML = `<div>${+(value[i]).toFixed(3)}</div>`;
        }

        thumb[i].appendChild(tooltip);
        this._tooltip.push(tooltip);
      }
    } else {
      const tooltip = document.createElement('div');
      if (Array.isArray(this.tooltipClass)) {
        tooltip.classList.add(...this.tooltipClass);
      } else {
        tooltip.classList.add(this.tooltipClass);
      }

      if (!Array.isArray(value)) {
        tooltip.innerHTML = `<div>${+(value).toFixed(3)}</div>`;
      }

      if (thumb) thumb.appendChild(tooltip);

      this._tooltip = tooltip;
    }
    return this._tooltip;
  }
  // Обновляет значение в подсказках
  updateTooltip() {
    const tooltip = this.getTooltip();
    const value = this.getModel().getValue();
    if (tooltip) {
      if (Array.isArray(tooltip)) {
        if (Array.isArray(value)) {
          for (let i = 0; i <= 1; i += 1) {
            tooltip[i].innerHTML = `<div>${+(value[i]).toFixed(3)}</div>`;
          }
        }
      } else {
        if (!Array.isArray(value)) {
          tooltip.innerHTML = `<div>${+(value).toFixed(3)}</div>`;
        }
      }
    }
  }
  // Удаляет подсказки
  removeTooltip(): void {
    const tooltip = this.getTooltip();

    if (Array.isArray(tooltip)) {
      for (let i = 0; i <= 1; i += 1) {
        tooltip[i].remove();
      }
    } else if (tooltip) {
      tooltip.remove();
    }

    this._tooltip = undefined;
  }

  // Создает шкалу значений в зависимости от текущих настроек stepsInfo.
  // Если stepsInfoSettings заданы как false, то переназначает на true
  createStepsInfo(): HTMLElement | undefined {
    const stepsInfo = document.createElement('div');
    let stepsInfoSettings = this.getStepsInfoSettings();

    this.getBar().appendChild(stepsInfo);

    if (!stepsInfoSettings) {
      this._stepsInfoSettings = true;
      stepsInfoSettings = this.getStepsInfoSettings();
    }
    if (Array.isArray(this.stepsInfoClass)) {
      stepsInfo.classList.add(...this.stepsInfoClass);
    } else {
      stepsInfo.classList.add(this.stepsInfoClass);
    }

    if (this.getVertical()) {
      stepsInfo.style.height = `${this.getLength()}px`;
    } else {
      stepsInfo.style.width = `${this.getLength()}px`;
    }

    let numOfSteps: number = 5;
    let steps: Array<number | string> = [];

    if (typeof stepsInfoSettings === 'number' || stepsInfoSettings === true) {
      if (typeof stepsInfoSettings === 'number') {
        numOfSteps = stepsInfoSettings;
      }

      for (let i = 0; i < numOfSteps; i += 1) {
        steps.push(
          this.getModel().getMin()
          + +((this.getModel().getMaxDiapason() / (numOfSteps - 1)) * i).toFixed(3),
        );
      }
    } else if (Array.isArray(stepsInfoSettings)) {
      numOfSteps = stepsInfoSettings.length;
      steps = stepsInfoSettings;
    }

    for (let i = 0; i < numOfSteps; i += 1) {
      const stepElem = document.createElement('div');
      const position = (this.getLength() / (numOfSteps - 1)) * i;
      stepElem.innerText = `${steps[i]}`;
      stepElem.style.position = 'absolute';
      stepsInfo.appendChild(stepElem);
      if (this.getVertical()) {
        stepElem.style.top = `${position - stepElem.offsetHeight / 2}px`;
      } else {
        stepElem.style.left = `${position - stepElem.offsetWidth / 2}px`;
      }
    }

    this._stepsInfo = stepsInfo;
    return stepsInfo;
  }
  // Обновляет положение элементов шкалы значений
  updateStepsInfo() {
    const stepsInfo = this.getStepsInfo();

    if (stepsInfo) {
      const stepElems = Array.from(stepsInfo.children) as HTMLElement[];

      for (let i = 0; i < stepElems.length; i += 1) {
        const position = (this.getLength() / (stepElems.length - 1)) * i;

        if (this.getVertical()) {
          stepElems[i].style.top = `${position - stepElems[i].offsetHeight / 2}px`;
        } else {
          stepElems[i].style.left = `${position - stepElems[i].offsetWidth / 2}px`;
        }
      }
    }
  }
  // Удаляет шкалу значений
  removeStepsInfo(): void {
    const stepsInfo = this.getStepsInfo();
    if (stepsInfo) {
      stepsInfo.remove();
      this._stepsInfo = undefined;
    }
  }
  // Меняет настройки шкалы значений и обновляет ее
  changeStepsInfoSettings(newStepsInfoSettings
                            : boolean | Array<number | string> | number): HTMLElement | undefined {
    this._stepsInfoSettings = newStepsInfoSettings;

    this.removeStepsInfo();
    if (this._stepsInfoSettings) {
      this.createStepsInfo();
    }
    return this.getStepsInfo();
  }

  // Создает элемент с текущим значением. По умолчанию, если range=false, то
  // указывается просто model.value, иначе записывается в виде value[0] - value[1]
  createValueInfo(): HTMLElement {
    const valueInfo = document.createElement('div');
    const value = this.getModel().getValue();

    if (Array.isArray(this.valueInfoClass)) {
      valueInfo.classList.add(...this.valueInfoClass);
    } else {
      valueInfo.classList.add(this.valueInfoClass);
    }

    this.getSlider().appendChild(valueInfo);

    if (typeof value === 'number') {
      valueInfo.innerText = `${+(value).toFixed()}`;
    } else {
      valueInfo.innerText = `${+(value[0]).toFixed()} - ${+(value[1]).toFixed()}`;
    }

    this._valueInfo = valueInfo;
    return valueInfo;
  }
  // Обновляет значение в valueInfo
  updateValueInfo() {
    const valueInfo = this.getValueInfo();
    const value = this.getModel().getValue();
    if (valueInfo) {
      if (typeof value === 'number') {
        valueInfo.innerText = `${+(value).toFixed()}`;
      } else {
        valueInfo.innerText = `${+(value[0]).toFixed()} - ${+(value[1]).toFixed()}`;
      }
    }
  }
  // Удаляет элемент со значением
  removeValueInfo(): void {
    if (this._valueInfo) {
      this._valueInfo.remove();
      this._valueInfo = undefined;
    }
  }
}

export default View;
