import { ObserverAction } from './modelTypesAndInterfaces';

export interface IController {
  onChange: Function | undefined

  update(action: ObserverAction): void
}
