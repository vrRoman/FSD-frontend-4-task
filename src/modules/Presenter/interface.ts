import { SliderOptions } from '../../options/options';

interface IPresenter {
  onChange: Function | undefined

  onThumbMove(numberOfSteps?: number, thumbNumber?: 0 | 1): void
  changeOptions(newOptions: SliderOptions): void
}

export default IPresenter;