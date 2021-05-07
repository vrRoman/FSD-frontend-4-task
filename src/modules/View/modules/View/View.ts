import IView, { ElementName, ElementNamesNotArrays, IWindowListeners } from './interfaces';
import IPresenter from '../../../Presenter/interface';
import ViewModel from '../ViewModel/ViewModel';
import { IViewModel, ViewClasses } from '../ViewModel/interfacesAndTypes';

import { SliderOptions } from '../../../../options/options';
import { ViewOptions, ViewOptionsPartial } from '../../options';
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
import { ModelProperties } from '../../../Model/interfacesAndTypes';

class View extends Observer implements IView {
  private readonly parent: HTMLElement

  private readonly viewModel: IViewModel

  private presenter: IPresenter | undefined

  private sliderContainerView: ISliderContainerView | undefined

  private barView: IBarView | undefined

  private scaleView: IScaleView | undefined

  private thumbView: IThumbView | undefined

  private tooltipView: ITooltipView | undefined

  private valueInfoView: IValueInfoView | undefined

  private windowListeners: IWindowListeners | undefined

  constructor(viewOptions: ViewOptions | SliderOptions, parent: HTMLElement) {
    const classes: ViewClasses = {
      sliderClass: viewOptions.sliderClass || 'slider',
      sliderVerticalClass: viewOptions.sliderVerticalClass || 'slider_vertical',
      barClass: viewOptions.barClass || 'slider__bar',
      clickableBarClass: viewOptions.clickableBarClass || 'slider__bar_clickable',
      progressBarClass: viewOptions.progressBarClass || 'slider__progress-bar',
      thumbClass: viewOptions.thumbClass || 'slider__thumb',
      activeThumbClass: viewOptions.activeThumbClass || 'slider__thumb_active',
      tooltipClass: viewOptions.tooltipClass || 'slider__tooltip',
      tooltipValueClass: viewOptions.tooltipValueClass || 'slider__tooltip-value',
      scaleClass: viewOptions.scaleClass || 'slider__scale',
      scaleElementClass: viewOptions.scaleElementClass || 'slider__scale-element',
      clickableScaleElementClass: viewOptions.clickableScaleElementClass || 'slider__scale-element_clickable',
      valueInfoClass: viewOptions.valueInfoClass || 'slider__value-info',
    };
    const viewModel: IViewModel = new ViewModel({
      modelProperties: undefined,
      classes,
      length: viewOptions.length,
      lengthInPx: undefined,
      isVertical: viewOptions.isVertical,
      hasTooltip: viewOptions.hasTooltip,
      hasValueInfo: viewOptions.hasValueInfo,
      hasScale: viewOptions.hasScale,
      scaleValue: viewOptions.scaleValue,
      useKeyboard: viewOptions.useKeyboard,
      isScaleClickable: viewOptions.isScaleClickable,
      isBarClickable: viewOptions.isBarClickable,
      activeThumb: undefined,
      clientX: 0,
      clientY: 0,
    });

    super(viewModel);

    this.viewModel = viewModel;
    this.presenter = undefined;
    this.parent = parent;

    this.sliderContainerView = undefined;
    this.barView = undefined;
    this.scaleView = undefined;
    this.thumbView = undefined;
    this.tooltipView = undefined;
    this.valueInfoView = undefined;

    this.windowListeners = undefined;
  }

  // Возвращает элемент, который указан в elementName
  getElement(elementName: ElementNamesNotArrays): HTMLElement | undefined

  // eslint-disable-next-line no-dupe-class-members
  getElement(elementName: 'thumb' | 'tooltip'): HTMLElement | [HTMLElement, HTMLElement] | undefined

  // eslint-disable-next-line no-dupe-class-members
  getElement(elementName: ElementName): HTMLElement | [HTMLElement, HTMLElement] | undefined {
    let element: HTMLElement | [HTMLElement, HTMLElement] | undefined;
    switch (elementName) {
      case 'parent':
        element = this.parent;
        break;
      case 'slider':
        element = this.sliderContainerView ? this.sliderContainerView.get() : undefined;
        break;
      case 'bar':
        element = this.barView ? this.barView.getBar() : undefined;
        break;
      case 'progressBar':
        element = this.barView ? this.barView.getProgressBar() : undefined;
        break;
      case 'thumb':
        element = this.thumbView ? this.thumbView.get() : undefined;
        break;
      case 'tooltip':
        element = this.tooltipView ? this.tooltipView.get() : undefined;
        break;
      case 'scale':
        element = this.scaleView ? this.scaleView.get() : undefined;
        break;
      case 'valueInfo':
        element = this.valueInfoView ? this.valueInfoView.get() : undefined;
        break;
      default:
        element = undefined;
    }
    return element;
  }

  drawSlider() {
    this.sliderContainerView = new SliderContainerView(this.parent, this.viewModel);
    const slider = this.sliderContainerView.create();

    this.barView = new BarView(slider, this.viewModel, this);
    const bar = this.barView.createBar();
    const length = this.viewModel.getIsVertical() ? bar.offsetHeight : bar.offsetWidth;
    this.viewModel.setLengthInPx(length);
    this.barView.createProgressBar();

    this.thumbView = new ThumbView(bar, this.viewModel, this);
    const thumb = this.thumbView.create();
    if (thumb) {
      this.tooltipView = new TooltipView(thumb, this.viewModel);

      if (this.viewModel.getHasTooltip()) {
        this.tooltipView.create();
      }
    }

    this.scaleView = new ScaleView(slider, this.viewModel, this);
    if (this.viewModel.getHasScale()) {
      this.scaleView.create();
    }
    this.valueInfoView = new ValueInfoView(slider, this.viewModel);
    if (this.viewModel.getHasValueInfo()) {
      this.valueInfoView.create();
    }

    this.windowListeners = new WindowListeners(this.viewModel, {
      thumb: this.thumbView,
      bar: this.barView,
      scale: this.scaleView,
    });

    if (this.viewModel.getUseKeyboard()) {
      this.windowListeners.addKeyboardListener();
    }

    this.windowListeners.updateResponsive();
  }

  // В зависимости от action, обновляет view
  updateModelPropertiesInSlider(action: SubjectAction) {
    switch (action.type) {
      case 'UPDATE_VALUE':
        if (action.updatedProperties) {
          this.setModelProperties({
            value: action.updatedProperties.value,
          });
        }
        if (this.thumbView) this.thumbView.update();
        if (this.valueInfoView) this.valueInfoView.update();
        if (this.barView) this.barView.updateProgressBar();
        if (this.tooltipView) this.tooltipView.update();
        break;

      case 'UPDATE_IS-RANGE':
        if (action.updatedProperties) {
          this.setModelProperties({
            value: action.updatedProperties.value,
            isRange: action.updatedProperties.isRange,
          });
        }
        if (this.thumbView) {
          this.thumbView.remove();
          const thumb = this.thumbView.create();

          if (thumb) {
            if (this.tooltipView) this.tooltipView.remove();
            this.tooltipView = new TooltipView(thumb, this.viewModel);
            if (this.viewModel.getHasTooltip()) {
              this.tooltipView.create();
            }
          }
        }
        if (this.barView) this.barView.updateProgressBar();
        if (this.valueInfoView) this.valueInfoView.update();
        break;

      case 'UPDATE_MIN-MAX':
        if (action.updatedProperties) {
          this.setModelProperties({
            value: action.updatedProperties.value,
            min: action.updatedProperties.min,
            max: action.updatedProperties.max,
            stepSize: action.updatedProperties.stepSize,
          });
        }
        if (this.thumbView) this.thumbView.update();
        if (this.scaleView && this.viewModel.getHasScale()) {
          this.scaleView.remove();
          this.scaleView.create();
        }
        if (this.valueInfoView) this.valueInfoView.update();
        if (this.barView) this.barView.updateProgressBar();
        if (this.tooltipView) this.tooltipView.update();
        break;

      case 'UPDATE_STEP-SIZE':
        if (action.updatedProperties) {
          this.setModelProperties({
            stepSize: action.updatedProperties.stepSize,
          });
        }
        break;

      default:
        break;
    }
  }

  setPresenter(presenter: IPresenter) {
    this.presenter = presenter;
  }

  // Меняет настройки, передавая в viewModel
  changeOptions(newOptions: ViewOptionsPartial) {
    if (newOptions.length !== undefined) {
      this.viewModel.setLength(newOptions.length);
      if (this.windowListeners) {
        this.windowListeners.updateResponsive();
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
      if (this.viewModel.getIsScaleClickable() !== newOptions.isScaleClickable) {
        this.viewModel.setIsScaleClickable(newOptions.isScaleClickable);
      }
    }
    if (newOptions.isBarClickable !== undefined) {
      if (this.viewModel.getIsBarClickable() !== newOptions.isBarClickable) {
        this.viewModel.setIsBarClickable(newOptions.isBarClickable);
      }
    }
  }

  // Обновляет визуальные настройки слайдера
  update(action: SubjectAction) {
    switch (action.type) {
      case 'UPDATE_LENGTH':
        if (this.barView) this.barView.updateBar();
        if (this.barView) this.viewModel.setLengthInPx(this.barView.getOffsetLength() || 0);
        if (this.barView) this.barView.updateProgressBar();
        if (this.thumbView) this.thumbView.update();
        if (this.scaleView) this.scaleView.update();
        break;
      case 'UPDATE_IS-VERTICAL':
        if (this.sliderContainerView) this.sliderContainerView.updateVertical();
        if (this.barView) this.barView.updateBar();
        if (this.barView) this.barView.updateProgressBar();
        if (this.barView) this.viewModel.setLengthInPx(this.barView.getOffsetLength() || 0);
        if (this.thumbView) this.thumbView.update();
        if (this.scaleView) this.scaleView.updateVertical();
        break;
      case 'UPDATE_HAS-TOOLTIP':
        if (this.tooltipView) {
          if (this.viewModel.getHasTooltip()) {
            this.tooltipView.remove();
            this.tooltipView.create();
          } else {
            this.tooltipView.remove();
          }
        }
        break;
      case 'UPDATE_HAS-SCALE':
        if (this.scaleView) {
          this.scaleView.remove();
          if (this.viewModel.getHasScale()) {
            this.scaleView.create();
          }
        }
        break;
      case 'UPDATE_SCALE-VALUE':
        if (this.scaleView) {
          if (this.viewModel.getHasScale()) {
            this.scaleView.remove();
            this.scaleView.create();
          }
        }
        break;
      case 'UPDATE_HAS-VALUE-INFO':
        if (this.valueInfoView) {
          if (this.viewModel.getHasValueInfo()) {
            this.valueInfoView.remove();
            this.valueInfoView.create();
          } else {
            this.valueInfoView.remove();
          }
        }
        break;
      case 'UPDATE_USE-KEYBOARD':
        if (this.windowListeners) {
          this.windowListeners.removeKeyboardListener();
          if (this.viewModel.getUseKeyboard()) {
            this.windowListeners.addKeyboardListener();
          }
        }
        break;
      case 'UPDATE_IS-SCALE-CLICKABLE':
        if (this.viewModel.getHasScale()) {
          if (this.scaleView) {
            if (this.viewModel.getIsScaleClickable()) {
              this.scaleView.addInteractivity();
            } else {
              this.scaleView.removeInteractivity();
            }
          }
        }
        break;
      case 'UPDATE_IS-BAR-CLICKABLE':
        if (this.barView) {
          if (this.viewModel.getIsBarClickable()) {
            this.barView.addInteractivity();
          } else {
            this.barView.removeInteractivity();
          }
        }
        break;
      default:
        break;
    }
  }

  // Обращается к viewModel для изменения active thumb
  setActiveThumb(thumbNumber: number = 1): void {
    if (this.thumbView) {
      const thumb = this.thumbView.get();
      if (thumb) {
        this.removeActiveThumb();
        if (Array.isArray(thumb)) {
          this.viewModel.setActiveThumb(thumb[thumbNumber]);
        } else {
          this.viewModel.setActiveThumb(thumb);
        }
      }
    }
  }

  // Обращается к viewModel
  setModelProperties(modelProperties: ModelProperties) {
    this.viewModel.setModelProperties(modelProperties);
  }

  // Обращается к thumbView
  moveActiveThumb(steps: number = 1) {
    if (this.thumbView) {
      this.thumbView.moveActiveThumb(steps);
    }
  }

  // Обращается к viewModel для удаления активного ползунка
  removeActiveThumb(): void {
    this.viewModel.removeActiveThumb();
  }

  // Передает вызов в presenter
  onThumbMove(numberOfSteps: number, thumbNumber: 0 | 1) {
    if (this.presenter) {
      this.presenter.onThumbMove(numberOfSteps, thumbNumber);
    }
  }

  // Передает значение в viewModel
  setClientCoordinates(coordinates: [number, number]) {
    this.viewModel.setClientCoordinates(coordinates);
  }

  getViewModel(): IViewModel {
    return this.viewModel;
  }

  getThumbNumberThatCloserToPosition(position: number): 0 | 1 {
    let thumbNumber: 0 | 1 = 1;
    const thumbPosition = this.viewModel.getValuePosition();
    const length = this.viewModel.getLengthInPx();

    if (length === undefined) {
      return 0;
    }
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
