import { Value } from './modelTypesAndInterfaces';

export type SubjectAction = {
  type: 'UPDATE_VALUE' | 'UPDATE_RANGE' | 'UPDATE_MIN-MAX' | 'UPDATE_STEPSIZE'
  updatedProps?: {
    value?: Value
    range?: boolean
    stepSize?: number
    min?: number
    max?: number
  }
}

export interface ISubject {
  subscribe(observer: Object): void
  unsubscribe(observer: Object): void
  notify(action: SubjectAction): void
}

export interface IObserver {
  update(action: SubjectAction): void
}
