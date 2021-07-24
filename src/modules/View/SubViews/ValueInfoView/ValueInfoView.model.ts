interface IValueInfoView {
  get(): HTMLElement
  create(): HTMLElement
  update(): void
  mount(): void
  unmount(): void
}

export default IValueInfoView;
