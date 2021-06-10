type Thumb = HTMLElement | [HTMLElement, HTMLElement]

interface IThumbView {
  get(): Thumb
  recreate(): Thumb
  update(): void
  mount(): void
  unmount(): void
  setActiveThumb(thumbNumber?: 0 | 1 | null): void
  moveActiveThumb(numberOfSteps?: number): void
}

export { IThumbView, Thumb };
