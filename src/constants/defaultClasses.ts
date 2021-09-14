import { ViewClasses } from 'View/ViewModel';

const defaultClasses: ViewClasses = {
  sliderClass: 'slider',
  sliderVerticalClass: 'slider_vertical',
  sliderRangeClass: 'slider_range',
  barClass: 'slider__bar',
  clickableBarClass: 'slider__bar_clickable',
  progressBarClass: 'slider__progress-bar',
  thumbClass: 'slider__thumb',
  activeThumbClass: 'slider__thumb_active',
  tooltipClass: 'slider__tooltip',
  tooltipValueClass: 'slider__tooltip-value',
  scaleClass: 'slider__scale',
  scaleElementClass: 'slider__scale-element',
  clickableScaleElementClass: 'slider__scale-element_clickable',
  valueInfoClass: 'slider__value-info',
} as const;

export default defaultClasses;
