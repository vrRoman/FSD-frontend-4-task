import { ViewClasses } from './modules/ViewModel/interfacesAndTypes';

type ViewOptions = {
  // Длина слайдера(в любых единицах измерения)
  length: string,
  // Наличие подсказки у ползунков
  hasTooltip: boolean,
  // Наличие шкалы значений
  hasScale: boolean,
  // Number - показывает number чисел в шкале значений
  // Array - показывает array.length значений(любых) по порядку в шкале значений
  scaleValue: Array<number | string> | number,
  // Элемент с текущим значением
  hasValueInfo: boolean,
  // Вертикальный слайдер
  isVertical: boolean,
  // Если true, то при нажатии стрелок и ad активный ползунок будет перемещаться
  useKeyboard: boolean,
  // Если true, то шкала значений будет кликабельна и активный
  // ползунок(если isRange=true, по умолчанию = thumb[1]) будет
  // перемещаться на соответствующее значение
  isScaleClickable: boolean,
  // Если true, то при клике на бар будет перемещаться ползунок
  isBarClickable: boolean,
} & Partial<ViewClasses>

type ViewOptionsPartial = Partial<ViewOptions>

const defaultClasses: ViewClasses = {
  sliderClass: 'slider',
  sliderVerticalClass: 'slider_vertical',
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
};

export { ViewOptions, ViewOptionsPartial, defaultClasses };
