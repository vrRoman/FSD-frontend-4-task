import { IModelData } from 'Model';
import { ISubject } from 'ObserverAndSubject';

type elementClass = string | string[];

type ViewClasses = {
  sliderClass: elementClass;
  sliderVerticalClass: elementClass;
  sliderRangeClass: elementClass;
  barClass: elementClass;
  clickableBarClass: elementClass;
  progressBarClass: elementClass;
  thumbClass: elementClass;
  activeThumbClass: elementClass;
  tooltipClass: elementClass;
  tooltipValueClass: elementClass;
  scaleClass: elementClass;
  scaleElementClass: elementClass;
  clickableScaleElementClass: elementClass;
  valueInfoClass: elementClass;
};

interface IViewModelData {
  classes: ViewClasses;
  length: string;
  lengthInPx: number;
  isVertical: boolean;
  hasTooltip: boolean;
  hasValueInfo: boolean;
  hasScale: boolean;
  scaleValue: Array<number | string> | number;
  useKeyboard: boolean;
  isScaleClickable: boolean;
  isBarClickable: boolean;

  modelData: IModelData | null;

  activeThumb: HTMLElement | null;
  thumbOffset: number;
  clientX: number;
  clientY: number;
}

type ViewModelDataPartial = Partial<IViewModelData>;

interface IViewModelGetMethods {
  getData(): IViewModelData;
  getData<Key extends keyof IViewModelData>(dataKey: Key): IViewModelData[Key];
  getValuePosition(): number | [number, number];
  getStepLength(): number;
}

interface IViewModel extends ISubject, IViewModelGetMethods {
  changeData(data: ViewModelDataPartial): IViewModelData;
  onThumbMove(numberOfSteps: number, thumbNumber: 0 | 1): void;
}

export {
  IViewModel,
  IViewModelGetMethods,
  IViewModelData,
  ViewModelDataPartial,
  ViewClasses,
};
