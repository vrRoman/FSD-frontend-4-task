type Tooltip = HTMLElement | [HTMLElement, HTMLElement]

interface ITooltipView {
  create(): Tooltip | undefined
  remove(): void
  update(): void
  get(): Tooltip | undefined
}

export { ITooltipView, Tooltip };
