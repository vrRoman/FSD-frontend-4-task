import type { ModelOptions, Value } from 'Model';
import type { ViewOptions } from 'View/modules/View';

type OnChange = (value: Value) => void;

type PresenterOptions = {
  // Будет выполняться при любом передвижении ползунка
  onChange?: OnChange
}

type SliderOptions = ModelOptions & ViewOptions & PresenterOptions

type SliderOptionsPartial = Partial<SliderOptions>

interface IPresenter {
  onChange: OnChange | null

  onThumbMove(numberOfSteps?: number, thumbNumber?: 0 | 1): void
  changeOptions(newOptions: SliderOptionsPartial): void
}

export type {
  IPresenter,
  OnChange,
  PresenterOptions,
  SliderOptions,
  SliderOptionsPartial,
};
