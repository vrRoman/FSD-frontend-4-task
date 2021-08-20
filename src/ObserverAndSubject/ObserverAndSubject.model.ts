import type { IModelData } from 'Model';
import type { IViewModelData } from 'View/ViewModel';

type actionModelType = 'CHANGE_MODEL_DATA';
type actionViewType = 'CHANGE_VIEW_DATA';

type ModelSubjectAction = {
  type: actionModelType;
  payload: IModelData;
}

type ViewSubjectAction = {
  type: actionViewType;
  payload: {
    newData: IViewModelData;
    differences: Array<keyof IViewModelData>;
  };
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
