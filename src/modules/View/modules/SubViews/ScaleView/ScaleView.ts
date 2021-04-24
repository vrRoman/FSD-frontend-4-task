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

    this._handleStepElemMouseDown = this._handleStepElemMouseDown.bind(this);
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
            if (scaleValue === 1) {
              steps.push(minAndMax[0]);
            } else {
              const maxDiapason = minAndMax[1] - minAndMax[0];
              for (let i = 0; i < scaleValue; i += 1) {
                steps.push(
                  Number(
                    (minAndMax[0] + ((maxDiapason / (scaleValue - 1)) * i)).toFixed(3),
                  ),
                );
              }
            }
          }

          for (let i = 0; i < steps.length; i += 1) {
            const stepElem = document.createElement('div');
            const position = (length / (steps.length - 1)) * i;
            stepElem.innerText = `${steps[i]}`;
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
    const length = this.viewModel.getLengthInPx();
    if (this.scale && length) {
      const stepElems = Array.from(this.scale.children) as HTMLElement[];

      for (let i = 0; i < stepElems.length; i += 1) {
        const position = (length / (stepElems.length - 1)) * i;

        if (this.viewModel.getIsVertical()) {
          stepElems[i].style.top = `${position - stepElems[i].offsetHeight / 2}px`;
        } else {
          stepElems[i].style.left = `${position - stepElems[i].offsetWidth / 2}px`;
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
        stepElems[i].addEventListener('mousedown', this._handleStepElemMouseDown);
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
        stepElems[i].removeEventListener('mousedown', this._handleStepElemMouseDown);
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
  private _handleStepElemMouseDown(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    const stepElem = <HTMLElement>evt.currentTarget;
    const stepLength = this.viewModel.getStepLength();

    if (!this.viewModel.getActiveThumb()) {
      this.mainView.setActiveThumb();
    }

    if (stepLength) {
      const modelProps = this.viewModel.getModelProps();

      if (modelProps && modelProps.stepSize !== undefined) {
        const activeThumb = this.viewModel.getActiveThumb();
        if (activeThumb) {
          let leftOrTop: 'left' | 'top';
          let offsetWidthOrHeigth: 'offsetWidth' | 'offsetHeight';
          if (this.viewModel.getIsVertical()) {
            leftOrTop = 'top';
            offsetWidthOrHeigth = 'offsetHeight';
          } else {
            leftOrTop = 'left';
            offsetWidthOrHeigth = 'offsetWidth';
          }
          const stepValue = (
            parseFloat(stepElem.style[leftOrTop]) + stepElem[offsetWidthOrHeigth] / 2
          ) / (stepLength / modelProps.stepSize);
          const thumbValue = (
            parseFloat(activeThumb.style[leftOrTop]) + activeThumb[offsetWidthOrHeigth] / 2
          ) / (stepLength / modelProps.stepSize);
          this.mainView.moveActiveThumb((stepValue - thumbValue) / modelProps.stepSize);
          this.mainView.removeActiveThumb();
        }
      }
    }
  }
}

export default ScaleView;
