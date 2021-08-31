import { IModelData, ModelDataPartial } from 'Model';
import type { IPresenter } from 'Presenter';
import { IObserver } from 'ObserverAndSubject';

import { IViewModel, ViewClasses } from './ViewModel';
import { IBarView } from './SubViews/BarView';
import { ISliderContainerView } from './SubViews/SliderContainerView';
import { IScaleView } from './SubViews/ScaleView';
import { IThumbView } from './SubViews/ThumbView';
import { ITooltipView } from './SubViews/TooltipView';
import { IValueInfoView } from './SubViews/ValueInfoView';

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
} & Partial<ViewClasses>;

type ViewOptionsPartial = Partial<ViewOptions>;

type ElementNamesNotArrays = 'parent' | 'slider' | 'bar' | 'progressBar' | 'scale' | 'valueInfo'
type ElementName = ElementNamesNotArrays | 'thumb' | 'tooltip'

type Views = {
  bar: IBarView
  sliderContainer: ISliderContainerView
  scale: IScaleView
  thumb: IThumbView
  tooltip: ITooltipView
  valueInfo: IValueInfoView
}

type ElementProperties<HasOpposites extends boolean = true> = {
  leftOrTop: 'left' | 'top',
  rightOrBottom: 'right' | 'bottom'
  widthOrHeight: 'width' | 'height',
  offsetWidthOrHeight: 'offsetWidth' | 'offsetHeight',
  clientXOrY: 'clientX' | 'clientY',
  opposites: HasOpposites extends true ? ElementProperties<false> : null,
}

interface IView extends IObserver {
  renderSlider(): void
  changeOptions(newOptions: ViewOptionsPartial): void

  getElementProperties(): ElementProperties
  getThumbNumberThatCloserToPosition(position: number): 0 | 1
  getViewModel(): IViewModel
  getElement(elementName: ElementNamesNotArrays): HTMLElement
  getElement(elementName: 'thumb' | 'tooltip'): HTMLElement | [HTMLElement, HTMLElement]
  getViews(): Views

  updateActiveThumb(clickPosition?: number): HTMLElement
  updateResponsive(): void
  setPresenter(presenter: IPresenter): IPresenter
  setModelData(newModelData: ModelDataPartial): IModelData | null
  setActiveThumb(thumbNumber?: 0 | 1 | null): HTMLElement | null
  setClientCoordinates(coordinates: [number, number]): [number, number]
  moveActiveThumb(numberOfSteps?: number): void
  onThumbMove(numberOfSteps: number, thumbNumber: 0 | 1): void
}

export type {
  IView,
  ElementNamesNotArrays,
  ElementName,
  Views,
  ElementProperties,
  ViewOptions,
  ViewOptionsPartial,
};
