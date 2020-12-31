interface ISliderContainerView {
  create(): HTMLElement;
  get(): HTMLElement | undefined;
  updateVertical(): void;
}


export default ISliderContainerView;
