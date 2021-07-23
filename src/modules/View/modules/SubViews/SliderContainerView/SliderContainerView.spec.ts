import View from 'View/modules/View/View';
import IView from 'View/modules/View/interfacesAndTypes';
import { defaultViewOptions } from 'options/defaultOptions';
import { defaultClasses } from 'View/options';

import IScaleView from './interface';

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
