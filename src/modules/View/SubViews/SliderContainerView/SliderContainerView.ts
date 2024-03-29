import type { IView } from 'View';
import type { IViewModelGetMethods } from 'View/ViewModel';
import { addClass, removeClass } from 'utilities/changeClassList';

import type ISliderContainerView from './SliderContainerView.model';

class SliderContainerView implements ISliderContainerView {
  private readonly target: HTMLElement;

  private readonly viewModel: IViewModelGetMethods;

  private slider: HTMLElement;

  constructor(target: HTMLElement, mainView: IView) {
    this.target = target;
    this.viewModel = mainView.getViewModel();
    this.slider = this.create();
  }

  get(): HTMLElement {
    return this.slider;
  }

  // Обновляет классы контейнера
  update() {
    const { sliderVerticalClass } = this.viewModel.getData('classes');
    const { sliderRangeClass } = this.viewModel.getData('classes');
    if (this.viewModel.getData('isVertical')) {
      addClass(this.slider, sliderVerticalClass);
    } else {
      removeClass(this.slider, sliderVerticalClass);
    }
    if (this.viewModel.getData('modelData')?.isRange) {
      addClass(this.slider, sliderRangeClass);
    } else {
      removeClass(this.slider, sliderRangeClass);
    }
  }

  mount() {
    this.target.appendChild(this.slider);
  }

  private create(): HTMLElement {
    const slider = document.createElement('div');
    const { sliderClass } = this.viewModel.getData('classes');
    addClass(slider, sliderClass);
    this.slider = slider;
    this.update();
    return this.slider;
  }
}

export default SliderContainerView;
