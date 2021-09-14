import View, { IView } from 'View';
import { defaultModelOptions, defaultViewOptions } from 'constants/defaultOptions';
import defaultClasses from 'constants/defaultClasses';

import IBarView from './BarView.model';

let mainView: IView;
let barView: IBarView;
beforeEach(() => {
  mainView = new View({
    ...defaultViewOptions,
    length: '200px',
  }, document.body);
  barView = mainView.getViews().bar;
});

test('getBar should return HTMLElement', () => {
  expect(barView.getBar()).toBeInstanceOf(HTMLElement);
});

test('getProgressBar should return HTMLElement', () => {
  expect(barView.getProgressBar()).toBeInstanceOf(HTMLElement);
});

test('mountBar and mountProgressBar should add bar and progressBar to the DOM', () => {
  // View.renderSlider вызывает BarView.mount
  mainView.renderSlider();
  expect(mainView.getElement('slider').querySelector(`.${defaultClasses.barClass}`)).not.toBeNull();
  expect(barView.getBar().querySelector(`.${defaultClasses.progressBarClass}`)).not.toBeNull();
});

test('getOffsetLength should return bar length', () => {
  expect(barView.getLength()).toBe(0);
});

test('addInteractivity should add special class', () => {
  barView.addInteractivity();
  if (typeof defaultClasses.clickableBarClass === 'string') {
    expect(barView.getBar().classList.contains(defaultClasses.clickableBarClass)).toBe(true);
  }
});

test('removeInteractivity should remove special class', () => {
  barView.addInteractivity();
  barView.removeInteractivity();
  if (typeof defaultClasses.clickableBarClass === 'string') {
    expect(barView.getBar().classList.contains(defaultClasses.clickableBarClass)).toBe(false);
  }
});

test('when isBarClickable is true handleBarClick should call View.moveActiveThumb with correct numberOfSteps', () => {
  mainView.renderSlider();
  mainView.setModelData({ ...defaultModelOptions });
  mainView.changeOptions({ length: '200px' });
  mainView.getViewModel().changeData({ lengthInPx: 200 });
  barView.addInteractivity();

  barView.getBar().getBoundingClientRect = jest.fn(() => ({
    width: 200,
    right: 200,
    left: 0,
    height: 0,
    x: 0,
    y: 0,
    bottom: 0,
    top: 0,
    toJSON: () => {},
  }));
  const mockedMoveActiveThumb = jest.spyOn(mainView, 'moveActiveThumb');
  const mouseDownEvent = new MouseEvent('mousedown', {
    // Прибавить к координате расстояние от края до бара
    clientX: 100 + barView.getBar().getBoundingClientRect().left,
  });
  barView.getBar().dispatchEvent(mouseDownEvent);
  expect(mockedMoveActiveThumb.mock.calls.length).toBe(1);
  expect(mockedMoveActiveThumb.mock.calls[0][0]).toBe(5);
});

test('handleBarClick should round numberOfSteps', () => {
  mainView.renderSlider();
  mainView.setModelData({ ...defaultModelOptions });
  mainView.changeOptions({ length: '200px' });
  mainView.getViewModel().changeData({ lengthInPx: 200 });
  barView.addInteractivity();
  barView.getBar().getBoundingClientRect = jest.fn(() => ({
    width: 200,
    right: 200,
    left: 0,
    height: 0,
    x: 0,
    y: 0,
    bottom: 0,
    top: 0,
    toJSON: () => {},
  }));

  const mockedMoveActiveThumb = jest.spyOn(mainView, 'moveActiveThumb');
  let mouseDownEvent = new MouseEvent('mousedown', {
    clientX: 95 + barView.getBar().getBoundingClientRect().left,
  });
  barView.getBar().dispatchEvent(mouseDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[0][0]).toBe(5);

  mouseDownEvent = new MouseEvent('mousedown', {
    clientX: 85 + barView.getBar().getBoundingClientRect().left,
  });
  barView.getBar().dispatchEvent(mouseDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[1][0]).toBe(-1);
});
