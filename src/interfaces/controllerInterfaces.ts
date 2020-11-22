import { ObserverAction } from './modelTypesAndInterfaces';

export interface IController {
  addThumbListener() : void

  getActiveThumb(): HTMLElement | undefined
  setActiveThumb(numOfThumb?: number): void
  removeActiveThumb(): void

  getStepLength(): number
  getUseKeyboard(): boolean
  getInteractiveStepsInfo(): boolean

  addStepsInfoInteractivity(): void
  removeStepsInfoInteractivity(): void

  addKeyboardListener(): void
  removeKeyboardListener(): void

  onChange: Function | undefined

  update(action: ObserverAction): void
}
