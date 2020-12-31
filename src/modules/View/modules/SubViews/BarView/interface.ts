interface IBarView {
  getBar(): HTMLElement | undefined
  getProgressBar(): HTMLElement | undefined
  getOffsetLength(): number | undefined

  createBar(): HTMLElement
  createProgressBar(): HTMLElement | undefined
  updateProgressBar(): void
  updateBar(): void
}

export default IBarView;
