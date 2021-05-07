import { IObserver, ISubject, SubjectAction } from './interfacesAndTypes';

abstract class Subject implements ISubject {
  private observers: Array<IObserver>;

  protected constructor() {
    this.observers = [];
  }

  // Подписывает на обновления
  subscribe(observer: IObserver) {
    this.observers.push(observer);
  }

  // Убирает подписку
  unsubscribe(observerToRemove: IObserver) {
    this.observers.filter((observer) => observer !== observerToRemove);
  }

  // Вызывает у всех подписчиков метод update
  protected notify(action: SubjectAction) {
    this.observers.forEach((observer) => {
      observer.update(action);
    });
  }
}

export default Subject;
