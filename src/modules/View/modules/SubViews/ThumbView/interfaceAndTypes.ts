type Thumb = HTMLElement | [HTMLElement, HTMLElement]

interface IThumbView {
  get(): Thumb
  create(): Thumb
  recreate(): Thumb
  update(): void
  mount(): void
  unmount(): void
  updateClientCoordinates(): void
  setActiveThumb(thumbNumber?: number | null): void
  moveActiveThumb(numberOfSteps?: number): void
}

export { IThumbView, Thumb };
