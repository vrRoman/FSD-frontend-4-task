interface IScaleView {
  get(): HTMLElement
  getStepsValues(): Array<number | string> | null
  recreate(): HTMLElement
  update(): void
  updateElementsPosition(): void
  mount(): void
  unmount(): void
  addInteractivity(): void
  removeInteractivity(): void
}

export default IScaleView;
