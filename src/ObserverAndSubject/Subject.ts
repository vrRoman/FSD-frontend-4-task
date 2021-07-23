import { IObserver, ISubject, SubjectAction } from './ObserverAndSubject.model';

abstract class Subject implements ISubject {
  private observers: Array<IObserver>;

  protected constructor() {
    this.observers = [];
  }

  getObservers(): Array<IObserver> {
    return this.observers;
  }

  // Подписывает на обновления
  subscribe(...observersToAdd: Array<IObserver>) {
    observersToAdd.forEach((observer) => this.observers.push(observer));
  }

  // Убирает подписку
  unsubscribe(...observersToRemove: Array<IObserver>) {
    observersToRemove.forEach((removableObserver) => {
      this.observers = this.observers.filter(
        (currentObserver) => currentObserver !== removableObserver,
      );
    });
  }

  // Вызывает у всех подписчиков метод update
  protected notify(action: SubjectAction) {
    this.observers.forEach((observer) => observer.update(action));
  }
}

export default Subject;
