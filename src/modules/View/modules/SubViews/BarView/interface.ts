interface IBarView {
  getBar(): HTMLElement
  getProgressBar(): HTMLElement
  getOffsetLength(): number

  createBar(): HTMLElement
  createProgressBar(): HTMLElement
  updateProgressBar(): void
  updateBar(): void
  mountBar(): void
  mountProgressBar(): void
  addInteractivity(): void
  removeInteractivity(): void
}

export default IBarView;
