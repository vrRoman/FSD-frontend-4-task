import ISliderContainerView from './interface';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';

class SliderContainerView implements ISliderContainerView {
  private readonly target;

  private readonly viewModel;

  private slider: HTMLElement | undefined;

  constructor(target: HTMLElement, viewModel: IViewModelGetMethods) {
    this.target = target;
    this.viewModel = viewModel;
    this.slider = undefined;
  }

  create(): HTMLElement {
    const slider = document.createElement('div');
    const { sliderClass, sliderVerticalClass } = this.viewModel.getClasses();
    if (Array.isArray(sliderClass)) {
      slider.classList.add(...sliderClass);
    } else {
      slider.classList.add(sliderClass);
    }
    if (this.viewModel.getIsVertical()) {
      if (Array.isArray(sliderVerticalClass)) {
        slider.classList.add(...sliderVerticalClass);
      } else {
        slider.classList.add(sliderVerticalClass);
      }
    }

    this.target.appendChild(slider);
    this.slider = slider;
    return slider;
  }

  get(): HTMLElement | undefined {
    return this.slider;
  }

  updateVertical() {
    if (this.slider) {
      const { sliderVerticalClass } = this.viewModel.getClasses();
      if (this.viewModel.getIsVertical()) {
        if (Array.isArray(sliderVerticalClass)) {
          this.slider.classList.add(...sliderVerticalClass);
        } else {
          this.slider.classList.add(sliderVerticalClass);
        }
      } else if (Array.isArray(sliderVerticalClass)) {
        this.slider.classList.remove(...sliderVerticalClass);
      } else {
        this.slider.classList.remove(sliderVerticalClass);
      }
    }
  }
}

export default SliderContainerView;
