import { ObserverAction, Value } from './modelTypesAndInterfaces';

export interface IController {
  onChange: Function | undefined

  drawSlider(): void
  roundValue(value: Value): Value
  onThumbMove(): void
  update(action: ObserverAction): void
}
