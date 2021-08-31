import { IViewModelGetMethods } from 'View/ViewModel';
import { addClass } from 'utilities/changeClassList';
import type { IView } from 'View';

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
  // указывается просто `value`, иначе записывается в виде `firstValue - secondValue`
  create(): HTMLElement {
    const modelProperties = this.viewModel.getData('modelData') || { value: 0 };
    const valueInfo = document.createElement('div');
    const { value } = modelProperties;
    const { valueInfoClass } = this.viewModel.getData('classes');

    addClass(valueInfo, valueInfoClass);

    if (typeof value === 'number') {
      valueInfo.innerText = `${value}`;
    } else {
      const [firstValue, secondValue] = value;
      valueInfo.innerText = `${firstValue} - ${secondValue}`;
    }

    this.valueInfo = valueInfo;
    return valueInfo;
  }

  // Обновляет значение в valueInfo
  update() {
    const modelProperties = this.viewModel.getData('modelData') || { value: 0 };
    const { value } = modelProperties;
    if (typeof value === 'number') {
      this.valueInfo.innerText = `${value}`;
    } else {
      const [firstValue, secondValue] = value;
      this.valueInfo.innerText = `${firstValue} - ${secondValue}`;
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
