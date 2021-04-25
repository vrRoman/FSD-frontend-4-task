type Thumb = HTMLElement | [HTMLElement, HTMLElement]

interface IThumbView {
  create(): Thumb | undefined
  remove(): void
  updateClientCoords(): void
  update(): void
  get(): Thumb | undefined
  setActiveThumb(numOfThumb?: number): void
  removeActiveThumb(): void
  moveActiveThumb(numOfSteps?: number): void
}

export { IThumbView, Thumb };
