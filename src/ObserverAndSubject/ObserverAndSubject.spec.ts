/* eslint-disable @typescript-eslint/no-unused-vars,
                  no-unused-vars,
                  class-methods-use-this,
                  no-useless-constructor,
                  max-classes-per-file */

import Observer from './Observer';
import Subject from './Subject';
import { IObserver, ISubject, SubjectAction } from './ObserverAndSubject.model';

const createObserver = (subject: ISubject) => new (class extends Observer {
  constructor(testingSubject: ISubject) {
    super(testingSubject);
  }

  update(action: SubjectAction) {}
})(subject);

let subject: ISubject;
let observer: IObserver;
beforeEach(() => {
  subject = new (class extends Subject {
    constructor() {
      super();
    }
  })();
  observer = createObserver(subject);
});

test('Subject.getObservers should return array of current observers', () => {
  expect(subject.getObservers()[0]).toBe(observer);
});

test('Subject.unsubscribe should remove observers', () => {
  subject.unsubscribe(observer);
  expect(subject.getObservers().length).toBe(0);
});
