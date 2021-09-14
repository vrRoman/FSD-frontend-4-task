import autoBind from 'auto-bind';

import type { IViewModelGetMethods } from 'View/ViewModel';
import type { IView } from 'View';
import { addClass, removeClass } from 'utilities/changeClassList';

import IBarView from './BarView.model';

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
  getLength(): number {
    const { widthOrHeight } = this.mainView.getElementProperties();
    return this.bar.getBoundingClientRect()[widthOrHeight];
  }

  mountBar() {
    if (!this.isBarMounted) {
      this.isBarMounted = true;
      this.target.appendChild(this.bar);
      this.updateBar();
    }
  }

  mountProgressBar() {
    if (!this.isProgressBarMounted) {
      this.isProgressBarMounted = true;
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
      const [firstPosition, secondPosition] = valuePosition;
      this.progressBar.style[widthOrHeight] = `${secondPosition - firstPosition}px`;
      this.progressBar.style[leftOrTop] = `${firstPosition}px`;
    }
  }

  // Обновляет длину и направление бара
  updateBar() {
    const { widthOrHeight, opposites } = this.mainView.getElementProperties();
    this.bar.style[widthOrHeight] = this.viewModel.getData('length');
    this.bar.style[opposites.widthOrHeight] = '';
  }

  // При нажатии на бар будет меняться значение
  addInteractivity() {
    this.removeInteractivity();
    const { clickableBarClass } = this.viewModel.getData('classes');
    addClass(this.bar, clickableBarClass);
    this.bar.addEventListener('mousedown', this.handleBarMouseDown);
  }

  removeInteractivity() {
    const { clickableBarClass } = this.viewModel.getData('classes');
    removeClass(this.bar, clickableBarClass);
    this.bar.removeEventListener('mousedown', this.handleBarMouseDown);
  }

  private createBar(): HTMLElement {
    const bar: HTMLElement = document.createElement('div');
    const { barClass } = this.viewModel.getData('classes');

    addClass(bar, barClass);
    bar.style.position = 'relative';

    this.bar = bar;

    if (this.viewModel.getData('isBarClickable')) {
      this.addInteractivity();
    }

    return bar;
  }

  private createProgressBar(): HTMLElement {
    const progressBar: HTMLElement = document.createElement('div');
    const { progressBarClass } = this.viewModel.getData('classes');

    addClass(progressBar, progressBarClass);
    progressBar.style.position = 'absolute';

    this.progressBar = progressBar;

    return progressBar;
  }

  private handleBarMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const stepLength = this.viewModel.getStepLength();
    const {
      clientXOrY,
      leftOrTop,
      widthOrHeight,
      rightOrBottom,
    } = this.mainView.getElementProperties();
    const clickPosition = event[clientXOrY] - this.bar.getBoundingClientRect()[leftOrTop];
    const bar = this.mainView.getElement('bar');
    const barMaxCoordinate = bar.getBoundingClientRect()[rightOrBottom];
    const barMinCoordinate = bar.getBoundingClientRect()[leftOrTop];

    const activeThumb = this.mainView.updateActiveThumb(clickPosition);
    const activeThumbPosition = parseFloat(activeThumb.style[leftOrTop])
      + activeThumb.getBoundingClientRect()[widthOrHeight] / 2;

    const lastStepPosition = barMaxCoordinate - barMinCoordinate;
    const lastStep = Math.ceil(lastStepPosition / stepLength);
    const secondToLastStepPosition = (lastStep - 1) * stepLength;
    const isLastStep = clickPosition
      > (lastStepPosition - secondToLastStepPosition) / 2 + secondToLastStepPosition;
    const currentStep = Math.ceil(activeThumbPosition / stepLength);

    const newStep = isLastStep ? lastStep : Math.round(clickPosition / stepLength);
    this.mainView.moveActiveThumb(newStep - currentStep);
  }
}

export default BarView;
