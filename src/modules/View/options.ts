type ViewOptions = {
  // Длина слайдера(в любых единицах измерения)
  length: string
  // Наличие подсказки у ползунков
  hasTooltip: boolean
  // Наличие шкалы значений
  hasScale: boolean
  // Number - показывает number чисел в шкале значений
  // Array - показывает array.length значений(любых) по порядку в шкале значений
  scaleValue: Array<number | string> | number
  // Элемент с текущим значением
  hasValueInfo: boolean
  // Вертикальный слайдер
  isVertical: boolean
  // Если true, то при нажатии стрелок и ad активный ползунок будет перемещаться
  useKeyboard: boolean
  // Если true, то шкала значений будет кликабельна и активный
  // ползунок(если isRange=true, по умолчанию = thumb[1]) будет
  // перемещаться на соответствующее значение
  isScaleClickable: boolean
  // Если true, то при клике на бар будет перемещаться ползунок
  isBarClickable: boolean

  // Классы элементов слайдера
  sliderClass?: string | string[]
  sliderVerticalClass?: string | string[]
  barClass?: string | string[]
  clickableBarClass?: string | string[]
  progressBarClass?: string | string[]
  thumbClass?: string | string[]
  activeThumbClass?: string | string[]
  tooltipClass?: string | string[]
  tooltipValueClass?: string | string[]
  scaleClass?: string | string[]
  scaleElementClass?: string | string[]
  clickableScaleElementClass?: string | string[]
  valueInfoClass?: string | string[]
}

type ViewOptionsPartial = Partial<ViewOptions>

export { ViewOptions, ViewOptionsPartial };
