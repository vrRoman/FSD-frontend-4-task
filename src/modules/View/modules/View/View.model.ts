import { IModelData, ModelDataPartial } from 'Model';
import { ViewOptionsPartial } from 'View/options';
import { IPresenter } from 'Presenter';
import { IObserver } from 'ObserverAndSubject';

import { IViewModel } from '../ViewModel';
import IBarView from '../SubViews/BarView/BarView.model';
import ISliderContainerView from '../SubViews/SliderContainerView/SliderContainerView.model';
import IScaleView from '../SubViews/ScaleView/ScaleView.model';
import { IThumbView } from '../SubViews/ThumbView';
import { ITooltipView } from '../SubViews/TooltipView';
import IValueInfoView from '../SubViews/ValueInfoView/ValueInfoView.model';

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

  setPresenter(presenter: IPresenter): IPresenter
  setModelData(newModelData: ModelDataPartial): IModelData | null
  setActiveThumb(thumbNumber?: 0 | 1 | null): HTMLElement
  setClientCoordinates(coordinates: [number, number]): [number, number]
  moveActiveThumb(numberOfSteps?: number): void
  onThumbMove(numberOfSteps: number, thumbNumber: 0 | 1): void
}

export {
  IView,
  ElementNamesNotArrays,
  ElementName,
  Views,
  ElementProperties,
};
