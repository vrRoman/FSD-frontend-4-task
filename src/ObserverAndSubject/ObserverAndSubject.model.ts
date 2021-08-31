import type { IModelData } from 'Model';
import type { IViewModelData } from 'View/ViewModel';

type ModelSubjectAction = {
  type: 'CHANGE_MODEL_DATA';
  payload: IModelData;
}

type ViewSubjectAction = {
  type: 'CHANGE_VIEW_DATA';
  payload: {
    newData: IViewModelData;
    differences: Array<keyof IViewModelData>;
  };
}

type ThumbMoveAction = {
  type: 'THUMB_MOVED';
  payload: {
    thumbNumber: 0 | 1;
    numberOfSteps: number;
  }
}

type SubjectAction = ModelSubjectAction | ViewSubjectAction | ThumbMoveAction;

interface IObserver {
  update(action: SubjectAction): void;
}

interface ISubject {
  getObservers(): Array<IObserver>;
  subscribe(...observers: Array<IObserver>): void;
  unsubscribe(...observers: Array<IObserver>): void;
}

export { SubjectAction, ISubject, IObserver };
