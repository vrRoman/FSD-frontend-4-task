import IView, {
  ElementName,
  ElementNamesNotArrays,
  ElementProperties,
  IWindowListeners,
  Views,
} from './interfacesAndTypes';
import IPresenter from '../../../Presenter/interface';
import ViewModel from '../ViewModel/ViewModel';
import { IViewModel, ViewClasses } from '../ViewModel/interfacesAndTypes';

import { SliderOptions } from '../../../../options/options';
import { ViewOptions, ViewOptionsPartial, defaultClasses } from '../../options';
import { SubjectAction } from '../../../../ObserverAndSubject/interfacesAndTypes';

import SliderContainerView from '../SubViews/SliderContainerView/SliderContainerView';
import ISliderContainerView from '../SubViews/SliderContainerView/interface';

import BarView from '../SubViews/BarView/BarView';
import IBarView from '../SubViews/BarView/interface';

import ScaleView from '../SubViews/ScaleView/ScaleView';
import IScaleView from '../SubViews/ScaleView/interface';

import ThumbView from '../SubViews/ThumbView/ThumbView';
import { IThumbView } from '../SubViews/ThumbView/interfaceAndTypes';

import TooltipView from '../SubViews/TooltipView/TooltipView';
import { ITooltipView } from '../SubViews/TooltipView/interfaceAndTypes';

import ValueInfoView from '../SubViews/ValueInfoView/ValueInfoView';
import IValueInfoView from '../SubViews/ValueInfoView/interface';
import Observer from '../../../../ObserverAndSubject/Observer';
import WindowListeners from './WindowListeners';
import { IModelData, ModelDataPartial } from '../../../Model/interfacesAndTypes';
import isModelData from '../../../../utilities/isModelData';

class View extends Observer implements IView {
  private readonly parent: HTMLElement

  private readonly viewModel: IViewModel

  private readonly windowListeners: IWindowListeners

  private readonly sliderContainerView: ISliderContainerView

  private readonly barView: IBarView

  private readonly scaleView: IScaleView

  private readonly thumbView: IThumbView

  private readonly valueInfoView: IValueInfoView

  private tooltipView: ITooltipView

  private presenter: IPresenter | null

  constructor(viewOptions: ViewOptions | SliderOptions, parent: HTMLElement) {
    const classes: ViewClasses = {
      sliderClass: viewOptions.sliderClass || defaultClasses.sliderClass,
      sliderVerticalClass: viewOptions.sliderVerticalClass || defaultClasses.sliderVerticalClass,
      barClass: viewOptions.barClass || defaultClasses.barClass,
      clickableBarClass: viewOptions.clickableBarClass || defaultClasses.clickableBarClass,
      progressBarClass: viewOptions.progressBarClass || defaultClasses.progressBarClass,
      thumbClass: viewOptions.thumbClass || defaultClasses.thumbClass,
      activeThumbClass: viewOptions.activeThumbClass || defaultClasses.activeThumbClass,
      tooltipClass: viewOptions.tooltipClass || defaultClasses.tooltipClass,
      tooltipValueClass: viewOptions.tooltipValueClass || defaultClasses.tooltipValueClass,
      scaleClass: viewOptions.scaleClass || defaultClasses.scaleClass,
      scaleElementClass: viewOptions.scaleElementClass || defaultClasses.scaleElementClass,
      clickableScaleElementClass: viewOptions.clickableScaleElementClass
        || defaultClasses.clickableScaleElementClass,
      valueInfoClass: viewOptions.valueInfoClass || defaultClasses.valueInfoClass,
    };
    const viewModel: IViewModel = new ViewModel({
      modelData: null,
      classes,
      length: viewOptions.length,
      lengthInPx: 0,
      isVertical: viewOptions.isVertical,
      hasTooltip: viewOptions.hasTooltip,
      hasValueInfo: viewOptions.hasValueInfo,
      hasScale: viewOptions.hasScale,
      scaleValue: viewOptions.scaleValue,
      useKeyboard: viewOptions.useKeyboard,
      isScaleClickable: viewOptions.isScaleClickable,
      isBarClickable: viewOptions.isBarClickable,
      activeThumb: null,
      clientX: 0,
      clientY: 0,
    });

    super(viewModel);

    this.viewModel = viewModel;
    this.presenter = null;
    this.parent = parent;

    this.sliderContainerView = new SliderContainerView(this.parent, this);
    this.barView = new BarView(this.sliderContainerView.get(), this);
    this.scaleView = new ScaleView(this.sliderContainerView.get(), this);
    this.thumbView = new ThumbView(this.barView.getBar(), this);
    this.tooltipView = new TooltipView(this.thumbView.get(), this);
    this.valueInfoView = new ValueInfoView(this.sliderContainerView.get(), this);

    this.windowListeners = new WindowListeners(this.viewModel, {
      thumb: this.thumbView,
      bar: this.barView,
      scale: this.scaleView,
    });
  }

  // Возвращает элемент, который указан в elementName
  getElement(elementName: ElementNamesNotArrays): HTMLElement

  // eslint-disable-next-line no-dupe-class-members
  getElement(elementName: 'thumb' | 'tooltip'): HTMLElement | [HTMLElement, HTMLElement]

  // eslint-disable-next-line no-dupe-class-members
  getElement(elementName: ElementName): HTMLElement | [HTMLElement, HTMLElement] {
    let element: HTMLElement | [HTMLElement, HTMLElement];
    switch (elementName) {
      case 'parent':
        element = this.parent;
        break;
      case 'slider':
        element = this.sliderContainerView.get();
        break;
      case 'bar':
        element = this.barView.getBar();
        break;
      case 'progressBar':
        element = this.barView.getProgressBar();
        break;
      case 'thumb':
        element = this.thumbView.get();
        break;
      case 'tooltip':
        element = this.tooltipView.get();
        break;
      case 'scale':
        element = this.scaleView.get();
        break;
      case 'valueInfo':
        element = this.valueInfoView.get();
        break;
      default:
        element = this.sliderContainerView.get();
    }
    return element;
  }

  getElementProperties(): ElementProperties {
    const whenIsVertical: ElementProperties<false> = {
      leftOrTop: 'top',
      rightOrBottom: 'bottom',
      widthOrHeight: 'height',
      offsetWidthOrHeight: 'offsetHeight',
      clientXOrY: 'clientY',
      opposites: null,
    };
    const whenIsNotVertical: ElementProperties<false> = {
      leftOrTop: 'left',
      rightOrBottom: 'right',
      widthOrHeight: 'width',
      offsetWidthOrHeight: 'offsetWidth',
      clientXOrY: 'clientX',
      opposites: null,
    };
    if (this.viewModel.getIsVertical()) {
      return {
        ...whenIsVertical,
        opposites: whenIsNotVertical,
      };
    }
    return {
      ...whenIsNotVertical,
      opposites: whenIsVertical,
    };
  }

  getWindowListeners(): IWindowListeners {
    return this.windowListeners;
  }

  getViews(): Views {
    return {
      sliderContainer: this.sliderContainerView,
      bar: this.barView,
      thumb: this.thumbView,
      tooltip: this.tooltipView,
      scale: this.scaleView,
      valueInfo: this.valueInfoView,
    };
  }

  renderSlider() {
    this.sliderContainerView.mount();
    this.barView.mountBar();
    this.viewModel.setLengthInPx(this.barView.getOffsetLength());
    this.barView.mountProgressBar();
    this.thumbView.mount();
    if (this.viewModel.getHasTooltip()) {
      this.tooltipView.mount();
    }
    if (this.viewModel.getHasScale()) {
      this.scaleView.mount();
    }
    if (this.viewModel.getHasValueInfo()) {
      this.valueInfoView.mount();
    }
    if (this.viewModel.getUseKeyboard()) {
      this.windowListeners.addKeyboardListener();
    }
    this.windowListeners.updateResponsive();
  }

  setPresenter(presenter: IPresenter): IPresenter {
    this.presenter = presenter;
    return this.presenter;
  }

  // Меняет настройки в viewModel
  changeOptions(newOptions: ViewOptionsPartial) {
    if (newOptions.length !== undefined) {
      const availableUnits = ['px', 'mm', 'cm', 'pt', 'pc', 'em', 'rem', '%', 'vw', 'vh', 'vmin', 'vmax'];
      const lengthWithoutMeasureUnit = String(parseFloat(newOptions.length));
      const measureUnit = newOptions.length.replace(lengthWithoutMeasureUnit, '');
      if (availableUnits.find((unit) => unit === measureUnit)) {
        this.viewModel.setLength(newOptions.length);
        if (this.windowListeners) {
          this.windowListeners.updateResponsive();
        }
      }
    }
    if (newOptions.hasTooltip !== undefined) {
      this.viewModel.setHasTooltip(newOptions.hasTooltip);
    }
    if (newOptions.hasScale !== undefined) {
      this.viewModel.setHasScale(newOptions.hasScale);
    }
    if (newOptions.scaleValue !== undefined) {
      this.viewModel.setScaleValue(newOptions.scaleValue);
    }
    if (newOptions.hasValueInfo !== undefined) {
      this.viewModel.setHasValueInfo(newOptions.hasValueInfo);
    }
    if (newOptions.isVertical !== undefined) {
      this.viewModel.setIsVertical(newOptions.isVertical);
    }
    if (newOptions.useKeyboard !== undefined) {
      this.viewModel.setUseKeyboard(newOptions.useKeyboard);
    }
    if (newOptions.isScaleClickable !== undefined) {
      this.viewModel.setIsScaleClickable(newOptions.isScaleClickable);
    }
    if (newOptions.isBarClickable !== undefined) {
      this.viewModel.setIsBarClickable(newOptions.isBarClickable);
    }
  }

  update(action: SubjectAction) {
    switch (action.type) {
      case 'UPDATE_LENGTH':
        this.barView.updateBar();
        this.viewModel.setLengthInPx(this.barView.getOffsetLength());
        this.barView.updateProgressBar();
        this.thumbView.update();
        this.scaleView.update();
        break;
      case 'UPDATE_IS-VERTICAL':
        this.sliderContainerView.update();
        this.barView.updateBar();
        this.viewModel.setLengthInPx(this.barView.getOffsetLength());
        this.barView.updateProgressBar();
        this.thumbView.update();
        this.scaleView.update();
        break;
      case 'UPDATE_HAS-TOOLTIP':
        this.tooltipView.unmount();
        if (this.viewModel.getHasTooltip()) {
          this.tooltipView.mount();
        }
        break;
      case 'UPDATE_HAS-SCALE':
        this.scaleView.unmount();
        if (this.viewModel.getHasScale()) {
          this.scaleView.mount();
        }
        break;
      case 'UPDATE_SCALE-VALUE':
        this.scaleView.recreate();
        break;
      case 'UPDATE_HAS-VALUE-INFO':
        this.valueInfoView.unmount();
        if (this.viewModel.getHasValueInfo()) {
          this.valueInfoView.mount();
        }
        break;
      case 'UPDATE_USE-KEYBOARD':
        this.windowListeners.removeKeyboardListener();
        if (this.viewModel.getUseKeyboard()) {
          this.windowListeners.addKeyboardListener();
        }
        break;
      case 'UPDATE_IS-SCALE-CLICKABLE':
        this.scaleView.removeInteractivity();
        if (this.viewModel.getIsScaleClickable()) {
          this.scaleView.addInteractivity();
        }
        break;
      case 'UPDATE_IS-BAR-CLICKABLE':
        if (this.viewModel.getIsBarClickable()) {
          this.barView.addInteractivity();
        } else {
          this.barView.removeInteractivity();
        }
        break;
      case 'UPDATE_LENGTH-IN-PX':
        this.scaleView.recreate();
        this.thumbView.recreate();
        this.tooltipView = new TooltipView(this.thumbView.get(), this);
        if (this.viewModel.getHasTooltip()) this.tooltipView.mount();
        break;
      default: break;
    }
  }

  // Обращается к viewModel для изменения active thumb
  setActiveThumb(thumbNumber: null): null

  setActiveThumb(thumbNumber?: number): HTMLElement

  setActiveThumb(thumbNumber: number | null = 1): HTMLElement | null {
    const thumb = this.thumbView.get();
    let newActiveThumb: HTMLElement | null;
    if (thumbNumber === null) {
      newActiveThumb = this.viewModel.setActiveThumb(null);
    } else if (Array.isArray(thumb)) {
      newActiveThumb = this.viewModel.setActiveThumb(thumb[thumbNumber]);
    } else {
      newActiveThumb = this.viewModel.setActiveThumb(thumb);
    }
    return newActiveThumb;
  }

  // Обращается к viewModel
  setModelData(newModelData: ModelDataPartial): IModelData | null {
    const modelData: ModelDataPartial = {
      ...this.viewModel.getModelData(),
      ...newModelData,
    };

    if (isModelData(modelData)) {
      this.viewModel.setModelData(modelData);

      if (newModelData.isRange !== undefined) {
        this.thumbView.recreate();
        this.tooltipView = new TooltipView(this.thumbView.get(), this);
        if (this.viewModel.getHasTooltip()) this.tooltipView.mount();
        this.barView.updateProgressBar();
        this.valueInfoView.update();
      }
      if (newModelData.value !== undefined) {
        this.barView.updateProgressBar();
        this.thumbView.update();
        this.tooltipView.update();
        this.valueInfoView.update();
      }
      if (newModelData.max !== undefined) {
        this.thumbView.update();
        this.scaleView.recreate();
        this.valueInfoView.update();
        this.barView.updateProgressBar();
        this.tooltipView.update();
      }
      if (newModelData.min !== undefined) {
        this.thumbView.update();
        this.scaleView.recreate();
        this.valueInfoView.update();
        this.barView.updateProgressBar();
        this.tooltipView.update();
      }
    }

    return this.viewModel.getModelData();
  }

  // Обращается к thumbView
  moveActiveThumb(steps: number = 1) {
    this.thumbView.moveActiveThumb(steps);
  }

  // Передает вызов в presenter
  onThumbMove(numberOfSteps: number, thumbNumber: 0 | 1) {
    if (this.presenter) {
      this.presenter.onThumbMove(numberOfSteps, thumbNumber);
    }
  }

  // Передает значение в viewModel
  setClientCoordinates(coordinates: [number, number]): [number, number] {
    this.viewModel.setClientCoordinates(coordinates);
    return this.viewModel.getClientCoordinates();
  }

  getViewModel(): IViewModel {
    return this.viewModel;
  }

  getThumbNumberThatCloserToPosition(position: number): 0 | 1 {
    let thumbNumber: 0 | 1 = 1;
    const thumbPosition = this.viewModel.getValuePosition();
    const length = this.viewModel.getLengthInPx();

    if (!Array.isArray(thumbPosition)) {
      return 0;
    }

    if (thumbPosition[0] === thumbPosition[1]) {
      if (position < length / 2) {
        thumbNumber = 0;
      }
    } else if (thumbPosition[1] === position) {
      thumbNumber = 0;
    } else if (Math.abs(thumbPosition[0] - position) < Math.abs(thumbPosition[1] - position)) {
      thumbNumber = 0;
    }

    return thumbNumber;
  }
}
export default View;
