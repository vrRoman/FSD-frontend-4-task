import IView, { ElemName, IWindowListeners } from './interfaces';
import IPresenter from '../../../Presenter/interface';
import ViewModel from '../ViewModel/ViewModel';
import { IViewModel, ViewClasses } from '../ViewModel/interfacesAndTypes';

import { SliderOptions } from '../../../../options/options';
import { ViewOptions, ViewOptionsOptionalParams } from '../../options';
import { SubjectAction } from '../../../../ObserverAndSubject/interfacesAndTypes';


import SliderContainerView from '../SubViews/SliderContainerView/SliderContainerView';
import ISliderContainerView from '../SubViews/SliderContainerView/interface';

import BarView from '../SubViews/BarView/BarView';
import IBarView from '../SubViews/BarView/interface';

import StepsInfoView from '../SubViews/StepsInfoView/StepsInfoView';
import IStepsInfoView from '../SubViews/StepsInfoView/interface';

import ThumbView from '../SubViews/ThumbView/ThumbView';
import { IThumbView } from '../SubViews/ThumbView/interfaceAndTypes';

import TooltipView from '../SubViews/TooltipView/TooltipView';
import { ITooltipView } from '../SubViews/TooltipView/interfaceAndTypes';

import ValueInfoView from '../SubViews/ValueInfoView/ValueInfoView';
import IValueInfoView from '../SubViews/ValueInfoView/interface';
import Observer from '../../../../ObserverAndSubject/Observer';
import WindowListeners from './WindowListeners';
import { ModelProps } from '../../../Model/interfacesAndTypes';


class View extends Observer implements IView {
  private readonly _parent: HTMLElement
  private presenter: IPresenter | undefined
  private viewModel: IViewModel

  private sliderContainerView: ISliderContainerView | undefined
  private barView: IBarView | undefined
  private stepsInfoView: IStepsInfoView | undefined
  private thumbView: IThumbView | undefined
  private tooltipView: ITooltipView | undefined
  private valueInfoView: IValueInfoView | undefined

  private windowListeners: IWindowListeners | undefined

  constructor(viewOptions: ViewOptions | SliderOptions, parent: HTMLElement) {
    const classes: ViewClasses = {
      sliderClass: viewOptions.sliderClass ? viewOptions.sliderClass : 'slider',
      sliderVerticalClass: viewOptions.sliderVerticalClass ? viewOptions.sliderVerticalClass : 'slider_vertical',
      barClass: viewOptions.barClass ? viewOptions.barClass : 'slider__bar',
      progressBarClass: viewOptions.progressBarClass ? viewOptions.progressBarClass : 'slider__progress-bar',
      thumbClass: viewOptions.thumbClass ? viewOptions.thumbClass : 'slider__thumb',
      activeThumbClass: viewOptions.activeThumbClass ? viewOptions.activeThumbClass : 'slider__thumb_active',
      tooltipClass: viewOptions.tooltipClass ? viewOptions.tooltipClass : 'slider__tooltip',
      tooltipValueClass: viewOptions.tooltipValueClass ? viewOptions.tooltipValueClass : 'slider__tooltip-value',
      stepsInfoClass: viewOptions.stepsInfoClass ? viewOptions.stepsInfoClass : 'slider__steps-info',
      valueInfoClass: viewOptions.valueInfoClass ? viewOptions.valueInfoClass : 'slider__value-info',
    };
    const viewModel: IViewModel = new ViewModel({
      modelProps: undefined,
      classes,
      length: viewOptions.length,
      lengthInPx: undefined,
      isVertical: viewOptions.isVertical,
      hasTooltip: viewOptions.hasTooltip,
      hasValueInfo: viewOptions.hasValueInfo,
      stepsInfoSettings: viewOptions.stepsInfo,
      isResponsive: viewOptions.isResponsive,
      useKeyboard: viewOptions.useKeyboard,
      stepsInfoInteractivity: viewOptions.stepsInfoInteractivity,
      activeThumb: undefined,
      clientX: 0,
      clientY: 0,
    });

    super(viewModel);

    this.viewModel = viewModel;
    this.presenter = undefined;
    this._parent = parent;

    this.sliderContainerView = undefined;
    this.barView = undefined;
    this.stepsInfoView = undefined;
    this.thumbView = undefined;
    this.tooltipView = undefined;
    this.valueInfoView = undefined;

    this.windowListeners = undefined;
  }

  // Возвращает элемент, который указан в elemName
  getElem(elemName: ElemName): HTMLElement | [HTMLElement, HTMLElement] | undefined {
    let elem: HTMLElement | [HTMLElement, HTMLElement] | undefined;
    switch (elemName) {
      case 'parent':
        elem = this._parent;
        break;
      case 'slider':
        elem = this.sliderContainerView ? this.sliderContainerView.get() : undefined;
        break;
      case 'bar':
        elem = this.barView ? this.barView.getBar() : undefined;
        break;
      case 'progressBar':
        elem = this.barView ? this.barView.getProgressBar() : undefined;
        break;
      case 'thumb':
        elem = this.thumbView ? this.thumbView.get() : undefined;
        break;
      case 'tooltip':
        elem = this.tooltipView ? this.tooltipView.get() : undefined;
        break;
      case 'stepsInfo':
        elem = this.stepsInfoView ? this.stepsInfoView.get() : undefined;
        break;
      case 'valueInfo':
        elem = this.valueInfoView ? this.valueInfoView.get() : undefined;
        break;
      default:
        elem = undefined;
    }
    return elem;
  }

  drawSlider() {
    this.sliderContainerView = new SliderContainerView(this._parent, this.viewModel);
    const slider = this.sliderContainerView.create();

    this.barView = new BarView(slider, this.viewModel);
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

    this.stepsInfoView = new StepsInfoView(bar, this.viewModel, this);
    if (this.viewModel.getStepsInfoSettings()) {
      this.stepsInfoView.create();
    }
    this.valueInfoView = new ValueInfoView(slider, this.viewModel);
    if (this.viewModel.getHasValueInfo()) {
      this.valueInfoView.create();
    }

    this.windowListeners = new WindowListeners(this.viewModel, {
      thumb: this.thumbView,
      bar: this.barView,
      stepsInfo: this.stepsInfoView,
    });

    if (this.viewModel.getUseKeyboard()) {
      this.windowListeners.addKeyboardListener();
    }
    this.windowListeners.setIsResponsive(this.viewModel.getIsResponsive());
  }

  // В зависимости от action, обновляет view
  updateModelPropsInSlider(action: SubjectAction) {
    switch (action.type) {
      case 'UPDATE_VALUE':
        if (action.updatedProps) {
          this.setModelProps({
            value: action.updatedProps.value,
          });
        }
        if (this.thumbView) this.thumbView.update();
        if (this.valueInfoView) this.valueInfoView.update();
        if (this.barView) this.barView.updateProgressBar();
        if (this.tooltipView) this.tooltipView.update();
        break;

      case 'UPDATE_IS-RANGE':
        if (action.updatedProps) {
          this.setModelProps({
            value: action.updatedProps.value,
            isRange: action.updatedProps.isRange,
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
        if (action.updatedProps) {
          this.setModelProps({
            value: action.updatedProps.value,
            min: action.updatedProps.min,
            max: action.updatedProps.max,
            stepSize: action.updatedProps.stepSize,
          });
        }
        if (this.thumbView) this.thumbView.update();
        if (this.stepsInfoView && this.viewModel.getStepsInfoSettings()) {
          this.stepsInfoView.remove();
          this.stepsInfoView.create();
        }
        if (this.valueInfoView) this.valueInfoView.update();
        if (this.barView) this.barView.updateProgressBar();
        if (this.tooltipView) this.tooltipView.update();
        break;

      case 'UPDATE_STEPSIZE':
        if (action.updatedProps) {
          this.setModelProps({
            stepSize: action.updatedProps.stepSize,
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
  changeOptions(newOptions: ViewOptionsOptionalParams) {
    if (newOptions.length !== undefined) {
      this.viewModel.setLength(newOptions.length);
    }
    if (newOptions.hasTooltip !== undefined) {
      this.viewModel.setHasTooltip(newOptions.hasTooltip);
    }
    if (newOptions.stepsInfo !== undefined) {
      this.viewModel.setStepsInfoSettings(newOptions.stepsInfo);
    }
    if (newOptions.hasValueInfo !== undefined) {
      this.viewModel.setHasValueInfo(newOptions.hasValueInfo);
    }
    if (newOptions.isVertical !== undefined) {
      this.viewModel.setIsVertical(newOptions.isVertical);
    }
    if (newOptions.isResponsive !== undefined) {
      this.viewModel.setIsResponsive(newOptions.isResponsive);
    }
    if (newOptions.useKeyboard !== undefined) {
      this.viewModel.setUseKeyboard(newOptions.useKeyboard);
    }
    if (newOptions.stepsInfoInteractivity !== undefined) {
      if (this.viewModel.getStepsInfoInteractivity() !== newOptions.stepsInfoInteractivity) {
        this.viewModel.setStepsInfoInteractivity(newOptions.stepsInfoInteractivity);
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
        if (this.stepsInfoView) this.stepsInfoView.update();
        break;
      case 'UPDATE_IS-VERTICAL':
        if (this.sliderContainerView) this.sliderContainerView.updateVertical();
        if (this.barView) this.barView.updateBar();
        if (this.barView) this.barView.updateProgressBar();
        if (this.thumbView) this.thumbView.update();
        if (this.stepsInfoView) this.stepsInfoView.updateVertical();
        break;
      case 'UPDATE_IS-RESPONSIVE':
        if (this.windowListeners) {
          this.windowListeners.setIsResponsive(this.viewModel.getIsResponsive());
        }
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
      case 'UPDATE_STEPSINFO-SETTINGS':
        if (this.stepsInfoView) {
          this.stepsInfoView.remove();
          if (this.viewModel.getStepsInfoSettings()) {
            this.stepsInfoView.create();
            this.stepsInfoView.update();
          }
        }
        break;
      case 'UPDATE_HAS-VALUEINFO':
        if (this.valueInfoView) {
          if (this.viewModel.getHasValueInfo()) {
            this.valueInfoView.remove();
            this.valueInfoView.create();
          } else {
            this.valueInfoView.remove();
          }
        }
        break;
      case 'UPDATE_USEKEYBOARD':
        if (this.windowListeners) {
          this.windowListeners.removeKeyboardListener();
          if (this.viewModel.getUseKeyboard()) {
            this.windowListeners.addKeyboardListener();
          }
        }
        break;
      case 'UPDATE_STEPSINFO-INTERACTIVITY':
        if (this.viewModel.getStepsInfoSettings()) {
          if (this.stepsInfoView) {
            if (this.viewModel.getStepsInfoInteractivity()) {
              this.stepsInfoView.addInteractivity();
            } else {
              this.stepsInfoView.removeInteractivity();
            }
          }
        }
        break;
      default:
        break;
    }
  }

  // Обращается к viewModel для изменения active thumb
  setActiveThumb(numOfThumb: number = 1): void {
    if (this.thumbView) {
      const thumb = this.thumbView.get();
      if (thumb) {
        if (Array.isArray(thumb)) {
          this.viewModel.setActiveThumb(thumb[numOfThumb]);
        } else {
          this.viewModel.setActiveThumb(thumb);
        }
      }
    }
  }

  // Обращается к viewModel
  setModelProps(modelProps: ModelProps) {
    this.viewModel.setModelProps(modelProps);
  }
  // Обращается к thumbView
  moveActiveThumb(steps: number = 1) {
    if (this.thumbView) {
      this.thumbView.moveActiveThumb(steps);
    }
  }
  // Убирает класс активного ползунка и обращается к viewModel для удаления активного ползунка
  removeActiveThumb(): void {
    this.viewModel.removeActiveThumb();
  }
  // Передает вызов в presenter
  onThumbMove(numOfSteps: number, numOfThumb: 0 | 1) {
    if (this.presenter) {
      this.presenter.onThumbMove(numOfSteps, numOfThumb);
    }
  }
  // Передает значение в viewModel
  setClientCoords(coords: [number, number]) {
    this.viewModel.setClientCoords(coords);
  }

  getViewModel(): IViewModel {
    return this.viewModel;
  }
}


export default View;
