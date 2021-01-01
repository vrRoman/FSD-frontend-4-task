import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import IStepsInfoView from './interface';
import { ModelProps } from '../../../../Model/interfacesAndTypes';
import IView from '../../View/interfaces';


class StepsInfoView implements IStepsInfoView {
  private readonly viewModel: IViewModelGetMethods
  private readonly mainView: IView
  private readonly target: HTMLElement
  private stepsInfo: HTMLElement | undefined

  constructor(target: HTMLElement, viewModel: IViewModelGetMethods, mainView: IView) {
    this.target = target;
    this.viewModel = viewModel;
    this.mainView = mainView;
    this.stepsInfo = undefined;

    this.handleStepElemMouseDown = this.handleStepElemMouseDown.bind(this);
  }

  // Создает шкалу значений в зависимости от текущих настроек stepsInfo.
  // Если stepsInfoSettings заданы как false, то вызывает у view метод changeStepsInfoSettings
  create(): HTMLElement | undefined {
    const modelProps: ModelProps | undefined = this.viewModel.getModelProps();

    if (modelProps) {
      if (modelProps.min !== undefined && modelProps.max !== undefined) {
        const length = this.viewModel.getLengthInPx();
        if (length) {
          let stepsInfoSettings = this.viewModel.getStepsInfoSettings();
          const stepsInfo = document.createElement('div');

          this.target.appendChild(stepsInfo);

          if (!stepsInfoSettings) {
            this.mainView.changeOptions({
              stepsInfo: true,
            });
            stepsInfoSettings = true;
          }

          const { stepsInfoClass } = this.viewModel.getClasses();
          if (Array.isArray(stepsInfoClass)) {
            stepsInfo.classList.add(...stepsInfoClass);
          } else {
            stepsInfo.classList.add(stepsInfoClass);
          }

          if (this.viewModel.getVertical()) {
            stepsInfo.style.height = `${length}px`;
          } else {
            stepsInfo.style.width = `${length}px`;
          }

          let numOfSteps: number = 5;
          let steps: Array<number | string> = [];

          if (typeof stepsInfoSettings === 'number' || stepsInfoSettings === true) {
            if (typeof stepsInfoSettings === 'number') {
              numOfSteps = stepsInfoSettings;
            }
            const maxDiapason = modelProps.max - modelProps.min;
            for (let i = 0; i < numOfSteps; i += 1) {
              steps.push(
                modelProps.min
                + +((maxDiapason / (numOfSteps - 1)) * i).toFixed(3),
              );
            }
          } else if (Array.isArray(stepsInfoSettings)) {
            numOfSteps = stepsInfoSettings.length;
            steps = stepsInfoSettings;
          }

          for (let i = 0; i < numOfSteps; i += 1) {
            const stepElem = document.createElement('div');
            const position = (length / (numOfSteps - 1)) * i;
            stepElem.innerText = `${steps[i]}`;
            stepElem.style.position = 'absolute';
            stepsInfo.appendChild(stepElem);
            if (this.viewModel.getVertical()) {
              stepElem.style.top = `${position - stepElem.offsetHeight / 2}px`;
            } else {
              stepElem.style.left = `${position - stepElem.offsetWidth / 2}px`;
            }
          }

          this.stepsInfo = stepsInfo;

          if (this.viewModel.getStepsInfoInteractivity()) {
            this.addInteractivity();
          }

          return stepsInfo;
        }
      }
    }
    return undefined;
  }

  // Удаляет stepsInfo
  remove() {
    if (this.stepsInfo) {
      this.stepsInfo.remove();
      this.stepsInfo = undefined;
    }
  }

  // Обновляет положение элементов шкалы значений
  update() {
    const length = this.viewModel.getLengthInPx();
    if (this.stepsInfo && length) {
      const stepElems = Array.from(this.stepsInfo.children) as HTMLElement[];

      for (let i = 0; i < stepElems.length; i += 1) {
        const position = (length / (stepElems.length - 1)) * i;

        if (this.viewModel.getVertical()) {
          stepElems[i].style.top = `${position - stepElems[i].offsetHeight / 2}px`;
        } else {
          stepElems[i].style.left = `${position - stepElems[i].offsetWidth / 2}px`;
        }
      }
    }
  }

  // Возвращает элемент stepsInfo
  get(): HTMLElement | undefined {
    return this.stepsInfo;
  }

  // Добавляет stepElemOnDown при клике на элементы шкалы значений и вызывает у view
  // changeStepsInfoInteractivity(true)
  addInteractivity() {
    if (this.stepsInfo) {
      const stepElems = Array.from(this.stepsInfo.children) as HTMLElement[];
      for (let i = 0; i < stepElems.length; i += 1) {
        stepElems[i].addEventListener('mousedown', this.handleStepElemMouseDown);
      }
      this.mainView.changeOptions({
        stepsInfoInteractivity: true,
      });
    }
  }
  // Убирает слушатель клика у элементов шкалы значений и обращается к viewModel
  removeInteractivity() {
    if (this.stepsInfo) {
      const stepElems = Array.from(this.stepsInfo.children) as HTMLElement[];
      for (let i = 0; i < stepElems.length; i += 1) {
        stepElems[i].removeEventListener('mousedown', this.handleStepElemMouseDown);
      }
      this.mainView.changeOptions({
        stepsInfoInteractivity: false,
      });
    }
  }

  // При клике на элементы шкалы значений вызывает moveActiveThumb и
  // убирает активный ползунок
  private handleStepElemMouseDown(evt: MouseEvent): void {
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
          if (this.viewModel.getVertical()) {
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

  // Меняет плоскость шкалы значений
  updateVertical() {
    if (this.viewModel.getStepsInfoSettings()) {
      this.remove();
      this.create();
    }
  }
}

export default StepsInfoView;
