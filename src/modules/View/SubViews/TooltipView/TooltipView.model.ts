import { Thumb } from '../ThumbView';

type Tooltip = HTMLElement | [HTMLElement, HTMLElement]

interface ITooltipView {
  get(): Tooltip
  update(): void
  mount(): void
  unmount(): void
  recreate(newTarget?: Thumb): Tooltip
}

export { ITooltipView, Tooltip };
