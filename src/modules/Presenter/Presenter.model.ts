import { SliderOptionsPartial } from 'options/options';
import { Value } from 'Model';

type OnChange = (value: Value) => void;

interface IPresenter {
  onChange: OnChange | null

  onThumbMove(numberOfSteps?: number, thumbNumber?: 0 | 1): void
  changeOptions(newOptions: SliderOptionsPartial): void
}

export { IPresenter, OnChange };
