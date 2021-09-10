type Thumb = HTMLElement | [HTMLElement, HTMLElement]

interface IThumbView {
  get(): Thumb
  recreate(): Thumb
  update(): void
  mount(): void
  unmount(): void
  setActiveThumb(thumbNumber?: 0 | 1 | null): HTMLElement | null
  moveActiveThumb(numberOfSteps?: number, offset?: number): void
  addKeyboardListener(): void
  removeKeyboardListener(): void
}

export { IThumbView, Thumb };
