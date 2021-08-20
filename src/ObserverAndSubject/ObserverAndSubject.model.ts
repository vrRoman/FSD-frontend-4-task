import type { ModelOptions } from 'Model';

type actionModelType = 'CHANGE_MODEL_DATA';
type actionViewType = 'UPDATE_LENGTH' | 'UPDATE_IS-VERTICAL' | 'UPDATE_HAS-TOOLTIP'
  | 'UPDATE_HAS-SCALE' | 'UPDATE_SCALE-VALUE' | 'UPDATE_IS-SCALE-CLICKABLE' | 'UPDATE_IS-BAR-CLICKABLE'
  | 'UPDATE_HAS-VALUE-INFO' | 'UPDATE_USE-KEYBOARD' | 'UPDATE_MODEL-DATA' | 'UPDATE_LENGTH-IN-PX';

type ModelSubjectAction = {
  type: actionModelType;
  payload: ModelOptions;
}

type ViewSubjectAction = {
  type: actionViewType;
}

type SubjectAction = ModelSubjectAction | ViewSubjectAction;

interface IObserver {
  update(action: SubjectAction): void;
}

interface ISubject {
  getObservers(): Array<IObserver>;
  subscribe(...observers: Array<IObserver>): void;
  unsubscribe(...observers: Array<IObserver>): void;
}

export { SubjectAction, ISubject, IObserver };
