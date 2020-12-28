import { ObserverAction } from './modelTypesAndInterfaces';

export interface IPresenter {
  onChange: Function | undefined

  onThumbMove(numOfSteps?: number, thumbNumber?: 0 | 1): void
  update(action: ObserverAction): void
}
