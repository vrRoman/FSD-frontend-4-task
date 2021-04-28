import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import IScaleView from './interface';
import { ModelProperties } from '../../../../Model/interfacesAndTypes';
import IView from '../../View/interfaces';
import areNumbersDefined from '../../../../../utilities/areNumbersDefined';
import isModelPropertiesValuesDefined from '../../../../../utilities/isModelPropertiesValuesDefined';

class ScaleView implements IScaleView {
  private readonly viewModel: IViewModelGetMethods

  private readonly mainView: IView

  private readonly target: HTMLElement

  private scale: HTMLElement | undefined

  constructor(target: HTMLElement, viewModel: IViewModelGetMethods, mainView: IView) {
    this.target = target;
    this.viewModel = viewModel;
    this.mainView = mainView;
    this.scale = undefined;

    this.handleStepElementMouseDown = this.handleStepElementMouseDown.bind(this);
  }

  // Создает шкалу значений в зависимости от scaleValue.
  create(): HTMLElement | undefined {
    const modelProperties: ModelProperties | undefined = this.viewModel.getModelProperties();

    if (modelProperties) {
      const minAndMax = [modelProperties.min, modelProperties.max];

      if (areNumbersDefined(minAndMax)) {
        const length = this.viewModel.getLengthInPx();
        if (length) {
          const scale = document.createElement('div');
          this.target.appendChild(scale);

          const { scaleClass } = this.viewModel.getClasses();
          if (Array.isArray(scaleClass)) {
            scale.classList.add(...scaleClass);
          } else {
            scale.classList.add(scaleClass);
          }

          if (this.viewModel.getIsVertical()) {
            scale.style.height = `${length}px`;
          } else {
            scale.style.width = `${length}px`;
          }

          let steps: Array<number | string> = [];
          const scaleValue = this.viewModel.getScaleValue();

          if (Array.isArray(scaleValue)) {
            steps = scaleValue;
          } else {
            let stepNumber = minAndMax[0];
            steps.push(stepNumber);
            while (stepNumber < minAndMax[1] - scaleValue) {
              stepNumber += scaleValue;
              steps.push(Number(stepNumber.toFixed(3)));
            }
            steps.push(minAndMax[1]);
          }

          for (let i = 0; i < steps.length; i += 1) {
            const stepElement = document.createElement('div');
            const oneValueLength = length / (minAndMax[1] - minAndMax[0]);
            let position: number;
            if (Array.isArray(scaleValue)) {
              position = (length / (steps.length - 1)) * i;
            } else {
              position = (Number(steps[i]) * oneValueLength) - (Number(steps[0]) * oneValueLength);
            }

            const { scaleElementClass } = this.viewModel.getClasses();
            if (Array.isArray(scaleElementClass)) {
              stepElement.classList.add(...scaleElementClass);
            } else {
              stepElement.classList.add(scaleElementClass);
            }

            stepElement.innerText = String(steps[i]);
            stepElement.style.position = 'absolute';
            scale.appendChild(stepElement);
            if (this.viewModel.getIsVertical()) {
              stepElement.style.top = `${position - stepElement.offsetHeight / 2}px`;
            } else {
              stepElement.style.left = `${position - stepElement.offsetWidth / 2}px`;
            }
          }

          this.scale = scale;

          if (this.viewModel.getIsScaleClickable()) {
            this.addInteractivity();
          }

          return scale;
        }
      }
    }
    return undefined;
  }

  // Удаляет scale
  remove() {
    if (this.scale) {
      this.scale.remove();
      this.scale = undefined;
    }
  }

  // Обновляет положение элементов шкалы значений
  update() {
    const modelProperties = this.viewModel.getModelProperties();

    if (modelProperties === undefined) {
      throw new Error('modelProperties is undefined');
    }

    if (this.scale) {
      const stepElements = Array.from(this.scale.children) as HTMLElement[];
      const minMaxLength = [
        modelProperties.min, modelProperties.max, this.viewModel.getLengthInPx(),
      ];

      if (areNumbersDefined(minMaxLength)) {
        const [min, max, length] = minMaxLength;
        const scaleValue = this.viewModel.getScaleValue();
        for (let i = 0; i < stepElements.length; i += 1) {
          const oneValueLength = length / (max - min);
          let position: number;
          if (Array.isArray(scaleValue)) {
            position = (length / (stepElements.length - 1)) * i;
          } else {
            position = (Number(stepElements[i].innerText) * oneValueLength)
              - (Number(stepElements[0].innerText) * oneValueLength);
          }
          if (this.viewModel.getIsVertical()) {
            stepElements[i].style.top = `${position - stepElements[i].offsetHeight / 2}px`;
          } else {
            stepElements[i].style.left = `${position - stepElements[i].offsetWidth / 2}px`;
          }
        }
      }
    }
  }

  // Возвращает элемент scale
  get(): HTMLElement | undefined {
    return this.scale;
  }

  // Добавляет stepElementOnDown при клике на элементы шкалы значений и вызывает у view
  // changeIsScaleClickable(true)
  addInteractivity() {
    if (this.scale) {
      const stepElements = Array.from(this.scale.children) as HTMLElement[];
      const { clickableScaleElementClass } = this.viewModel.getClasses();
      for (let i = 0; i < stepElements.length; i += 1) {
        if (Array.isArray(clickableScaleElementClass)) {
          stepElements[i].classList.add(...clickableScaleElementClass);
        } else {
          stepElements[i].classList.add(clickableScaleElementClass);
        }
        stepElements[i].addEventListener('mousedown', this.handleStepElementMouseDown);
      }
      this.mainView.changeOptions({
        isScaleClickable: true,
      });
    }
  }

  // Убирает слушатель клика у элементов шкалы значений и обращается к viewModel
  removeInteractivity() {
    if (this.scale) {
      const stepElements = Array.from(this.scale.children) as HTMLElement[];
      const { clickableScaleElementClass } = this.viewModel.getClasses();
      for (let i = 0; i < stepElements.length; i += 1) {
        if (Array.isArray(clickableScaleElementClass)) {
          stepElements[i].classList.remove(...clickableScaleElementClass);
        } else {
          stepElements[i].classList.remove(clickableScaleElementClass);
        }
        stepElements[i].removeEventListener('mousedown', this.handleStepElementMouseDown);
      }
      this.mainView.changeOptions({
        isScaleClickable: false,
      });
    }
  }

  // Меняет плоскость шкалы значений
  updateVertical() {
    if (this.viewModel.getHasScale()) {
      this.remove();
      this.create();
    }
  }

  // При клике на элементы шкалы значений вызывает moveActiveThumb и
  // убирает активный ползунок
  private handleStepElementMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const stepElement = <HTMLElement>event.currentTarget;
    const stepLength = this.viewModel.getStepLength();

    let leftOrTop: 'left' | 'top';
    let offsetWidthOrHeight: 'offsetWidth' | 'offsetHeight';
    if (this.viewModel.getIsVertical()) {
      leftOrTop = 'top';
      offsetWidthOrHeight = 'offsetHeight';
    } else {
      leftOrTop = 'left';
      offsetWidthOrHeight = 'offsetWidth';
    }

    if (!this.viewModel.getActiveThumb()) {
      const stepElementPosition = parseFloat(stepElement.style[leftOrTop])
        + stepElement[offsetWidthOrHeight] / 2;
      this.mainView.setActiveThumb(
        this.mainView.getThumbNumberThatCloserToPosition(stepElementPosition),
      );
    }

    if (stepLength) {
      const modelProperties = this.viewModel.getModelProperties();

      if (isModelPropertiesValuesDefined(modelProperties)) {
        const activeThumb = this.viewModel.getActiveThumb();
        if (activeThumb) {
          const stepValue = (
            parseFloat(stepElement.style[leftOrTop]) + stepElement[offsetWidthOrHeight] / 2
          ) / (stepLength / modelProperties.stepSize);
          const thumbValue = (
            parseFloat(activeThumb.style[leftOrTop]) + activeThumb[offsetWidthOrHeight] / 2
          ) / (stepLength / modelProperties.stepSize);
          this.mainView.moveActiveThumb((stepValue - thumbValue) / modelProperties.stepSize);
        }
      }
    }
  }
}

export default ScaleView;
