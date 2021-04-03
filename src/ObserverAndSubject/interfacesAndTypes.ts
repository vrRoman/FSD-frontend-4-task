import { Value } from '../modules/Model/interfacesAndTypes';


type actionModelType = 'UPDATE_VALUE' | 'UPDATE_IS-RANGE' | 'UPDATE_MIN-MAX' | 'UPDATE_STEPSIZE';
type actionViewType = 'UPDATE_LENGTH' | 'UPDATE_VERTICAL' | 'UPDATE_RESPONSIVE' | 'UPDATE_HAS-TOOLTIP'
  | 'UPDATE_STEPSINFO-SETTINGS' | 'UPDATE_HAS-VALUEINFO' | 'UPDATE_USEKEYBOARD' | 'UPDATE_STEPSINFO-INTERACTIVITY'

type SubjectAction = {
  type: actionModelType | actionViewType

  updatedProps?: {
    value?: Value
    isRange?: boolean
    stepSize?: number
    min?: number
    max?: number
  }
}

interface ISubject {
  subscribe(observer: Object): void
  unsubscribe(observer: Object): void
  notify(action: SubjectAction): void
}

interface IObserver {
  update(action: SubjectAction): void
}


export { SubjectAction, ISubject, IObserver };
