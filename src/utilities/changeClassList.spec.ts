import { changeClassList } from './changeClassList';

let element: Element;
beforeEach(() => {
  element = document.createElement('div');
  element.classList.add('element');
});

test('it should add class', () => {
  changeClassList('add', element, 'something');
  expect(element.classList.contains('something')).toBe(true);
});

test('it should remove class', () => {
  changeClassList('remove', element, 'element');
  expect(element.classList.contains('element')).toBe(false);
});

test('it should add array of classes', () => {
  changeClassList('add', element, ['something1', 'something2', 'something3']);
  expect(element.classList.contains('something1')).toBe(true);
  expect(element.classList.contains('something2')).toBe(true);
  expect(element.classList.contains('something3')).toBe(true);
});

test('it should remove array of classes', () => {
  changeClassList('add', element, ['something1', 'something2', 'something3']);
  changeClassList('remove', element, ['something1', 'something2', 'something3']);
  expect(element.classList.contains('something1')).toBe(false);
  expect(element.classList.contains('something2')).toBe(false);
  expect(element.classList.contains('something3')).toBe(false);
});
