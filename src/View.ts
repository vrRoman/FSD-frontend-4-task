import { SliderOptions, ViewOptions } from './interfaces/options';
import { IView } from './interfaces/viewInterfaces';
import { ModelProps, ObserverAction } from './interfaces/modelTypesAndInterfaces';

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

  private readonly _options: ViewOptions
  private _modelProps: ModelProps | undefined
  private observers: Array<any>

  private readonly _parent: Element
  private _slider: HTMLElement | undefined
  private _bar: HTMLElement | undefined
  private _progressBar: HTMLElement | undefined
  private _thumb: HTMLElement | Array<HTMLElement> | undefined
  private _tooltip: HTMLElement | Array<HTMLElement> | undefined
  private _stepsInfo: HTMLElement | undefined
  private _valueInfo: HTMLElement | undefined

  private _activeThumb: HTMLElement | undefined
  private _clientX: number
  private _clientY: number
  private _lastLength: number

  private _length: string
  private _vertical: boolean
  private _stepsInfoSettings: boolean | Array<number | string> | number
  private _responsive: boolean
  private useKeyboard: boolean
  private interactiveStepsInfo: boolean

  constructor(viewOptions: ViewOptions | SliderOptions, parent: Element) {
    this.sliderClass = viewOptions.sliderClass ? viewOptions.sliderClass : 'slider';
    this.sliderVerticalClass = viewOptions.sliderVerticalClass ? viewOptions.sliderVerticalClass : 'slider_vertical';
    this.barClass = viewOptions.barClass ? viewOptions.barClass : 'slider__bar';
    this.progressBarClass = viewOptions.progressBarClass ? viewOptions.progressBarClass : 'slider__progress-bar';
    this.thumbClass = viewOptions.thumbClass ? viewOptions.thumbClass : 'slider__thumb';
    this.activeThumbClass = viewOptions.activeThumbClass ? viewOptions.activeThumbClass : 'slider__thumb_active';
    this.tooltipClass = viewOptions.tooltipClass ? viewOptions.tooltipClass : 'slider__tooltip';
    this.stepsInfoClass = viewOptions.stepsInfoClass ? viewOptions.stepsInfoClass : 'slider__steps-info';
    this.valueInfoClass = viewOptions.valueInfoClass ? viewOptions.valueInfoClass : 'slider__value-info';

    this._options = viewOptions;
    this._modelProps = undefined;
    this.observers = [];

    this._parent = parent;
    this._slider = undefined;
    this._bar = undefined;
    this._progressBar = undefined;
    this._thumb = undefined;
    this._tooltip = undefined;
    this._stepsInfo = undefined;
    this._valueInfo = undefined;

    this._activeThumb = undefined;
    this._clientX = 0;
    this._clientY = 0;
    this._lastLength = this.getLength();

    this._length = viewOptions.length;
    this._vertical = viewOptions.vertical;
    this._stepsInfoSettings = viewOptions.stepsInfo;
    this._responsive = viewOptions.responsive;
    this.useKeyboard = viewOptions.useKeyboard;
    this.interactiveStepsInfo = viewOptions.interactiveStepsInfo;

    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleThumbMouseDown = this.handleThumbMouseDown.bind(this);
    this.handleThumbMouseUp = this.handleThumbMouseUp.bind(this);
    this.handleThumbMouseMove = this.handleThumbMouseMove.bind(this);
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleStepElemMouseDown = this.handleStepElemMouseDown.bind(this);
    this.removeActiveThumb = this.removeActiveThumb.bind(this);
  }

  drawSlider() {
    this.createSliderContainer();
    this.createBar();
    this.createProgressBar();
    this.createThumb();
    if (this.getOptions().tooltip) {
      this.createTooltip();
    }
    if (this.getOptions().stepsInfo) {
      this.createStepsInfo();
    }
    if (this.getOptions().valueInfo) {
      this.createValueInfo();
    }
    this.addThumbListener();
    if (this.getUseKeyboard()) {
      this.addKeyboardListener();
    }
    if (this.getInteractiveStepsInfo()) {
      this.addStepsInfoInteractivity();
    }
    this.changeResponsive(this.getResponsive());
  }

  // В зависимости от action, обновляет view
  update(action: ObserverAction) {
    switch (action.type) {
      case 'UPDATE_VALUE':
        if (action.updatedProps) {
          this.provideModelProps({
            value: action.updatedProps.value,
          });
        }
        this.updateThumb();
        this.updateValueInfo();
        this.updateProgressBar();
        this.updateTooltip();
        break;

      case 'UPDATE_RANGE':
        if (action.updatedProps) {
          this.provideModelProps({
            value: action.updatedProps.value,
            range: action.updatedProps.range,
          });
        }
        this.removeThumb();
        this.createThumb();
        this.addThumbListener();
        this.updateProgressBar();
        this.updateValueInfo();
        this.updateTooltip();
        break;

      case 'UPDATE_MIN-MAX':
        if (action.updatedProps) {
          this.provideModelProps({
            value: action.updatedProps.value,
            min: action.updatedProps.min,
            max: action.updatedProps.max,
            stepSize: action.updatedProps.stepSize,
          });
        }
        this.updateThumb();
        if (this.getStepsInfo()) {
          this.removeStepsInfo();
          this.createStepsInfo();
        }
        if (this.getInteractiveStepsInfo()) {
          this.addStepsInfoInteractivity();
        }
        this.updateValueInfo();
        this.updateProgressBar();
        this.updateTooltip();
        break;

      case 'UPDATE_STEPSIZE':
        if (action.updatedProps) {
          this.provideModelProps({
            stepSize: action.updatedProps.stepSize,
          });
        }
        break;

      default:
        if (action.updatedProps) {
          if (action.updatedProps.value) {
            this.provideModelProps({
              value: action.updatedProps.value,
            });
          }
          if (action.updatedProps.value) {
            this.provideModelProps({
              value: action.updatedProps.value,
            });
          }
        }
        this.removeThumb();
        this.createThumb();
        this.addThumbListener();
        if (this.getStepsInfo()) {
          this.removeStepsInfo();
          this.createStepsInfo();
        }
        if (this.getInteractiveStepsInfo()) {
          this.addStepsInfoInteractivity();
        }
        this.updateProgressBar();
        this.updateValueInfo();
        this.updateTooltip();
    }
  }

  // Перемещает ползунок на numOfSteps шагов и уведомляет подписчиков
  private moveActiveThumb(numOfSteps = 1): void {
    const stepLength = this.getStepLength();
    if (stepLength && this._modelProps) {
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

        const offset: number = stepLength * numOfSteps;
        const pos: number = parseFloat(this._activeThumb.style[leftOrTop]) + offset;
        if (pos <= maxPos) {
          if (pos >= minPos) {
            this._activeThumb.style[leftOrTop] = `${pos}px`;
            this.notify();
          } else {
            this._activeThumb.style[leftOrTop] = `${minPos}px`;
            this.notify();
          }
        } else {
          this._activeThumb.style[leftOrTop] = `${maxPos}px`;
          this.notify();
        }
      }
    }
  }

  // При нажатии на ползунок убирает z-index предыдущего активного ползунка,
  // перезаписывает activeThumb, _clientX/Y, добавляет обработчики
  // handleThumbMouseMove, handleThumbMouseUp и убирает слушатель
  // document-mouseup-removeActiveThumb
  private handleThumbMouseDown(evt: MouseEvent | TouchEvent) {
    const bar = this.getBar();
    if (bar) {
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
        // курсора, а от thumb(аналогично в handleThumbMouseMove)
        if (this._activeThumb) {
          this._clientX = parseFloat(this._activeThumb.style.left)
              + bar.getBoundingClientRect().left
              + this._activeThumb.offsetWidth / 2;

          this._clientY = parseFloat(this._activeThumb.style.top)
              + bar.getBoundingClientRect().top
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
  // При перемещении мыши вызывается moveActiveThumb с numOfSteps,
  // зависящим от смещения мыши и перезаписывается this._client(X/Y)
  private handleThumbMouseMove(evt: MouseEvent | TouchEvent) {
    const stepLength = this.getStepLength();
    const bar = this.getBar();
    if (stepLength && bar) {
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
          if (Math.abs(clientY - this._clientY) >= stepLength) {
            const numOfSteps = Math.trunc((clientY - this._clientY) / stepLength);
            this.moveActiveThumb(numOfSteps);

            this._clientY = parseFloat(this._activeThumb.style.top)
                + bar.getBoundingClientRect().top
                + this._activeThumb.offsetHeight / 2;
          }
        } else {
          if (Math.abs(clientX - this._clientX) >= stepLength) {
            const numOfSteps = Math.trunc((clientX - this._clientX) / stepLength);
            this.moveActiveThumb(numOfSteps);

            this._clientX = parseFloat(this._activeThumb.style.left)
                + bar.getBoundingClientRect().left
                + this._activeThumb.offsetWidth / 2;
          }
        }
      }
    }
  }
  // При клике на элементы шкалы значений вызывает moveActiveThumb и
  // убирает активный ползунок
  private handleStepElemMouseDown(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    const stepElem = <HTMLElement>evt.currentTarget;
    const stepLength = this.getStepLength();

    if (!this._activeThumb) {
      this.setActiveThumb();
    }

    if (stepLength) {
      if (this._modelProps && this._modelProps.stepSize !== undefined) {
        if (this.getVertical()) {
          if (this._activeThumb) {
            const stepValue = (
                parseFloat(stepElem.style.top) + stepElem.offsetHeight / 2
            ) / (stepLength / this._modelProps.stepSize);
            const thumbValue = (
                parseFloat(this._activeThumb.style.top) + this._activeThumb.offsetHeight / 2
            ) / (stepLength / this._modelProps.stepSize);

            this.moveActiveThumb((stepValue - thumbValue) / this._modelProps.stepSize);
            this.removeActiveThumb();
          }
        } else {
          if (this._activeThumb) {
            const stepValue = (
                parseFloat(stepElem.style.left) + stepElem.offsetWidth / 2
            ) / (stepLength / this._modelProps.stepSize);
            const thumbValue = (
                parseFloat(this._activeThumb.style.left) + this._activeThumb.offsetWidth / 2
            ) / (stepLength / this._modelProps.stepSize);

            this.moveActiveThumb((stepValue - thumbValue) / this._modelProps.stepSize);
            this.removeActiveThumb();
          }
        }
      }
    }
  }

  // Используется в слушателях window-resize
  private handleWindowResize(): void {
    if (this.getLength() !== this._lastLength) {
      this.updateProgressBar();
      this.updateThumb();
      this.updateStepsInfo();

      this._lastLength = this.getLength();
    }
  }
  // При нажатии клавиш wasd и стрелок вызывается moveActiveThumb(1/-1)
  private handleDocumentKeyDown(evt: KeyboardEvent): void {
    const isThisNextKey = evt.key === 'ArrowRight' || evt.key === 'ArrowBottom'
        || evt.key === 'd' || evt.key === 's';
    const isThisPrevKey = evt.key === 'ArrowLeft' || evt.key === 'ArrowTop'
        || evt.key === 'a' || evt.key === 'w';

    if (isThisNextKey) {
      this.moveActiveThumb(1);
    } else if (isThisPrevKey) {
      this.moveActiveThumb(-1);
    }
  }

  // Подписывает на обновление ползунка
  subscribe(observer: Object) {
    this.observers.push(observer);
  }
  // Убирает подписку
  unsubscribe(observer: Object) {
    this.observers.filter((obs) => obs !== observer);
  }
  // Вызывает у всех подписчиков метод onThumbMove
  notify() {
    this.observers.forEach((observer) => {
      observer.onThumbMove();
    });
  }

  // Возвращает настройки, которые переданы во view
  getOptions(): ViewOptions {
    return this._options;
  }
  // Изменяет modelProps(из него берутся все значения модели)
  provideModelProps(modelProps: ModelProps) {
    this._modelProps = {
      ...this._modelProps,
      ...modelProps,
    };
  }

  // Создает и возвращает слайдер в this._parent
  createSliderContainer(): HTMLElement {
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

    this._slider = slider;
    return slider;
  }
  // Создает и возвращает бар в this._slider
  createBar(): HTMLElement | undefined {
    if (this._slider) {
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

      this._slider.appendChild(bar);
      this._bar = bar;
      return bar;
    }
    return undefined;
  }
  // Создает и возвращает прогресс-бар в баре
  createProgressBar(): HTMLElement | undefined {
    const bar = this.getBar();
    if (bar) {
      const progressBar = document.createElement('div');
      bar.appendChild(progressBar);

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
    return undefined;
  }
  // Создает и возвращает ползунок(ки) в баре
  createThumb(): HTMLElement | Array<HTMLElement> | undefined {
    const thumbPosition = this.getThumbPosition();
    const bar = this.getBar();

    if (bar) {
      if (typeof thumbPosition === 'number') {
        const thumb = document.createElement('div');

        if (Array.isArray(this.thumbClass)) {
          thumb.classList.add(...this.thumbClass);
        } else {
          thumb.classList.add(this.thumbClass);
        }
        thumb.style.position = 'absolute';

        bar.appendChild(thumb);

        if (this.getVertical()) {
          thumb.style.top = `${thumbPosition - thumb.offsetHeight / 2}px`;
        } else {
          thumb.style.left = `${thumbPosition - thumb.offsetWidth / 2}px`;
        }

        this._thumb = thumb;
      } else if (Array.isArray(thumbPosition)) {
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

          bar.appendChild(thumb);

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
    return undefined;
  }
  // Создает и возвращает подсказки в ползунках
  createTooltip(): HTMLElement | Array<HTMLElement> | undefined {
    if (this._modelProps && this._modelProps.value !== undefined) {
      const thumb = this.getThumb();
      const { value } = this._modelProps;

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
    return undefined;
  }
  // Создает шкалу значений в зависимости от текущих настроек stepsInfo.
  // Если stepsInfoSettings заданы как false, то переназначает на true
  createStepsInfo(): HTMLElement | undefined {
    const bar = this.getBar();
    if (bar && this._modelProps) {
      if (this._modelProps.min !== undefined && this._modelProps.max !== undefined) {
        const stepsInfo = document.createElement('div');
        let stepsInfoSettings = this.getStepsInfoSettings();

        bar.appendChild(stepsInfo);

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
          const maxDiapason = this._modelProps.max - this._modelProps.min;
          for (let i = 0; i < numOfSteps; i += 1) {
            steps.push(
                this._modelProps.min
                + +((maxDiapason / (numOfSteps - 1)) * i).toFixed(3),
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
    }
    return undefined;
  }
  // Создает элемент с текущим значением. По умолчанию, если range=false, то
  // указывается просто model.value, иначе записывается в виде value[0] - value[1]
  createValueInfo(): HTMLElement | undefined {
    const slider = this.getSlider();
    if (slider) {
      if (this._modelProps && this._modelProps.value !== undefined) {
        const valueInfo = document.createElement('div');
        const { value } = this._modelProps;

        if (Array.isArray(this.valueInfoClass)) {
          valueInfo.classList.add(...this.valueInfoClass);
        } else {
          valueInfo.classList.add(this.valueInfoClass);
        }

        slider.appendChild(valueInfo);

        if (typeof value === 'number') {
          valueInfo.innerText = `${value}`;
        } else {
          valueInfo.innerText = `${value[0]} - ${value[1]}`;
        }

        this._valueInfo = valueInfo;
        return valueInfo;
      }
    }
    return undefined;
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
  // Удаляет шкалу значений
  removeStepsInfo(): void {
    const stepsInfo = this.getStepsInfo();
    if (stepsInfo) {
      stepsInfo.remove();
      this._stepsInfo = undefined;
    }
  }
  // Удаляет элемент со значением
  removeValueInfo(): void {
    if (this._valueInfo) {
      this._valueInfo.remove();
      this._valueInfo = undefined;
    }
  }

  // Обновляет положение прогресс-бара
  updateProgressBar(): void {
    const progressBar = this.getProgressBar();
    if (progressBar) {
      const thumbPosition = this.getThumbPosition();
      if (thumbPosition || thumbPosition === 0) {
        if (typeof thumbPosition === 'number') {
          if (this.getVertical()) {
            progressBar.style.height = `${thumbPosition}px`;
            progressBar.style.top = '0';
          } else {
            progressBar.style.width = `${thumbPosition}px`;
            progressBar.style.left = '0';
          }
        } else {
          if (this.getVertical()) {
            progressBar.style.height = `${thumbPosition[1] - thumbPosition[0]}px`;
            progressBar.style.top = `${thumbPosition[0]}px`;
          } else {
            progressBar.style.width = `${thumbPosition[1] - thumbPosition[0]}px`;
            progressBar.style.left = `${thumbPosition[0]}px`;
          }
        }
      }
    }
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
  // Обновляет значение в подсказках
  updateTooltip() {
    if (this._modelProps && this._modelProps.value !== undefined) {
      const tooltip = this.getTooltip();
      const { value } = this._modelProps;
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
  // Обновляет значение в valueInfo
  updateValueInfo() {
    if (this._modelProps) {
      const valueInfo = this.getValueInfo();
      const { value } = this._modelProps;
      if (valueInfo && value) {
        if (typeof value === 'number') {
          valueInfo.innerText = `${value}`;
        } else {
          valueInfo.innerText = `${value[0]} - ${value[1]}`;
        }
      }
    }
  }

  getParent(): Element {
    return this._parent;
  }
  getSlider(): HTMLElement | undefined {
    return this._slider;
  }
  getBar(): HTMLElement | undefined {
    return this._bar;
  }
  getProgressBar(): HTMLElement | undefined {
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

  // Возвращает заданные настройки stepsInfo
  getStepsInfoSettings(): boolean | Array<number | string> | number {
    return this._stepsInfoSettings;
  }
  // Возвращает значение responsive
  getResponsive(): boolean {
    return this._responsive;
  }
  // Возвращает значение vertical
  getVertical(): boolean {
    return this._vertical;
  }
  // Возвращает значение useKeyboard
  getUseKeyboard(): boolean {
    return this.useKeyboard;
  }
  // Возвращает значение interactiveStepsInfo
  getInteractiveStepsInfo(): boolean {
    return this.interactiveStepsInfo;
  }

  // Возвращает длину слайдер-бара в px
  getLength(): number {
    const bar = this.getBar();
    if (bar) {
      if (this.getVertical()) {
        return +bar.offsetHeight;
      }
      return +bar.offsetWidth;
    }
    return 0;
  }
  // Получить длину шага
  getStepLength(): number | undefined {
    if (this._modelProps && this._modelProps.stepSize !== undefined) {
      if (this._modelProps.min !== undefined && this._modelProps.max !== undefined) {
        const numOfSteps = (this._modelProps.max - this._modelProps.min)
            / this._modelProps.stepSize;
        return this.getLength() / numOfSteps;
      }
    }
    return undefined;
  }
  // Возвращает нужное положение ползунка(ов), исходя из значений модели
  getThumbPosition(): number | number[] | undefined {
    if (this._modelProps && this._modelProps.value !== undefined) {
      if (this._modelProps.min !== undefined && this._modelProps.max !== undefined) {
        const { value } = this._modelProps;
        const maxDiapason = this._modelProps.max - this._modelProps.min;
        let thumbPosition;
        // value === 'number' при range = false
        if (typeof value === 'number') {
          thumbPosition = (this.getLength() / maxDiapason)
              * (value - this._modelProps.min);
        } else {
          thumbPosition = [
            (this.getLength() / maxDiapason)
            * (value[0] - this._modelProps.min),
            (this.getLength() / maxDiapason)
            * (value[1] - this._modelProps.min),
          ];
        }

        return thumbPosition;
      }
    }
    return undefined;
  }

  // Получить активный ползунок
  getActiveThumb(): HTMLElement | undefined {
    return this._activeThumb;
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
  // Добавить обработчик onKeydown и useKeyboard = true
  addKeyboardListener(): void {
    document.addEventListener('keydown', this.handleDocumentKeyDown);
    this.useKeyboard = true;
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

  // Убирает слушатель клавиатуры и useKeyboard = false
  removeKeyboardListener() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    this.useKeyboard = false;
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

  // Изменяет ширину/высоту слайдера, обновляет положение элементов
  // слайдера, возвращает новую длину
  changeLength(newLength: string): number {
    const bar = this.getBar();
    if (bar) {
      this._length = newLength;

      if (this.getVertical()) {
        bar.style.height = this._length;
      } else {
        bar.style.width = this._length;
      }

      this.updateThumb();

      this.updateProgressBar();

      this.updateStepsInfo();
    }
    return this.getLength();
  }
  // Меняет положение всех элементов на новое значение vertical и возвращает его
  changeVertical(newVertical: boolean): boolean {
    this._vertical = newVertical;

    const stepsInfo = this.getStepsInfo();
    const bar = this.getBar();
    const slider = this.getSlider();

    if (bar && slider) {
      if (!this._vertical) {
        bar.style.width = this._length;
        bar.style.height = '';
        if (Array.isArray(this.sliderVerticalClass)) {
          slider.classList.remove(...this.sliderVerticalClass);
        } else {
          slider.classList.remove(this.sliderVerticalClass);
        }
        const thumb = this.getThumb();
        const thumbPosition = this.getThumbPosition();
        const progressBar = this.getProgressBar();

        if (thumb && progressBar) {
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
        bar.style.height = this._length;
        bar.style.width = '';
        if (Array.isArray(this.sliderVerticalClass)) {
          slider.classList.add(...this.sliderVerticalClass);
        } else {
          slider.classList.add(this.sliderVerticalClass);
        }
        const thumb = this.getThumb();
        const thumbPosition = this.getThumbPosition();
        const progressBar = this.getProgressBar();

        if (thumb && progressBar) {
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
    }
    return this._vertical;
  }
  // Изменяет значение responsive, добавляет/убирает слушатели window resize
  // Возвращает новое значение responsive
  changeResponsive(newResponsive: boolean): boolean {
    if (newResponsive) {
      window.removeEventListener('resize', this.handleWindowResize);
      window.addEventListener('resize', this.handleWindowResize);
    } else {
      window.removeEventListener('resize', this.handleWindowResize);
    }
    this._responsive = newResponsive;
    return this.getResponsive();
  }
  // Меняет настройки шкалы значений и обновляет ее
  changeStepsInfoSettings(
      newStepsInfoSettings: boolean | Array<number | string> | number,
  ): HTMLElement | undefined {
    this._stepsInfoSettings = newStepsInfoSettings;

    this.removeStepsInfo();
    if (this._stepsInfoSettings) {
      this.createStepsInfo();
    }
    return this.getStepsInfo();
  }
}

export default View;
