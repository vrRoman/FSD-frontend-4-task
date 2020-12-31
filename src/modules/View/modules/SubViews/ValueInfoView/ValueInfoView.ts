import IValueInfoView from './interface';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';


class ValueInfoView implements IValueInfoView {
  private readonly target: HTMLElement
  private readonly viewModel: IViewModelGetMethods
  private valueInfo: HTMLElement | undefined

  constructor(target: HTMLElement, viewModel: IViewModelGetMethods) {
    this.target = target;
    this.viewModel = viewModel;
    this.valueInfo = undefined;
  }

  // Создает элемент с текущим значением. По умолчанию, если range=false, то
  // указывается просто model.value, иначе записывается в виде value[0] - value[1]
  create(): HTMLElement | undefined {
    const modelProps = this.viewModel.getModelProps();
    if (modelProps && modelProps.value !== undefined) {
      const valueInfo = document.createElement('div');
      const { value } = modelProps;
      const { valueInfoClass } = this.viewModel.getClasses();

      if (Array.isArray(valueInfoClass)) {
        valueInfo.classList.add(...valueInfoClass);
      } else {
        valueInfo.classList.add(valueInfoClass);
      }

      this.target.appendChild(valueInfo);

      if (typeof value === 'number') {
        valueInfo.innerText = `${value}`;
      } else {
        valueInfo.innerText = `${value[0]} - ${value[1]}`;
      }

      this.valueInfo = valueInfo;
      return valueInfo;
    }
    return undefined;
  }

  // Удаляет элемент со значением
  remove(): void {
    if (this.valueInfo) {
      this.valueInfo.remove();
      this.valueInfo = undefined;
    }
  }

  // Обновляет значение в valueInfo
  update() {
    const modelProps = this.viewModel.getModelProps();
    if (modelProps) {
      const { value } = modelProps;
      if (this.valueInfo && value) {
        if (typeof value === 'number') {
          this.valueInfo.innerText = `${value}`;
        } else {
          this.valueInfo.innerText = `${value[0]} - ${value[1]}`;
        }
      }
    }
  }

  get(): HTMLElement | undefined {
    return this.valueInfo;
  }
}


export default ValueInfoView;
