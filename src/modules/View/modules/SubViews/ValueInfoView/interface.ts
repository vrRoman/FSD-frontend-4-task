interface IValueInfoView {
  create(): HTMLElement | undefined
  remove(): void
  update(): void
  get(): HTMLElement | undefined
}

export default IValueInfoView;
