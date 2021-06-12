import IView from '../../View/interfacesAndTypes';
import View from '../../View/View';
import { defaultModelOptions, defaultViewOptions } from '../../../../../options/defaultOptions';
import { IThumbView } from './interfaceAndTypes';

let mainView: IView;
let thumbView: IThumbView;
beforeEach(() => {
  mainView = new View(defaultViewOptions, document.body);
  mainView.setModelData(defaultModelOptions);
  mainView.changeOptions({ length: '100px' });
  mainView.renderSlider();
  mainView.getViewModel().setLengthInPx(100);
  thumbView = mainView.getViews().thumb;
});

jest.useFakeTimers();

test('get should return HTMLElement', () => {
  expect(thumbView.get()).toBeInstanceOf(HTMLElement);
});

test('update should change position of thumb when isRange is false and value changed', () => {
  const thumb = thumbView.get();
  mainView.setModelData({ value: 2 });
  if (thumb instanceof HTMLElement) {
    expect(thumb.style.left).toBe('20px');
  }
});

test('update should change position of thumb when isRange is true and value changed', () => {
  const thumb = thumbView.get();
  mainView.setModelData({ isRange: true, value: [2, 6] });
  if (Array.isArray(thumb)) {
    expect(thumb[0].style.left).toBe('20px');
    expect(thumb[1].style.left).toBe('60px');
  }
});

test('moveActiveThumb should change position of thumb and call View.onThumbMove', () => {
  const thumb = thumbView.get();
  const mockedOnThumbMove = jest.spyOn(mainView, 'onThumbMove');
  if (thumb instanceof HTMLElement) {
    thumbView.setActiveThumb();
    thumbView.moveActiveThumb(3);
    expect(thumb.style.left).toBe('30px');
    expect(mockedOnThumbMove.mock.calls.length).toBe(1);
  }
});

test('moveActiveThumb should not change position of thumb if active thumb is first and its position equal to second thumb', () => {
  mainView.setModelData({ isRange: true, value: [1, 1] });
  const thumb = thumbView.get();
  if (Array.isArray(thumb)) {
    thumbView.setActiveThumb(0);
    thumbView.moveActiveThumb(3);
    expect(thumb[0].style.left).toBe('10px');
    expect(thumb[1].style.left).toBe('10px');
  }
});

test('moveActiveThumb should not change position of thumb if new value less than min', () => {
  mainView.setModelData({ min: -2 });
  const thumb = thumbView.get();
  if (thumb instanceof HTMLElement) {
    thumbView.setActiveThumb();
    thumbView.moveActiveThumb(-3);
    expect(thumb.style.left).toBe('0px');
  }
});

test('on thumb move should call thumbView.moveActiveThumb', () => {
  mainView.setModelData({ isRange: true, value: [0, 0] });
  const thumb = thumbView.get();
  const mockedMoveActiveThumb = jest.spyOn(thumbView, 'moveActiveThumb');
  if (Array.isArray(thumb)) {
    const mouseDownEvent = new MouseEvent('mousedown');
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 46 + thumb[1].getBoundingClientRect().left,
      bubbles: true,
    });
    const mouseUpEvent = new MouseEvent('mouseup');
    thumbView.setActiveThumb(0);
    thumb[1].dispatchEvent(mouseDownEvent);
    thumb[1].dispatchEvent(mouseMoveEvent);
    thumb[1].dispatchEvent(mouseUpEvent);
    expect(mockedMoveActiveThumb.mock.calls.length).toBe(1);
  }
});

test('on click on document should remove active thumb', () => {
  const thumb = thumbView.get();
  if (thumb instanceof HTMLElement) {
    const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
    const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
    thumb.dispatchEvent(mouseDownEvent);
    thumb.dispatchEvent(mouseUpEvent);

    const mockedSetActiveThumb = jest.spyOn(thumbView, 'setActiveThumb');
    document.body.dispatchEvent(mouseUpEvent);
    expect(mockedSetActiveThumb.mock.calls.length).toBe(1);
    expect(mockedSetActiveThumb.mock.calls[0][0]).toBeNull();
  }
});

test('when useKeyboard is true and pressing arrow keys should change value', () => {
  const mockedMoveActiveThumb = jest.spyOn(thumbView, 'moveActiveThumb');
  const rightArrowKeyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
  const bottomArrowKeyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowBottom' });
  const leftArrowKeyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
  const topArrowKeyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowTop' });

  document.dispatchEvent(rightArrowKeyDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[0][0]).toBe(1);

  document.dispatchEvent(bottomArrowKeyDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[1][0]).toBe(1);

  document.dispatchEvent(leftArrowKeyDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[2][0]).toBe(-1);

  document.dispatchEvent(topArrowKeyDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[3][0]).toBe(-1);
});

test('when useKeyboard is true and pressing w, a, s, d keys should change value', () => {
  const mockedMoveActiveThumb = jest.spyOn(thumbView, 'moveActiveThumb');
  const dKeyDownEvent = new KeyboardEvent('keydown', { key: 'd' });
  const sKeyDownEvent = new KeyboardEvent('keydown', { key: 's' });
  const aKeyDownEvent = new KeyboardEvent('keydown', { key: 'a' });
  const wKeyDownEvent = new KeyboardEvent('keydown', { key: 'w' });

  document.dispatchEvent(dKeyDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[0][0]).toBe(1);

  document.dispatchEvent(sKeyDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[1][0]).toBe(1);

  document.dispatchEvent(aKeyDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[2][0]).toBe(-1);

  document.dispatchEvent(wKeyDownEvent);
  expect(mockedMoveActiveThumb.mock.calls[3][0]).toBe(-1);
});
