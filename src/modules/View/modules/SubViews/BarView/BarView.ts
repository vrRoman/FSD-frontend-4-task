import autoBind from 'auto-bind';

import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import IBarView from './interface';
import IView from '../../View/interfacesAndTypes';
import { addClass, removeClass } from '../../../../../utilities/changeClassList';

class BarView implements IBarView {
  private readonly target: HTMLElement

  private readonly viewModel: IViewModelGetMethods

  private readonly mainView: IView

  private bar: HTMLElement

  private progressBar: HTMLElement

  private isBarMounted: boolean

  private isProgressBarMounted: boolean

  constructor(target: HTMLElement, mainView: IView) {
    autoBind(this);

    this.target = target;
    this.mainView = mainView;
    this.viewModel = this.mainView.getViewModel();

    this.bar = this.createBar();
    this.progressBar = this.createProgressBar();
    this.isBarMounted = false;
    this.isProgressBarMounted = false;
  }

  getBar(): HTMLElement {
    return this.bar;
  }

  getProgressBar(): HTMLElement {
    return this.progressBar;
  }

  // Возвращает длину всего бара
  getOffsetLength(): number {
    if (this.viewModel.getIsVertical()) {
      return this.bar.offsetHeight;
    }
    return this.bar.offsetWidth;
  }

  mountBar() {
    if (!this.isBarMounted) {
      this.target.appendChild(this.bar);
      this.updateBar();
    }
  }

  mountProgressBar() {
    if (!this.isProgressBarMounted) {
      this.bar.appendChild(this.progressBar);
      this.updateProgressBar();
    }
  }

  // Обновляет длину и направление прогресс-бара
  updateProgressBar() {
    const valuePosition = this.viewModel.getValuePosition();
    const { widthOrHeight, leftOrTop, opposites } = this.mainView.getElementProperties();

    this.progressBar.style[opposites.widthOrHeight] = '';
    this.progressBar.style[opposites.leftOrTop] = '';

    if (typeof valuePosition === 'number') {
      this.progressBar.style[widthOrHeight] = `${valuePosition}px`;
      this.progressBar.style[leftOrTop] = '0';
    } else {
      this.progressBar.style[widthOrHeight] = `${valuePosition[1] - valuePosition[0]}px`;
      this.progressBar.style[leftOrTop] = `${valuePosition[0]}px`;
    }
  }

  // Обновляет длину и направление бара
  updateBar() {
    const { widthOrHeight, opposites } = this.mainView.getElementProperties();
    this.bar.style[widthOrHeight] = this.viewModel.getLength();
    this.bar.style[opposites.widthOrHeight] = '';
  }

  // При нажатии на бар будет меняться значение
  addInteractivity() {
    this.removeInteractivity();
    const { clickableBarClass } = this.viewModel.getClasses();
    addClass(this.bar, clickableBarClass);
    this.bar.addEventListener('mousedown', this.handleBarMouseDown);
  }

  removeInteractivity() {
    const { clickableBarClass } = this.viewModel.getClasses();
    removeClass(this.bar, clickableBarClass);
    this.bar.removeEventListener('mousedown', this.handleBarMouseDown);
  }

  private createBar(): HTMLElement {
    const bar: HTMLElement = document.createElement('div');
    const { barClass } = this.viewModel.getClasses();

    addClass(bar, barClass);
    bar.style.position = 'relative';

    this.bar = bar;

    if (this.viewModel.getIsBarClickable()) {
      this.addInteractivity();
    }

    return bar;
  }

  private createProgressBar(): HTMLElement {
    const progressBar: HTMLElement = document.createElement('div');
    const { progressBarClass } = this.viewModel.getClasses();

    addClass(progressBar, progressBarClass);
    progressBar.style.position = 'absolute';

    this.progressBar = progressBar;

    return progressBar;
  }

  private handleBarMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const stepLength = this.viewModel.getStepLength();
    const { clientXOrY, leftOrTop, offsetWidthOrHeight } = this.mainView.getElementProperties();
    const clickPosition = event[clientXOrY] - this.bar.getBoundingClientRect()[leftOrTop];

    if (!this.viewModel.getActiveThumb()) {
      this.mainView.setActiveThumb(
        this.mainView.getThumbNumberThatCloserToPosition(clickPosition),
      );
    }
    const activeThumb = this.viewModel.getActiveThumb();
    if (activeThumb === null) {
      throw new Error('activeThumb is null');
    }

    const activeThumbPosition = parseFloat(activeThumb.style[leftOrTop])
      + activeThumb[offsetWidthOrHeight] / 2;
    const numberOfSteps = stepLength === 0
      ? 0
      : Math.round((clickPosition - activeThumbPosition) / stepLength);
    this.mainView.moveActiveThumb(numberOfSteps);
  }
}

export default BarView;
