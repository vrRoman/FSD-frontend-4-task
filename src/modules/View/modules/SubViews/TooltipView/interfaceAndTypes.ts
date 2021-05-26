type Tooltip = HTMLElement | [HTMLElement, HTMLElement]

interface ITooltipView {
  get(): Tooltip
  create(): Tooltip
  update(): void
  mount(): void
  unmount(): void
}

export { ITooltipView, Tooltip };
