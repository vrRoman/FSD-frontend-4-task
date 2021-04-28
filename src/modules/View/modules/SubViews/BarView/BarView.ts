import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import IBarView from './interface';
import IView from '../../View/interfaces';

class BarView implements IBarView {
  private readonly target: HTMLElement

  private readonly viewModel: IViewModelGetMethods

  private readonly mainView: IView

  private bar: HTMLElement | undefined

  private progressBar: HTMLElement | undefined

  constructor(target: HTMLElement, viewModel: IViewModelGetMethods, mainView: IView) {
    this.target = target;
    this.bar = undefined;
    this.progressBar = undefined;

    this.viewModel = viewModel;
    this.mainView = mainView;

    this.handleBarMouseDown = this.handleBarMouseDown.bind(this);
  }

  // Возвращает элемент бара
  getBar(): HTMLElement | undefined {
    return this.bar;
  }

  // Возвращает элемент прогресс-бара
  getProgressBar(): HTMLElement | undefined {
    return this.progressBar;
  }

  // Возвращает длину бара
  getOffsetLength(): number | undefined {
    if (this.bar) {
      if (this.viewModel.getIsVertical()) {
        return this.bar.offsetHeight;
      }
      return this.bar.offsetWidth;
    }
    return undefined;
  }

  // Создает и возвращает бар в this.target
  createBar(): HTMLElement {
    const bar: HTMLElement = document.createElement('div');
    const { barClass } = this.viewModel.getClasses();
    if (Array.isArray(barClass)) {
      bar.classList.add(...barClass);
    } else {
      bar.classList.add(barClass);
    }
    bar.style.position = 'relative';

    if (!this.viewModel.getIsVertical()) {
      bar.style.width = this.viewModel.getLength();
    } else {
      bar.style.height = this.viewModel.getLength();
    }

    this.target.appendChild(bar);
    this.bar = bar;

    if (this.viewModel.getIsBarClickable()) {
      this.addInteractivity();
    }

    return bar;
  }

  // Создает в баре и возвращает прогресс-бар. Если бар еще не создан, возвращает undefined
  createProgressBar(): HTMLElement | undefined {
    if (this.bar) {
      const progressBar: HTMLElement = document.createElement('div');
      const { progressBarClass } = this.viewModel.getClasses();

      this.bar.appendChild(progressBar);

      if (Array.isArray(progressBarClass)) {
        progressBar.classList.add(...progressBarClass);
      } else {
        progressBar.classList.add(progressBarClass);
      }
      progressBar.style.position = 'absolute';

      this.progressBar = progressBar;

      this.updateProgressBar();

      return progressBar;
    }
    return undefined;
  }

  // Обновляет положение и длину прогресс-бара
  updateProgressBar() {
    if (this.progressBar) {
      const valuePosition = this.viewModel.getValuePosition();
      if (valuePosition !== undefined) {
        this.progressBar.style.width = '';
        this.progressBar.style.left = '';
        this.progressBar.style.height = '';
        this.progressBar.style.top = '';
        let widthOrHeight: 'width' | 'height' = 'width';
        let leftOrTop: 'left' | 'top' = 'left';
        if (this.viewModel.getIsVertical()) {
          widthOrHeight = 'height';
          leftOrTop = 'top';
        }
        if (typeof valuePosition === 'number') {
          this.progressBar.style[widthOrHeight] = `${valuePosition}px`;
          this.progressBar.style[leftOrTop] = '0';
        } else {
          this.progressBar.style[widthOrHeight] = `${valuePosition[1] - valuePosition[0]}px`;
          this.progressBar.style[leftOrTop] = `${valuePosition[0]}px`;
        }
      }
    }
  }

  // Обновляет длину и положение бара
  updateBar() {
    if (this.bar) {
      if (this.viewModel.getIsVertical()) {
        this.bar.style.height = this.viewModel.getLength();
        this.bar.style.width = '';
      } else {
        this.bar.style.width = this.viewModel.getLength();
        this.bar.style.height = '';
      }
    }
  }

  addInteractivity() {
    if (this.bar) {
      const { clickableBarClass } = this.viewModel.getClasses();
      if (Array.isArray(clickableBarClass)) {
        this.bar.classList.add(...clickableBarClass);
      } else {
        this.bar.classList.add(clickableBarClass);
      }
      this.bar.addEventListener('mousedown', this.handleBarMouseDown);
    }
  }

  removeInteractivity() {
    if (this.bar) {
      const { clickableBarClass } = this.viewModel.getClasses();
      if (Array.isArray(clickableBarClass)) {
        this.bar.classList.remove(...clickableBarClass);
      } else {
        this.bar.classList.remove(clickableBarClass);
      }
      this.bar.removeEventListener('mousedown', this.handleBarMouseDown);
    }
  }

  private handleBarMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.bar) {
      const length = this.viewModel.getLengthInPx();
      const stepLength = this.viewModel.getStepLength();
      if (length === undefined) {
        throw new Error('length is undefined');
      }
      if (stepLength === undefined) {
        throw new Error('stepLength is undefined');
      }

      let clientXOrY: 'clientX' | 'clientY';
      let leftOrTop: 'left' | 'top';
      let offsetWidthOrHeight: 'offsetWidth' | 'offsetHeight';
      if (this.viewModel.getIsVertical()) {
        clientXOrY = 'clientY';
        leftOrTop = 'top';
        offsetWidthOrHeight = 'offsetHeight';
      } else {
        clientXOrY = 'clientX';
        leftOrTop = 'left';
        offsetWidthOrHeight = 'offsetWidth';
      }

      const clickPosition = event[clientXOrY] - this.bar.getBoundingClientRect()[leftOrTop];

      if (!this.viewModel.getActiveThumb()) {
        this.mainView.setActiveThumb(
          this.mainView.getThumbNumberThatCloserToPosition(clickPosition),
        );
      }

      const activeThumb = this.viewModel.getActiveThumb();
      if (activeThumb === undefined) {
        throw new Error('activeThumb is undefined');
      }

      const activeThumbPosition = parseFloat(activeThumb.style[leftOrTop])
        + activeThumb[offsetWidthOrHeight] / 2;
      const numberOfSteps = Math.round((clickPosition - activeThumbPosition) / stepLength);

      this.mainView.moveActiveThumb(numberOfSteps);
    }
  }
}

export default BarView;
