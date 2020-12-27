import { ObserverAction, Value } from './modelTypesAndInterfaces';

export interface IPresenter {
  onChange: Function | undefined

  roundValue(value: Value): Value
  onThumbMove(): void
  update(action: ObserverAction): void
}
