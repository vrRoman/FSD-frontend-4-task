import { SliderOptions } from './options';

export interface IPresenter {
  onChange: Function | undefined

  onThumbMove(numOfSteps?: number, thumbNumber?: 0 | 1): void
  changeOptions(newOptions: SliderOptions): void
}
