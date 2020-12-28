import { ISubject, SubjectAction } from '../interfacesAndTypes/observerAndSubjectInterfaces';


class Subject implements ISubject {
  private observers: Array<any>;

  constructor() {
    this.observers = [];
  }

  // Подписывает на обновления
  subscribe(observer: Object) {
    this.observers.push(observer);
  }
  // Убирает подписку
  unsubscribe(observer: Object) {
    this.observers.filter((obs) => obs !== observer);
  }
  // Вызывает у всех подписчиков метод update
  notify(action: SubjectAction) {
    this.observers.forEach((observer) => {
      observer.update(action);
    });
  }
}


export default Subject;
