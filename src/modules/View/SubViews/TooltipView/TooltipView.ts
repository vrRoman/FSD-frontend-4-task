import { IViewModelGetMethods } from 'View/ViewModel';
import { addClass } from 'utilities/changeClassList';
import type { IView } from 'View';

import type { ITooltipView, Tooltip } from './TooltipView.model';
import type { Thumb } from '../ThumbView';

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
    const { value = 0 } = this.viewModel.getData('modelData') || {};
    const { tooltipValueClass } = this.viewModel.getData('classes');

    const valueArray = Array.isArray(value) ? value : [value];
    valueArray.forEach((currentValue, index) => {
      const text = `<span class="${tooltipValueClass}">${Number((currentValue).toFixed(3))}</span>`;
      if (Array.isArray(this.tooltip)) {
        this.tooltip[index].innerHTML = text;
      } else {
        this.tooltip.innerHTML = text;
      }
    });
  }

  mount() {
    if (this.isMounted) return;
    this.isMounted = true;
    const targetArray = Array.isArray(this.target) ? this.target : [this.target];
    const tooltipArray = Array.isArray(this.tooltip) ? this.tooltip : [this.tooltip];
    targetArray.forEach((target, index) => {
      target.appendChild(tooltipArray[index]);
    });
  }

  unmount() {
    this.isMounted = false;
    const tooltipArray = Array.isArray(this.tooltip) ? this.tooltip : [this.tooltip];
    tooltipArray.forEach((tooltip) => tooltip.remove());
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
    const { value = 0 } = this.viewModel.getData('modelData') || {};
    const { tooltipClass, tooltipValueClass } = this.viewModel.getData('classes');

    const valueArray = Array.isArray(value) ? value : [value];
    const [firstTooltip, secondTooltip] = valueArray.map((currentValue) => {
      const tooltip = document.createElement('span');
      addClass(tooltip, tooltipClass);
      tooltip.innerHTML = `<span class="${tooltipValueClass}">${Number((currentValue).toFixed(3))}</span>`;
      return tooltip;
    });

    this.tooltip = Array.isArray(value) ? [firstTooltip, secondTooltip] : firstTooltip;
    return this.tooltip;
  }
}

export default TooltipView;
