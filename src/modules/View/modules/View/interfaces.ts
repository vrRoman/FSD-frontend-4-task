import { ViewOptionsOptionalParams } from '../../options';
import IPresenter from '../../../Presenter/interface';
import { IObserver, SubjectAction } from '../../../../ObserverAndSubject/interfacesAndTypes';
import { IViewModel } from '../ViewModel/interfacesAndTypes';
import IBarView from '../SubViews/BarView/interface';
import ISliderContainerView from '../SubViews/SliderContainerView/interface';
import IScaleView from '../SubViews/ScaleView/interface';
import { IThumbView } from '../SubViews/ThumbView/interfaceAndTypes';
import { ITooltipView } from '../SubViews/TooltipView/interfaceAndTypes';
import IValueInfoView from '../SubViews/ValueInfoView/interface';
import { ModelProps } from '../../../Model/interfacesAndTypes';

type ElemName = 'parent' | 'slider' | 'bar' | 'progressBar'
  | 'thumb' | 'tooltip' | 'scale' | 'valueInfo'

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
  updateModelPropsInSlider(action: SubjectAction): void
  setPresenter(presenter: IPresenter): void
  changeOptions(newOptions: ViewOptionsOptionalParams): void

  setModelProps(modelProps: ModelProps): void
  setActiveThumb(numOfThumb?: number): void
  moveActiveThumb(steps?: number): void
  removeActiveThumb(): void
  onThumbMove(numOfSteps: number, numOfThumb: 0 | 1): void
  setClientCoords(coords: [number, number]): void

  getViewModel(): IViewModel
  getElem(elemName: ElemName): HTMLElement | [HTMLElement, HTMLElement] | undefined
}

interface IWindowListeners {
  addKeyboardListener(): void
  removeKeyboardListener(): void
  setIsResponsive(newIsResponsive: boolean): void
}

export default IView;
export { ElemName, Views, IWindowListeners };
