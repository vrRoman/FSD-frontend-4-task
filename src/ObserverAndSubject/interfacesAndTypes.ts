import { ModelProperties } from '../modules/Model/interfacesAndTypes';

type actionModelType = 'UPDATE_VALUE' | 'UPDATE_IS-RANGE' | 'UPDATE_MIN-MAX' | 'UPDATE_STEP-SIZE';
type actionViewType = 'UPDATE_LENGTH' | 'UPDATE_IS-VERTICAL' | 'UPDATE_IS-RESPONSIVE' | 'UPDATE_HAS-TOOLTIP'
  | 'UPDATE_HAS-SCALE' | 'UPDATE_SCALE-VALUE' | 'UPDATE_IS-SCALE-CLICKABLE'
  | 'UPDATE_HAS-VALUE-INFO' | 'UPDATE_USE-KEYBOARD'

type SubjectAction = {
  type: actionModelType | actionViewType

  updatedProperties?: ModelProperties
}

interface ISubject {
  subscribe(observer: Object): void
  unsubscribe(observer: Object): void
}

interface IObserver {
  update(action: SubjectAction): void
}

export { SubjectAction, ISubject, IObserver };
