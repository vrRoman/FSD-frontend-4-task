import isModelData from './isModelData';
import { defaultModelOptions } from 'options/defaultOptions';

test('it should return true if all elements defined', () => {
  expect(isModelData(defaultModelOptions)).toBe(true);
});

test('it should return false if at least one element is not defined', () => {
  expect(isModelData({
    isRange: false,
    value: 0,
    min: 0,
    max: 10,
  })).toBe(false);
  expect(isModelData({
    isRange: false,
    value: 0,
    min: 0,
    stepSize: 1,
  })).toBe(false);
  expect(isModelData({
    isRange: false,
    value: 0,
    max: 10,
    stepSize: 1,
  })).toBe(false);
  expect(isModelData({
    isRange: false,
    min: 0,
    max: 10,
    stepSize: 1,
  })).toBe(false);
  expect(isModelData({
    value: 0,
    min: 0,
    max: 10,
    stepSize: 1,
  })).toBe(false);
});

test('it should return false if modelData is null', () => {
  expect(isModelData(null)).toBe(false);
});
