type Thumb = HTMLElement | [HTMLElement, HTMLElement]

interface IThumbView {
  create(): Thumb | undefined
  remove(): void
  updateClientCoordinates(): void
  update(): void
  get(): Thumb | undefined
  setActiveThumb(thumbNumber?: number): void
  removeActiveThumb(): void
  moveActiveThumb(numberOfSteps?: number): void
}

export { IThumbView, Thumb };
