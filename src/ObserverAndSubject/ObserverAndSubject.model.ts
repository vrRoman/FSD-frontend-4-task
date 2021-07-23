type actionModelType = 'UPDATE_VALUE' | 'UPDATE_IS-RANGE' | 'UPDATE_MIN-MAX' | 'UPDATE_STEP-SIZE';
type actionViewType = 'UPDATE_LENGTH' | 'UPDATE_IS-VERTICAL' | 'UPDATE_HAS-TOOLTIP'
  | 'UPDATE_HAS-SCALE' | 'UPDATE_SCALE-VALUE' | 'UPDATE_IS-SCALE-CLICKABLE' | 'UPDATE_IS-BAR-CLICKABLE'
  | 'UPDATE_HAS-VALUE-INFO' | 'UPDATE_USE-KEYBOARD' | 'UPDATE_MODEL-DATA' | 'UPDATE_LENGTH-IN-PX'

type SubjectAction = {
  type: actionModelType | actionViewType
}

interface IObserver {
  update(action: SubjectAction): void
}

interface ISubject {
  getObservers(): Array<IObserver>
  subscribe(...observers: Array<IObserver>): void
  unsubscribe(...observers: Array<IObserver>): void
}

export { SubjectAction, ISubject, IObserver };
