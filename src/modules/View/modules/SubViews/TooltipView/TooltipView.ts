import { ITooltipView, Tooltip } from './interfaceAndTypes';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import { Thumb } from '../ThumbView/interfaceAndTypes';
import isModelPropertiesValuesDefined from '../../../../../utilities/isModelPropertiesValuesDefined';

class TooltipView implements ITooltipView {
  private readonly target: Thumb

  private readonly viewModel: IViewModelGetMethods

  private tooltip: Tooltip | undefined

  constructor(target: Thumb, viewModel: IViewModelGetMethods) {
    this.target = target;
    this.viewModel = viewModel;
    this.tooltip = undefined;
  }

  // Создает и возвращает подсказки
  create(): Tooltip | undefined {
    const modelProperties = this.viewModel.getModelProperties();

    if (isModelPropertiesValuesDefined(modelProperties)) {
      const { value } = modelProperties;
      const { tooltipClass, tooltipValueClass } = this.viewModel.getClasses();

      if (Array.isArray(this.target)) {
        const tooltipElements: Array<HTMLElement> = [];

        for (let i = 0; i < this.target.length; i += 1) {
          const tooltip = document.createElement('div');
          if (Array.isArray(tooltipClass)) {
            tooltip.classList.add(...tooltipClass);
          } else {
            tooltip.classList.add(tooltipClass);
          }

          if (Array.isArray(value)) {
            tooltip.innerHTML = `<div class="${tooltipValueClass}">${Number((value[i]).toFixed(3))}</div>`;
          }

          this.target[i].appendChild(tooltip);

          tooltipElements.push(tooltip);
        }

        this.tooltip = [tooltipElements[0], tooltipElements[1]];
      } else {
        const tooltip = document.createElement('div');
        if (Array.isArray(tooltipClass)) {
          tooltip.classList.add(...tooltipClass);
        } else {
          tooltip.classList.add(tooltipClass);
        }

        if (!Array.isArray(value)) {
          tooltip.innerHTML = `<div class="${tooltipValueClass}">${Number((value).toFixed(3))}</div>`;
        }

        this.target.appendChild(tooltip);

        this.tooltip = tooltip;
      }
      return this.tooltip;
    }
    return undefined;
  }

  // Удаляет подсказки
  remove(): void {
    if (Array.isArray(this.tooltip)) {
      for (let i = 0; i <= 1; i += 1) {
        this.tooltip[i].remove();
      }
    } else if (this.tooltip) {
      this.tooltip.remove();
    }

    this.tooltip = undefined;
  }

  // Обновляет значение в подсказках
  update() {
    const modelProperties = this.viewModel.getModelProperties();

    if (isModelPropertiesValuesDefined(modelProperties)) {
      const { value } = modelProperties;
      if (this.tooltip) {
        const { tooltipValueClass } = this.viewModel.getClasses();

        if (Array.isArray(this.tooltip)) {
          if (Array.isArray(value)) {
            for (let i = 0; i <= 1; i += 1) {
              this.tooltip[i].innerHTML = `<div class="${tooltipValueClass}">${Number((value[i]).toFixed(3))}</div>`;
            }
          }
        } else if (!Array.isArray(value)) {
          this.tooltip.innerHTML = `<div class="${tooltipValueClass}">${Number((value).toFixed(3))}</div>`;
        }
      }
    }
  }

  // Возвращает tooltip
  get(): Tooltip | undefined {
    return this.tooltip;
  }
}

export default TooltipView;
