import IValueInfoView from './interface';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import isModelPropertiesValuesDefined from '../../../../../utilities/isModelPropertiesValuesDefined';

class ValueInfoView implements IValueInfoView {
  private readonly target: HTMLElement

  private readonly viewModel: IViewModelGetMethods

  private valueInfo: HTMLElement | undefined

  constructor(target: HTMLElement, viewModel: IViewModelGetMethods) {
    this.target = target;
    this.viewModel = viewModel;
    this.valueInfo = undefined;
  }

  // Создает элемент с текущим значением. По умолчанию, если isRange=false, то
  // указывается просто model.value, иначе записывается в виде value[0] - value[1]
  create(): HTMLElement | undefined {
    const modelProperties = this.viewModel.getModelData();
    if (isModelPropertiesValuesDefined(modelProperties)) {
      const valueInfo = document.createElement('div');
      const { value } = modelProperties;
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
    const modelProperties = this.viewModel.getModelData();
    if (isModelPropertiesValuesDefined(modelProperties)) {
      if (this.valueInfo) {
        if (typeof modelProperties.value === 'number') {
          this.valueInfo.innerText = `${modelProperties.value}`;
        } else {
          this.valueInfo.innerText = `${modelProperties.value[0]} - ${modelProperties.value[1]}`;
        }
      }
    }
  }

  get(): HTMLElement | undefined {
    return this.valueInfo;
  }
}

export default ValueInfoView;
