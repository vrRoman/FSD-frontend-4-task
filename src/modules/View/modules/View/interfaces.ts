import { ViewOptionsPartial } from '../../options';
import IPresenter from '../../../Presenter/interface';
import { IObserver, SubjectAction } from '../../../../ObserverAndSubject/interfacesAndTypes';
import { IViewModel } from '../ViewModel/interfacesAndTypes';
import IBarView from '../SubViews/BarView/interface';
import ISliderContainerView from '../SubViews/SliderContainerView/interface';
import IScaleView from '../SubViews/ScaleView/interface';
import { IThumbView } from '../SubViews/ThumbView/interfaceAndTypes';
import { ITooltipView } from '../SubViews/TooltipView/interfaceAndTypes';
import IValueInfoView from '../SubViews/ValueInfoView/interface';
import { ModelProperties } from '../../../Model/interfacesAndTypes';

type ElementNamesNotArrays = 'parent' | 'slider' | 'bar' | 'progressBar' | 'scale' | 'valueInfo'
type ElementName = ElementNamesNotArrays | 'thumb' | 'tooltip'

type Views = {
  bar?: IBarView
  sliderContainer?: ISliderContainerView
  scale?: IScaleView
  thumb?: IThumbView
  tooltip?: ITooltipView
  valueInfo?: IValueInfoView
}

interface IView extends IObserver {
  drawSlider(): void
  updateModelPropertiesInSlider(action: SubjectAction): void
  setPresenter(presenter: IPresenter): void
  changeOptions(newOptions: ViewOptionsPartial): void

  setModelProperties(modelProperties: ModelProperties): void
  setActiveThumb(thumbNumber?: number): void
  moveActiveThumb(numberOfSteps?: number): void
  removeActiveThumb(): void
  onThumbMove(numberOfSteps: number, thumbNumber: 0 | 1): void
  setClientCoordinates(coordinates: [number, number]): void

  getViewModel(): IViewModel

  getElement(elementName: ElementNamesNotArrays): HTMLElement | undefined
  getElement(elementName: 'thumb' | 'tooltip'): HTMLElement | [HTMLElement, HTMLElement] | undefined
}

interface IWindowListeners {
  addKeyboardListener(): void
  removeKeyboardListener(): void
  setIsResponsive(newIsResponsive: boolean): void
}

export default IView;
export {
  ElementNamesNotArrays, ElementName, Views, IWindowListeners,
};
