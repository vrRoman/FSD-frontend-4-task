import { IObserver, ISubject, SubjectAction } from './interfacesAndTypes';

abstract class Observer implements IObserver {
  protected constructor(subject: ISubject) {
    subject.subscribe(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  abstract update(action: SubjectAction): void
}

export default Observer;
