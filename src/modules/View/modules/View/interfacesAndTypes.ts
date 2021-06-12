import { ViewOptionsPartial } from '../../options';
import IPresenter from '../../../Presenter/interface';
import { IObserver } from '../../../../ObserverAndSubject/interfacesAndTypes';
import { IViewModel } from '../ViewModel/interfacesAndTypes';
import IBarView from '../SubViews/BarView/interface';
import ISliderContainerView from '../SubViews/SliderContainerView/interface';
import IScaleView from '../SubViews/ScaleView/interface';
import { IThumbView } from '../SubViews/ThumbView/interfaceAndTypes';
import { ITooltipView } from '../SubViews/TooltipView/interfaceAndTypes';
import IValueInfoView from '../SubViews/ValueInfoView/interface';
import { IModelData, ModelDataPartial } from '../../../Model/interfacesAndTypes';

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

export default IView;
export {
  ElementNamesNotArrays,
  ElementName,
  Views,
  ElementProperties,
};
