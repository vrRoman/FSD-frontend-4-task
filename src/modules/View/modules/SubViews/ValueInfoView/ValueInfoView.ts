import { IViewModelGetMethods } from 'View/modules/ViewModel';
import { addClass } from 'utilities/changeClassList';
import type { IView } from 'View/modules/View';

import IValueInfoView from './ValueInfoView.model';

class ValueInfoView implements IValueInfoView {
  private readonly target: HTMLElement

  private readonly viewModel: IViewModelGetMethods

  private valueInfo: HTMLElement

  private isMounted: boolean;

  constructor(target: HTMLElement, mainView: IView) {
    this.target = target;
    this.viewModel = mainView.getViewModel();

    this.valueInfo = this.create();
    this.isMounted = false;
  }

  get(): HTMLElement {
    return this.valueInfo;
  }

  // По умолчанию, если isRange = false, то
  // указывается просто model.value, иначе записывается в виде value[0] - value[1]
  create(): HTMLElement {
    const modelProperties = this.viewModel.getModelData() || { value: 0 };
    const valueInfo = document.createElement('div');
    const { value } = modelProperties;
    const { valueInfoClass } = this.viewModel.getClasses();

    addClass(valueInfo, valueInfoClass);

    if (typeof value === 'number') {
      valueInfo.innerText = `${value}`;
    } else {
      valueInfo.innerText = `${value[0]} - ${value[1]}`;
    }

    this.valueInfo = valueInfo;
    return valueInfo;
  }

  // Обновляет значение в valueInfo
  update() {
    const modelProperties = this.viewModel.getModelData() || { value: 0 };
    const { value } = modelProperties;
    if (typeof value === 'number') {
      this.valueInfo.innerText = `${value}`;
    } else {
      this.valueInfo.innerText = `${value[0]} - ${value[1]}`;
    }
  }

  mount() {
    if (this.isMounted) return;
    this.isMounted = true;
    this.target.appendChild(this.valueInfo);
  }

  unmount() {
    this.isMounted = false;
    this.valueInfo.remove();
  }
}

export default ValueInfoView;
