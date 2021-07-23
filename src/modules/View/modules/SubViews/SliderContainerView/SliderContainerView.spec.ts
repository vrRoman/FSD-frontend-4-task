import View, { IView } from 'View/modules/View';
import { defaultViewOptions } from 'defaults/defaultOptions';
import defaultClasses from 'defaults/defaultClasses';

import IScaleView from './SliderContainerView.model';

let mainView: IView;
let sliderContainerView: IScaleView;
beforeEach(() => {
  mainView = new View(defaultViewOptions, document.body);
  sliderContainerView = mainView.getViews().sliderContainer;
});

test('get should return HTMLElement', () => {
  expect(sliderContainerView.get()).toBeInstanceOf(HTMLElement);
});

test('when isVertical is changed update method should add or remove vertical class', () => {
  mainView.changeOptions({ isVertical: true });
  sliderContainerView.update();
  if (typeof defaultClasses.sliderVerticalClass === 'string') {
    expect(
      sliderContainerView.get().classList.contains(defaultClasses.sliderVerticalClass),
    ).toBe(true);
  }
  mainView.changeOptions({ isVertical: false });
  sliderContainerView.update();
  if (typeof defaultClasses.sliderVerticalClass === 'string') {
    expect(
      sliderContainerView.get().classList.contains(defaultClasses.sliderVerticalClass),
    ).toBe(false);
  }
});
