import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import IScaleView from './interface';
import { ModelProps } from '../../../../Model/interfacesAndTypes';
import IView from '../../View/interfaces';
import areNumbersDefined from '../../../../../utils/areNumbersDefined';

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

    this.handleStepElemMouseDown = this.handleStepElemMouseDown.bind(this);
  }

  // Создает шкалу значений в зависимости от scaleValue.
  create(): HTMLElement | undefined {
    const modelProps: ModelProps | undefined = this.viewModel.getModelProps();

    if (modelProps) {
      const minAndMax = [modelProps.min, modelProps.max];

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
            const stepElem = document.createElement('div');
            const oneValueLength = length / (minAndMax[1] - minAndMax[0]);
            let position: number;
            if (Array.isArray(scaleValue)) {
              position = (length / (steps.length - 1)) * i;
            } else {
              position = (Number(steps[i]) * oneValueLength) - (Number(steps[0]) * oneValueLength);
            }
            stepElem.innerText = String(steps[i]);
            stepElem.style.position = 'absolute';
            scale.appendChild(stepElem);
            if (this.viewModel.getIsVertical()) {
              stepElem.style.top = `${position - stepElem.offsetHeight / 2}px`;
            } else {
              stepElem.style.left = `${position - stepElem.offsetWidth / 2}px`;
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
    const modelProps = this.viewModel.getModelProps();

    if (modelProps === undefined) {
      throw new Error('modelProps is undefined');
    }

    if (this.scale) {
      const stepElems = Array.from(this.scale.children) as HTMLElement[];
      const minMaxLength = [modelProps.min, modelProps.max, this.viewModel.getLengthInPx()];

      if (areNumbersDefined(minMaxLength)) {
        const [min, max, length] = minMaxLength;
        const scaleValue = this.viewModel.getScaleValue();
        for (let i = 0; i < stepElems.length; i += 1) {
          const oneValueLength = length / (max - min);
          let position: number;
          if (Array.isArray(scaleValue)) {
            position = (length / (stepElems.length - 1)) * i;
          } else {
            position = (Number(stepElems[i].innerText) * oneValueLength)
              - (Number(stepElems[0].innerText) * oneValueLength);
          }
          if (this.viewModel.getIsVertical()) {
            stepElems[i].style.top = `${position - stepElems[i].offsetHeight / 2}px`;
          } else {
            stepElems[i].style.left = `${position - stepElems[i].offsetWidth / 2}px`;
          }
        }
      }
    }
  }

  // Возвращает элемент scale
  get(): HTMLElement | undefined {
    return this.scale;
  }

  // Добавляет stepElemOnDown при клике на элементы шкалы значений и вызывает у view
  // changeIsScaleClickable(true)
  addInteractivity() {
    if (this.scale) {
      const stepElems = Array.from(this.scale.children) as HTMLElement[];
      for (let i = 0; i < stepElems.length; i += 1) {
        stepElems[i].addEventListener('mousedown', this.handleStepElemMouseDown);
      }
      this.mainView.changeOptions({
        isScaleClickable: true,
      });
    }
  }

  // Убирает слушатель клика у элементов шкалы значений и обращается к viewModel
  removeInteractivity() {
    if (this.scale) {
      const stepElems = Array.from(this.scale.children) as HTMLElement[];
      for (let i = 0; i < stepElems.length; i += 1) {
        stepElems[i].removeEventListener('mousedown', this.handleStepElemMouseDown);
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
  private handleStepElemMouseDown(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    const stepElem = <HTMLElement>evt.currentTarget;
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
      let thumbNum: 0 | 1 = 1;
      const thumb = this.mainView.getElem('thumb');
      if (Array.isArray(thumb)) {
        const stepElemPos = parseFloat(stepElem.style[leftOrTop])
          + stepElem[offsetWidthOrHeight] / 2;
        const firstThumbPos = parseFloat(thumb[0].style[leftOrTop])
          + thumb[0][offsetWidthOrHeight] / 2;
        const secondThumbPos = parseFloat(thumb[1].style[leftOrTop])
          + thumb[1][offsetWidthOrHeight] / 2;

        if (firstThumbPos === secondThumbPos) {
          const length = this.viewModel.getLengthInPx();
          if (length) {
            if (stepElemPos < length / 2) {
              thumbNum = 0;
            } else {
              thumbNum = 1;
            }
          }
        } else if (secondThumbPos === stepElemPos) {
          thumbNum = 0;
        } if (firstThumbPos === stepElemPos) {
          thumbNum = 1;
        } else if (Math.abs(firstThumbPos - stepElemPos) < Math.abs(secondThumbPos - stepElemPos)) {
          thumbNum = 0;
        }
      }
      this.mainView.setActiveThumb(thumbNum);
    }

    if (stepLength) {
      const modelProps = this.viewModel.getModelProps();

      if (modelProps && modelProps.stepSize !== undefined) {
        const activeThumb = this.viewModel.getActiveThumb();
        if (activeThumb) {
          const stepValue = (
            parseFloat(stepElem.style[leftOrTop]) + stepElem[offsetWidthOrHeight] / 2
          ) / (stepLength / modelProps.stepSize);
          const thumbValue = (
            parseFloat(activeThumb.style[leftOrTop]) + activeThumb[offsetWidthOrHeight] / 2
          ) / (stepLength / modelProps.stepSize);
          this.mainView.moveActiveThumb((stepValue - thumbValue) / modelProps.stepSize);
        }
      }
    }
  }
}

export default ScaleView;
