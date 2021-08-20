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
    if (modelData === null) {
      return [];
    }

    const scaleValue = this.viewModel.getData('scaleValue');
    const { min, max } = modelData;
    let stepValues: Array<number | string> = [];

    if (Array.isArray(scaleValue)) {
      stepValues = scaleValue;
    } else {
      let stepNumber = min;
      stepValues.push(stepNumber);
      while (stepNumber < max - scaleValue) {
        stepNumber += scaleValue;
        stepValues.push(Number(stepNumber.toFixed(3)));
      }
      stepValues.push(max);
    }
    return stepValues;
  }

  // Пересоздает шкалу, если она уже в DOM, то убирает ее и заново добавляет
  recreate(): HTMLElement {
    this.steps = [];
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
    const modelData = this.viewModel.getData('modelData');
    if (modelData === null) return;

    const { min, max } = modelData;
    const length = this.viewModel.getData('lengthInPx');
    const scaleValue = this.viewModel.getData('scaleValue');
    const {
      widthOrHeight,
      offsetWidthOrHeight,
      leftOrTop,
      opposites,
    } = this.mainView.getElementProperties();

    this.scale.style[widthOrHeight] = `${length}px`;
    this.scale.style[opposites.widthOrHeight] = '';

    for (let i = 0; i < this.steps.length; i += 1) {
      const { element, value } = this.steps[i];
      const oneValueLength = length / (max - min);
      let position: number;
      if (Array.isArray(scaleValue)) {
        position = (length / (this.steps.length - 1)) * i;
      } else {
        position = (Number(value) * oneValueLength)
          - (Number(this.steps[0].value) * oneValueLength);
      }
      element.style[leftOrTop] = `${position - element[offsetWidthOrHeight] / 2}px`;
      element.style[opposites.leftOrTop] = '';
    }
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
    for (let i = 0; i < this.steps.length; i += 1) {
      const { element } = this.steps[i];
      addClass(element, clickableScaleElementClass);
      element.addEventListener('mousedown', this.handleStepElementMouseDown);
    }
  }

  // Убирает слушатель клика у элементов шкалы
  removeInteractivity() {
    const { clickableScaleElementClass } = this.viewModel.getData('classes');
    for (let i = 0; i < this.steps.length; i += 1) {
      const { element } = this.steps[i];
      removeClass(element, clickableScaleElementClass);
      element.removeEventListener('mousedown', this.handleStepElementMouseDown);
    }
  }

  private create(): HTMLElement {
    const scale = document.createElement('div');
    const stepsValues = this.getStepsValues();
    const { scaleClass, scaleElementClass } = this.viewModel.getData('classes');
    const { widthOrHeight } = this.mainView.getElementProperties();
    const length = this.viewModel.getData('lengthInPx');

    addClass(scale, scaleClass);
    scale.style[widthOrHeight] = `${length}px`;

    for (let i = 0; i < stepsValues.length; i += 1) {
      const stepElement = document.createElement('div');
      addClass(stepElement, scaleElementClass);
      stepElement.style.position = 'absolute';
      this.steps.push({
        element: stepElement,
        value: stepsValues[i],
      });
      stepElement.innerText = String(stepsValues[i]);
      scale.appendChild(stepElement);
    }

    this.scale = scale;
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
    if (!(stepElement instanceof HTMLElement)) {
      return;
    }

    const modelProperties = this.viewModel.getData('modelData');
    if (modelProperties === null) return;

    const stepLength = this.viewModel.getStepLength();
    const { leftOrTop, offsetWidthOrHeight } = this.mainView.getElementProperties();
    const { stepSize } = modelProperties;
    let activeThumb = this.viewModel.getData('activeThumb');

    if (!activeThumb) {
      const stepElementPosition = parseFloat(stepElement.style[leftOrTop])
        + stepElement[offsetWidthOrHeight] / 2;
      activeThumb = this.mainView.setActiveThumb(
        this.mainView.getThumbNumberThatCloserToPosition(stepElementPosition),
      );
    }

    const stepValue = (
      parseFloat(stepElement.style[leftOrTop]) + stepElement[offsetWidthOrHeight] / 2
    ) / (stepLength / stepSize);
    const thumbValue = (
      parseFloat(activeThumb.style[leftOrTop]) + activeThumb[offsetWidthOrHeight] / 2
    ) / (stepLength / stepSize);
    this.mainView.moveActiveThumb(Math.round((stepValue - thumbValue) / stepSize));
  }
}

export default ScaleView;
