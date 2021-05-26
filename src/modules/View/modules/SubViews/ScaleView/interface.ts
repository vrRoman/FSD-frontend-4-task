interface IScaleView {
  get(): HTMLElement
  getStepsValues(): Array<number | string> | null
  create(): HTMLElement
  recreate(): HTMLElement
  update(): void
  mount(): void
  unmount(): void
  addInteractivity(): void
  removeInteractivity(): void
}

export default IScaleView;
