import { SliderOptionsPartial } from '../../options/options';

interface IPresenter {
  onChange: Function | null

  onThumbMove(numberOfSteps?: number, thumbNumber?: 0 | 1): void
  changeOptions(newOptions: SliderOptionsPartial): void
}

export default IPresenter;
