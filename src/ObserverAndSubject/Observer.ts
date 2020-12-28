import { IObserver, ISubject, SubjectAction } from '../interfaces/observerAndSubjectInterfaces';

class Observer implements IObserver {
  constructor(subject: ISubject) {
    subject.subscribe(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  update(action: SubjectAction) {}
}

export default Observer;
