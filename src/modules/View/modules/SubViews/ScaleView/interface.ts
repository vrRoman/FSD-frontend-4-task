interface IScaleView {
  create(): HTMLElement | undefined
  remove(): void
  update(): void
  get(): HTMLElement | undefined
  addInteractivity(): void
  removeInteractivity(): void
  updateVertical(): void
}

export default IScaleView;
