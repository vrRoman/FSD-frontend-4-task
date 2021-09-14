interface IBarView {
  getBar(): HTMLElement
  getProgressBar(): HTMLElement
  getLength(): number

  updateProgressBar(): void
  updateBar(): void
  mountBar(): void
  mountProgressBar(): void
  addInteractivity(): void
  removeInteractivity(): void
}

export default IBarView;
