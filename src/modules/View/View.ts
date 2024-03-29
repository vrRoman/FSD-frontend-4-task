import autoBind from 'auto-bind';

import defaultClasses from 'constants/defaultClasses';
import { staticLengthUnits } from 'constants/lengthUnits';
import { IObserver, Observer } from 'ObserverAndSubject';
import type { SubjectAction } from 'ObserverAndSubject';
import type { IModelData, ModelDataPartial } from 'Model';
import getDifferences from 'utilities/getDifferences';
import isModelData from 'utilities/isModelData';

import type {
  IView,
  ElementName,
  ElementNamesNotArrays,
  ElementProperties,
  Views,
  ViewOptions,
  ViewOptionsPartial,
} from './View.model';
import ViewModel from './ViewModel';
import type { IViewModelData, IViewModel, ViewClasses } from './ViewModel';
import SliderContainerView from './SubViews/SliderContainerView';
import type { ISliderContainerView } from './SubViews/SliderContainerView';
import BarView from './SubViews/BarView';
import type { IBarView } from './SubViews/BarView';
import ScaleView from './SubViews/ScaleView';
import type { IScaleView } from './SubViews/ScaleView';
import ThumbView from './SubViews/ThumbView';
import type { IThumbView } from './SubViews/ThumbView';
import TooltipView from './SubViews/TooltipView';
import type { ITooltipView } from './SubViews/TooltipView';
import ValueInfoView from './SubViews/ValueInfoView';
import type { IValueInfoView } from './SubViews/ValueInfoView';

class View extends Observer implements IView {
  private readonly parent: HTMLElement

  private readonly viewModel: IViewModel

  private readonly sliderContainerView: ISliderContainerView

  private readonly barView: IBarView

  private readonly scaleView: IScaleView

  private readonly thumbView: IThumbView

  private readonly valueInfoView: IValueInfoView

  private readonly tooltipView: ITooltipView

  constructor(viewOptions: ViewOptions, parent: HTMLElement) {
    const classes: ViewClasses = {
      sliderClass: viewOptions.sliderClass || defaultClasses.sliderClass,
      sliderRangeClass: viewOptions.sliderRangeClass || defaultClasses.sliderRangeClass,
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
      thumbOffset: 0,
      clientX: 0,
      clientY: 0,
    });

    super(viewModel);
    autoBind(this);

    this.viewModel = viewModel;
    this.parent = parent;

    this.sliderContainerView = new SliderContainerView(this.parent, this);
    this.barView = new BarView(this.sliderContainerView.get(), this);
    this.scaleView = new ScaleView(this.sliderContainerView.get(), this);
    this.thumbView = new ThumbView(this.barView.getBar(), this);
    this.tooltipView = new TooltipView(this.thumbView.get(), this);
    this.valueInfoView = new ValueInfoView(this.sliderContainerView.get(), this);
  }

  // Возвращает элемент, который указан в elementName
  getElement(elementName: ElementNamesNotArrays): HTMLElement

  // eslint-disable-next-line no-dupe-class-members
  getElement(elementName: 'thumb' | 'tooltip'): HTMLElement | [HTMLElement, HTMLElement]

  // eslint-disable-next-line no-dupe-class-members
  getElement(elementName: ElementName): HTMLElement | [HTMLElement, HTMLElement] {
    const elements = {
      parent: this.parent,
      slider: this.sliderContainerView.get(),
      bar: this.barView.getBar(),
      progressBar: this.barView.getProgressBar(),
      thumb: this.thumbView.get(),
      tooltip: this.tooltipView.get(),
      scale: this.scaleView.get(),
      valueInfo: this.valueInfoView.get(),
    };
    return elements[elementName];
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
    if (this.viewModel.getData('isVertical')) {
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
    this.viewModel.changeData({ lengthInPx: this.barView.getLength() });
    this.barView.mountProgressBar();
    this.thumbView.mount();
    if (this.viewModel.getData('useKeyboard')) {
      this.thumbView.addKeyboardListener();
    }
    if (this.viewModel.getData('hasTooltip')) {
      this.tooltipView.mount();
    }
    if (this.viewModel.getData('hasScale')) {
      this.scaleView.mount();
    }
    if (this.viewModel.getData('hasValueInfo')) {
      this.valueInfoView.mount();
    }
    this.updateResponsive();
  }

  // Меняет настройки в viewModel
  changeOptions(newOptions: ViewOptionsPartial) {
    this.viewModel.changeData(newOptions);
  }

  update(action: SubjectAction) {
    if (action.type !== 'CHANGE_VIEW_DATA') return;

    action.payload.differences.forEach((dataKey) => {
      this.handleViewDataChange(dataKey);
    });
  }

  // Обращается к viewModel для изменения active thumb
  setActiveThumb(thumbNumber: null): null

  setActiveThumb(thumbNumber?: 0 | 1): HTMLElement

  setActiveThumb(thumbNumber: 0 | 1 | null = 1): HTMLElement | null {
    const thumb = this.thumbView.get();
    let newActiveThumb: HTMLElement | null;
    if (thumbNumber === null) {
      newActiveThumb = this.viewModel.changeData({ activeThumb: null }).activeThumb;
    } else if (Array.isArray(thumb)) {
      newActiveThumb = this.viewModel.changeData({ activeThumb: thumb[thumbNumber] }).activeThumb;
    } else {
      newActiveThumb = this.viewModel.changeData({ activeThumb: thumb }).activeThumb;
    }
    return newActiveThumb;
  }

  // Обращается к viewModel
  setModelData(newModelData: ModelDataPartial): IModelData | null {
    const oldModelData = this.viewModel.getData('modelData') || {};
    const modelData = {
      ...oldModelData,
      ...newModelData,
    };

    if (!isModelData(modelData)) return null;
    this.viewModel.changeData({ modelData });

    getDifferences(oldModelData, modelData).forEach(
      (dataKey) => this.handleModelDataChange(dataKey),
    );

    return this.viewModel.getData('modelData');
  }

  // Обращается к thumbView
  moveActiveThumb(steps: number = 1) {
    this.thumbView.moveActiveThumb(steps);
  }

  subscribe(observer: IObserver) {
    this.viewModel.subscribe(observer);
  }

  // Передает вызов в presenter
  onThumbMove(numberOfSteps: number, thumbNumber: 0 | 1) {
    this.viewModel.onThumbMove(numberOfSteps, thumbNumber);
  }

  // Передает значение в viewModel
  setClientCoordinates([coordinateX, coordinateY]: [number, number]): [number, number] {
    const { clientX, clientY } = this.viewModel.changeData({
      clientX: coordinateX,
      clientY: coordinateY,
    });
    return [clientX, clientY];
  }

  setThumbOffset(offset: number): number {
    const { thumbOffset } = this.viewModel.changeData({ thumbOffset: offset });
    return thumbOffset;
  }

  // Если длина измеряется в статических единицах, то слушатель изменения размера окна убирается,
  // и наоборот
  updateResponsive() {
    const lengthStyle = this.viewModel.getData('length');
    const lengthWithoutMeasureUnit = String(parseFloat(lengthStyle));
    const measureUnit = lengthStyle.replace(lengthWithoutMeasureUnit, '');

    if (staticLengthUnits.find((unit) => unit === measureUnit)) {
      window.removeEventListener('resize', this.handleWindowResize);
    } else {
      window.removeEventListener('resize', this.handleWindowResize);
      window.addEventListener('resize', this.handleWindowResize);
    }
  }

  // Сделать активным ползунком тот, который ближе к позиции.
  // Если позиция не задана, то вернется первый ползунок
  updateActiveThumb(clickPosition: number = 0): HTMLElement {
    const { rightOrBottom, leftOrTop } = this.getElementProperties();
    const bar = this.getElement('bar');
    const barMinCoordinate = bar.getBoundingClientRect()[leftOrTop];
    const barMaxCoordinate = bar.getBoundingClientRect()[rightOrBottom];
    const stepLength = this.viewModel.getStepLength();

    const value = Math.round(clickPosition / stepLength);
    const lastStepPosition = barMaxCoordinate - barMinCoordinate;
    const lastStep = Math.ceil(lastStepPosition / stepLength);
    const secondToLastStepPosition = (lastStep - 1) * stepLength;

    const isLastStep = clickPosition
      > (lastStepPosition - secondToLastStepPosition) / 2 + secondToLastStepPosition;
    const newActiveThumbNumber = this.getThumbNumberThatCloserToPosition(
      isLastStep ? lastStepPosition : value * stepLength,
    );
    this.thumbView.setActiveThumb(newActiveThumbNumber);
    return this.setActiveThumb(newActiveThumbNumber);
  }

  getViewModel(): IViewModel {
    return this.viewModel;
  }

  getThumbNumberThatCloserToPosition(position: number): 0 | 1 {
    const thumbPosition = this.viewModel.getValuePosition();
    if (!Array.isArray(thumbPosition)) return 0;

    const [firstThumbPosition, secondThumbPosition] = thumbPosition.map(
      (value) => Math.round(value),
    );
    const roundedPosition = Math.round(position);

    if (firstThumbPosition === secondThumbPosition) {
      return roundedPosition > firstThumbPosition ? 1 : 0;
    }

    if (roundedPosition > secondThumbPosition) return 1;
    if (roundedPosition < firstThumbPosition) return 0;

    if (roundedPosition === firstThumbPosition) return 1;
    if (roundedPosition === secondThumbPosition) return 0;

    if (roundedPosition - firstThumbPosition < (secondThumbPosition - firstThumbPosition) / 2) {
      return 0;
    }
    return 1;
  }

  private handleViewDataChange(key: keyof IViewModelData) {
    const updateLengthInPx = () => {
      this.barView.updateProgressBar();
      this.scaleView.update();
      this.thumbView.update();
    };
    const handlers: Record<string, () => void> & { default: () => void } = {
      length: () => {
        this.barView.updateBar();
        this.viewModel.changeData({ lengthInPx: this.barView.getLength() });
        updateLengthInPx();
        this.updateResponsive();
      },
      isVertical: () => {
        this.sliderContainerView.update();
        this.barView.updateBar();
        this.viewModel.changeData({ lengthInPx: this.barView.getLength() });
        updateLengthInPx();
      },
      hasTooltip: () => {
        this.tooltipView.unmount();
        if (this.viewModel.getData('hasTooltip')) {
          this.tooltipView.mount();
        }
      },
      hasScale: () => {
        this.scaleView.unmount();
        if (this.viewModel.getData('hasScale')) {
          this.scaleView.mount();
        }
      },
      hasValueInfo: () => {
        this.valueInfoView.unmount();
        if (this.viewModel.getData('hasValueInfo')) {
          this.valueInfoView.mount();
        }
      },
      scaleValue: () => {
        this.scaleView.recreate();
      },
      useKeyboard: () => {
        this.thumbView.removeKeyboardListener();
        if (this.viewModel.getData('useKeyboard')) {
          this.thumbView.addKeyboardListener();
        }
      },
      isScaleClickable: () => {
        this.scaleView.removeInteractivity();
        if (this.viewModel.getData('isScaleClickable')) {
          this.scaleView.addInteractivity();
        }
      },
      isBarClickable: () => {
        if (this.viewModel.getData('isBarClickable')) {
          this.barView.addInteractivity();
        } else {
          this.barView.removeInteractivity();
        }
      },
      lengthInPx: () => {
        updateLengthInPx();
      },
      default: () => {},
    };
    (handlers[key] || handlers.default)();
  }

  private handleModelDataChange(key: keyof IModelData) {
    const handleMinMaxChange = () => {
      this.thumbView.update();
      this.scaleView.recreate();
      this.valueInfoView.update();
      this.barView.updateProgressBar();
      this.tooltipView.update();
    };
    const handlers: Record<string, () => void> & { default: () => void } = {
      isRange: () => {
        this.sliderContainerView.update();
        this.thumbView.recreate();
        this.tooltipView.recreate(this.thumbView.get());
        this.barView.updateProgressBar();
        this.valueInfoView.update();
      },
      value: () => {
        this.barView.updateProgressBar();
        this.thumbView.update();
        this.tooltipView.update();
        this.valueInfoView.update();
      },
      max: handleMinMaxChange,
      min: handleMinMaxChange,
      default: () => {},
    };
    (handlers[key] || handlers.default)();
  }

  // Если длина бара не соответствует lengthInPx
  // то передает новую lengthInPx и обновляет thumb, scale, progressBar
  private handleWindowResize() {
    const currentLength = this.barView.getLength();
    if (currentLength === this.viewModel.getData('lengthInPx')) {
      return;
    }

    this.viewModel.changeData({ lengthInPx: currentLength });
    this.barView.updateProgressBar();
    this.thumbView.update();
    this.scaleView.update();
  }
}
export default View;
