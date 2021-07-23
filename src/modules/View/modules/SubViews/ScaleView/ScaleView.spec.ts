import View from 'View/modules/View/View';
import IView from 'View/modules/View/interfacesAndTypes';
import { defaultViewOptions, defaultModelOptions } from 'options/defaultOptions';

import IScaleView from './interface';

let mainView: IView;
let scaleView: IScaleView;
beforeEach(() => {
  mainView = new View({
    ...defaultViewOptions,
    hasScale: true,
    length: '200px',
  }, document.body);
  mainView.renderSlider();
  mainView.setModelData({ ...defaultModelOptions });
  mainView.getViewModel().setLengthInPx(200);
  scaleView = mainView.getViews().scale;
});

test('get should return HTMLElement', () => {
  expect(scaleView.get()).toBeInstanceOf(HTMLElement);
});

test('getStepValues should return array of steps values', () => {
  expect(scaleView.getStepsValues()).toEqual([0, 2, 4, 6, 8, 10]);
  mainView.changeOptions({ scaleValue: ['start', 'half', 'end'] });
  expect(scaleView.getStepsValues()).toEqual(['start', 'half', 'end']);
});

test('getStepValues should return steps from min to max', () => {
  mainView.setModelData({ min: -5, max: 12 });
  mainView.changeOptions({ scaleValue: 3 });
  expect(scaleView.getStepsValues()).toEqual([-5, -2, 1, 4, 7, 10, 12]);
});

test('update should change width or height when length changed', () => {
  mainView.changeOptions({ length: '300px' });
  mainView.getViewModel().setLengthInPx(300);
  scaleView.update();
  expect(scaleView.get().style.width).toBe('300px');
  expect(scaleView.get().style.height).toBe('');
});

test('update should position scale elements according to their values', () => {
  mainView.changeOptions({ length: '100px', scaleValue: 3 });
  mainView.getViewModel().setLengthInPx(100);
  // значения шагов будут -5, -2, 1, 4, 7, 10, 12
  mainView.setModelData({ min: -5, max: 12 });
  scaleView.update();

  const firstElement = scaleView.get().children[0];
  const secondElement = scaleView.get().children[1];
  const secondToLastElement = scaleView.get().children[5];
  const lastElement = scaleView.get().children[6];
  if (firstElement instanceof HTMLElement) {
    expect(firstElement.style.left).toBe('0px');
  }
  if (secondElement instanceof HTMLElement) {
    expect(secondElement.style.left).toBe(`${(100 / 17) * 3}px`);
  }
  if (secondToLastElement instanceof HTMLElement) {
    expect(secondToLastElement.style.left).toBe(`${(100 / 17) * (17 - 2)}px`);
  }
  if (lastElement instanceof HTMLElement) {
    expect(lastElement.style.left).toBe('100px');
  }
});

test('update should change width and height, step elements positions when isVertical changed', () => {
  mainView.changeOptions({ isVertical: true });
  mainView.getViewModel().setLengthInPx(200);
  scaleView.update();
  expect(scaleView.get().style.height).toBe('200px');
  expect(scaleView.get().style.width).toBe('');
  const secondElement = scaleView.get().children[1];
  if (secondElement instanceof HTMLElement) {
    expect(secondElement.style.top).toBe('40px');
    expect(secondElement.style.left).toBe('');
  }
});

test('when isScaleClickable is true on scale mousedown it should call mainView.moveActiveThumb with rounded numberOfSteps', () => {
  const mockedMoveActiveThumb = jest.spyOn(mainView, 'moveActiveThumb');
  let mouseDownEvent = new MouseEvent('mousedown');
  scaleView.get().children[2].dispatchEvent(mouseDownEvent);
  expect(mockedMoveActiveThumb.mock.calls.length).toBe(1);
  expect(mockedMoveActiveThumb.mock.calls[0][0]).toBe(4);

  mouseDownEvent = new MouseEvent('mousedown');
  scaleView.get().children[1].dispatchEvent(mouseDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[1][0]).toBe(-2);
});
