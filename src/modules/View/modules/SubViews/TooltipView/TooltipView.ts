import { ITooltipView, Tooltip } from './interfaceAndTypes';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import { Thumb } from '../ThumbView/interfaceAndTypes';
import { addClass } from '../../../../../utilities/changeClassList';
import IView from '../../View/interfacesAndTypes';

class TooltipView implements ITooltipView {
  private readonly viewModel: IViewModelGetMethods

  private target: Thumb

  private tooltip: Tooltip

  private isMounted: boolean

  constructor(target: Thumb, mainView: IView) {
    this.target = target;
    this.viewModel = mainView.getViewModel();

    this.tooltip = this.create();
    this.isMounted = false;
  }

  get(): Tooltip {
    return this.tooltip;
  }

  // Обновляет значение в подсказках
  update() {
    const modelData = this.viewModel.getModelData() || { value: 0 };
    const { value } = modelData;
    const { tooltipValueClass } = this.viewModel.getClasses();

    if (Array.isArray(this.tooltip)) {
      if (Array.isArray(value)) {
        for (let i = 0; i <= 1; i += 1) {
          this.tooltip[i].innerHTML = `<div class="${tooltipValueClass}">${Number((value[i]).toFixed(3))}</div>`;
        }
      } else {
        throw new Error('this.tooltip is array, but modelData.value is number');
      }
    } else if (!Array.isArray(value)) {
      this.tooltip.innerHTML = `<div class="${tooltipValueClass}">${Number((value).toFixed(3))}</div>`;
    } else {
      throw new Error('this.tooltip is number, but modelData.value is array');
    }
  }

  mount() {
    if (this.isMounted) return;
    this.isMounted = true;
    if (Array.isArray(this.target)) {
      this.target.forEach((target, index) => {
        if (Array.isArray(this.tooltip)) {
          target.appendChild(this.tooltip[index]);
        } else {
          throw new Error('this.target is array, but this.tooltip is not array');
        }
      });
    } else if (!Array.isArray(this.tooltip)) {
      this.target.appendChild(this.tooltip);
    } else {
      throw new Error('this.target is not array, but this.tooltip is array');
    }
  }

  unmount() {
    this.isMounted = false;
    if (Array.isArray(this.tooltip)) {
      this.tooltip.forEach((element) => {
        element.remove();
      });
    } else {
      this.tooltip.remove();
    }
  }

  recreate(newTarget?: Thumb): Tooltip {
    if (newTarget) {
      this.target = newTarget;
    }

    if (this.isMounted) {
      this.unmount();
      this.tooltip = this.create();
      this.mount();
    } else {
      this.tooltip = this.create();
    }

    return this.tooltip;
  }

  private create(): Tooltip {
    const modelProperties = this.viewModel.getModelData() || { value: 0 };
    const { value } = modelProperties;
    const { tooltipClass, tooltipValueClass } = this.viewModel.getClasses();

    if (Array.isArray(this.target)) {
      const tooltipElements: Array<HTMLElement> = [];

      for (let i = 0; i < this.target.length; i += 1) {
        const tooltip = document.createElement('div');
        addClass(tooltip, tooltipClass);

        if (Array.isArray(value)) {
          tooltip.innerHTML = `<div class="${tooltipValueClass}">${Number((value[i]).toFixed(3))}</div>`;
        }

        tooltipElements.push(tooltip);
      }

      this.tooltip = [tooltipElements[0], tooltipElements[1]];
    } else {
      const tooltip = document.createElement('div');
      addClass(tooltip, tooltipClass);

      if (!Array.isArray(value)) {
        tooltip.innerHTML = `<div class="${tooltipValueClass}">${Number((value).toFixed(3))}</div>`;
      }

      this.tooltip = tooltip;
    }
    return this.tooltip;
  }
}

export default TooltipView;
