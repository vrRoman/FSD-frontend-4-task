import autoBind from 'auto-bind';

import type { IViewModelGetMethods } from 'View/ViewModel';
import type { IView } from 'View';
import { addClass, removeClass } from 'utilities/changeClassList';

import IScaleView from './ScaleView.model';

class ScaleView implements IScaleView {
  private readonly target: HTMLElement

  private readonly viewModel: IViewModelGetMethods

  private readonly mainView: IView

  private scale: HTMLElement

  private isMounted: boolean

  private steps: Array<{
    element: HTMLElement,
    value: number | string,
  }>

  constructor(target: HTMLElement, mainView: IView) {
    autoBind(this);

    this.target = target;
    this.mainView = mainView;
    this.viewModel = this.mainView.getViewModel();

    this.steps = [];
    this.scale = this.create();
    this.isMounted = false;
  }

  get(): HTMLElement {
    return this.scale;
  }

  // Возвращает номера/названия шагов
  getStepsValues(): Array<number | string> {
    const modelData = this.viewModel.getData('modelData');
    if (!modelData) {
      return [];
    }

    const scaleValue = this.viewModel.getData('scaleValue');
    const { min, max } = modelData;

    if (Array.isArray(scaleValue)) {
      return scaleValue;
    }

    const stepsAmount = Math.ceil((max - min) / scaleValue) + 1;
    return [...Array(stepsAmount)].map((_, index) => {
      const step = min + scaleValue * index;
      return step > max ? max : Number(step.toFixed(3));
    });
  }

  // Пересоздает шкалу, если она уже в DOM, то убирает ее и заново добавляет
  recreate(): HTMLElement {
    if (this.isMounted) {
      this.unmount();
      this.scale = this.create();
      this.mount();
    } else {
      this.scale = this.create();
    }
    return this.scale;
  }

  // Обновляет положение и длину шкалы и ее элементов
  update() {
    const length = this.viewModel.getData('lengthInPx');
    const {
      widthOrHeight,
      opposites,
    } = this.mainView.getElementProperties();

    this.scale.style[widthOrHeight] = `${length}px`;
    this.scale.style[opposites.widthOrHeight] = '';

    this.updateElementsPosition();
  }

  updateElementsPosition() {
    const { min = 0, max = 0 } = this.viewModel.getData('modelData') || {};
    const length = this.viewModel.getData('lengthInPx');
    const scaleValue = this.viewModel.getData('scaleValue');
    const {
      offsetWidthOrHeight,
      leftOrTop,
      opposites,
    } = this.mainView.getElementProperties();

    this.steps.forEach((step, index) => {
      const { element, value } = step;
      const oneValueLength = length / (max - min);
      let newPosition: number;
      if (Array.isArray(scaleValue)) {
        newPosition = (length / (this.steps.length - 1)) * index;
      } else {
        newPosition = (Number(value) - min) * oneValueLength;
      }
      element.style[leftOrTop] = `${newPosition - element[offsetWidthOrHeight] / 2}px`;
      element.style[opposites.leftOrTop] = '';
    });
  }

  mount() {
    if (!this.isMounted) {
      this.isMounted = true;
      this.target.appendChild(this.scale);
      this.update();
    }
  }

  unmount() {
    this.isMounted = false;
    this.scale.remove();
  }

  // При клике на элементы шкалы будет двигаться ползунок
  addInteractivity() {
    const { clickableScaleElementClass } = this.viewModel.getData('classes');
    this.steps.forEach((step) => {
      const { element } = step;
      addClass(element, clickableScaleElementClass);
      element.addEventListener('mousedown', this.handleStepElementMouseDown);
    });
  }

  // Убирает слушатель клика у элементов шкалы
  removeInteractivity() {
    const { clickableScaleElementClass } = this.viewModel.getData('classes');
    this.steps.forEach((step) => {
      const { element } = step;
      removeClass(element, clickableScaleElementClass);
      element.removeEventListener('mousedown', this.handleStepElementMouseDown);
    });
  }

  private create(): HTMLElement {
    const { scaleClass, scaleElementClass } = this.viewModel.getData('classes');
    const { widthOrHeight } = this.mainView.getElementProperties();
    const length = this.viewModel.getData('lengthInPx');

    this.scale = document.createElement('div');
    this.scale.style[widthOrHeight] = `${length}px`;
    addClass(this.scale, scaleClass);

    this.steps = this.getStepsValues().map((value) => {
      const element = document.createElement('div');
      addClass(element, scaleElementClass);
      element.style.position = 'absolute';
      element.innerText = String(value);
      this.scale.appendChild(element);
      return {
        element,
        value,
      };
    });

    if (this.viewModel.getData('isScaleClickable')) {
      this.addInteractivity();
    }
    return this.scale;
  }

  // Передвигает либо активный ползунок, либо тот, который ближе к элементу
  private handleStepElementMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const stepElement = event.currentTarget;
    if (!(stepElement instanceof HTMLElement)) return;

    const { stepSize = 0 } = this.viewModel.getData('modelData') || {};
    const { leftOrTop, offsetWidthOrHeight } = this.mainView.getElementProperties();
    const stepLength = this.viewModel.getStepLength();

    const stepElementPosition = parseFloat(stepElement.style[leftOrTop])
      + stepElement[offsetWidthOrHeight] / 2;
    const activeThumb = this.mainView.updateActiveThumb(stepElementPosition);

    const stepValue = (
      parseFloat(stepElement.style[leftOrTop]) + stepElement[offsetWidthOrHeight] / 2
    ) / (stepLength / stepSize);
    const currentValue = (
      parseFloat(activeThumb.style[leftOrTop]) + activeThumb[offsetWidthOrHeight] / 2
    ) / (stepLength / stepSize);

    this.mainView.moveActiveThumb(Math.round((stepValue - currentValue) / stepSize));
  }
}

export default ScaleView;
