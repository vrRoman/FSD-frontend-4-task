import { ITooltipView, Tooltip } from './interfaceAndTypes';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import { Thumb } from '../ThumbView/interfaceAndTypes';

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
    const modelProps = this.viewModel.getModelProps();

    if (modelProps && modelProps.value !== undefined) {
      const { value } = modelProps;
      const { tooltipClass } = this.viewModel.getClasses();

      if (Array.isArray(this.target)) {
        const tooltipElems: Array<HTMLElement> = [];

        for (let i = 0; i < this.target.length; i += 1) {
          const tooltip = document.createElement('div');
          if (Array.isArray(tooltipClass)) {
            tooltip.classList.add(...tooltipClass);
          } else {
            tooltip.classList.add(tooltipClass);
          }

          if (Array.isArray(value)) {
            tooltip.innerHTML = `<div>${+(value[i]).toFixed(3)}</div>`;
          }

          this.target[i].appendChild(tooltip);

          tooltipElems.push(tooltip);
        }

        this.tooltip = [tooltipElems[0], tooltipElems[1]];
      } else {
        const tooltip = document.createElement('div');
        if (Array.isArray(tooltipClass)) {
          tooltip.classList.add(...tooltipClass);
        } else {
          tooltip.classList.add(tooltipClass);
        }

        if (!Array.isArray(value)) {
          tooltip.innerHTML = `<div>${+(value).toFixed(3)}</div>`;
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
    const modelProps = this.viewModel.getModelProps();

    if (modelProps && modelProps.value !== undefined) {
      const { value } = modelProps;
      if (this.tooltip) {
        if (Array.isArray(this.tooltip)) {
          if (Array.isArray(value)) {
            for (let i = 0; i <= 1; i += 1) {
              this.tooltip[i].innerHTML = `<div>${+(value[i]).toFixed(3)}</div>`;
            }
          }
        } else {
          if (!Array.isArray(value)) {
            this.tooltip.innerHTML = `<div>${+(value).toFixed(3)}</div>`;
          }
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
