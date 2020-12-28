export type ModelOptions = {
  value: [number, number] | number
  range: boolean
  stepSize: number
  max: number
  min: number
}

export type ViewOptions = {
  // Длина слайдера(в любых единицах измерения)
  length: string
  // Наличие подсказки у ползунков
  tooltip: boolean
  // Наличие шкалы значений
  // False - отсутствует
  // True - показывает 5 чисел в шкале значений
  // Number - показывает number чисел в шкале значений
  // Array - показывает array.length значений(любых) по порядку в шкале значений
  stepsInfo: boolean | Array<number | string> | number
  // Элемент с текущим значением
  valueInfo: boolean
  // Вертикальный слайдер
  vertical: boolean
  // Отзывчивость слайдера. Рекомендуется отключать(false), если length задана в
  // статических ед. измерения(например, px)
  responsive: boolean
  // Если true, то при нажатии стрелок и ad активный ползунок будет перемещаться
  useKeyboard: boolean
  // Если true, то шкала значений будет кликабельна и активный
  // ползунок(если range=true, по умолчанию = thumb[1]) будет
  // перемещаться на соответствующее значение
  interactiveStepsInfo: boolean

  // Классы элементов слайдера
  sliderClass?: string | string[]
  sliderVerticalClass?: string | string[]
  barClass?: string | string[]
  progressBarClass?: string | string[]
  thumbClass?: string | string[]
  activeThumbClass?: string | string[]
  tooltipClass?: string | string[]
  stepsInfoClass?: string | string[]
  valueInfoClass?: string | string[]
}

export type PresenterOptions = {
  // Будет выполняться при любом передвижении ползунка
  onChange?: Function
}


export type SliderOptions = ModelOptions & ViewOptions & PresenterOptions
