import autoBind from 'auto-bind';

import type { IViewModelGetMethods } from 'View/ViewModel';
import type { IView } from 'View';
import { addClass, removeClass } from 'utilities/changeClassList';

import { IThumbView, Thumb } from './ThumbView.model';

class ThumbView implements IThumbView {
  private readonly target: HTMLElement

  private readonly viewModel: IViewModelGetMethods

  private readonly mainView: IView

  private thumb: Thumb

  private isMounted: boolean

  constructor(target: HTMLElement, mainView: IView) {
    autoBind(this);

    this.target = target;
    this.mainView = mainView;
    this.viewModel = this.mainView.getViewModel();

    this.thumb = this.create();
    this.isMounted = false;
  }

  get(): Thumb {
    return this.thumb;
  }

  recreate(): Thumb {
    if (this.isMounted) {
      this.unmount();
      this.thumb = this.create();
      this.mount();
    } else {
      this.thumb = this.create();
    }
    return this.thumb;
  }

  // Обновляет положение ползунков
  update() {
    const valuePosition = this.viewModel.getValuePosition();
    const { leftOrTop, offsetWidthOrHeight, opposites } = this.mainView.getElementProperties();
    const valuePositionArray: number[] = Array.isArray(valuePosition)
      ? valuePosition
      : [valuePosition];
    const thumbArray: HTMLElement[] = Array.isArray(this.thumb)
      ? this.thumb
      : [this.thumb];

    thumbArray.forEach((_, index) => {
      thumbArray[index].style[leftOrTop] = `${valuePositionArray[index] - thumbArray[index][offsetWidthOrHeight] / 2}px`;
      thumbArray[index].style[opposites.leftOrTop] = '';
    });
  }

  mount() {
    if (!this.isMounted) {
      this.isMounted = true;
      if (Array.isArray(this.thumb)) {
        this.thumb.forEach((element) => {
          this.target.appendChild(element);
        });
      } else {
        this.target.appendChild(this.thumb);
      }
      this.update();
    }
  }

  unmount() {
    this.isMounted = false;
    if (Array.isArray(this.thumb)) {
      this.thumb.forEach((element) => {
        element.remove();
      });
    } else {
      this.thumb.remove();
    }
  }

  // Изменяет текущий активный ползунок и z-index
  setActiveThumb(thumbNumber: 0 | 1 | null = 1): HTMLElement | null {
    const { activeThumbClass } = this.viewModel.getData('classes');
    const oldActiveThumb = this.viewModel.getData('activeThumb');
    if (oldActiveThumb) {
      oldActiveThumb.style.zIndex = '';
      removeClass(oldActiveThumb, activeThumbClass);
    }
    if (thumbNumber === null) {
      return this.mainView.setActiveThumb(null);
    }

    const activeThumb = Array.isArray(this.thumb) ? this.thumb[thumbNumber] : this.thumb;
    addClass(activeThumb, activeThumbClass);

    if (Array.isArray(this.thumb)) {
      const inactiveThumb = this.thumb[Number(!thumbNumber)];
      const zIndex: number = window.getComputedStyle(inactiveThumb).zIndex === 'auto'
        ? 0
        : Number(window.getComputedStyle(inactiveThumb).zIndex);
      activeThumb.style.zIndex = String(zIndex + 1);
    }

    return this.mainView.setActiveThumb(thumbNumber);
  }

  // Перемещает активный ползунок на numberOfSteps шагов
  moveActiveThumb(numberOfSteps: number = 1) {
    const stepLength = this.viewModel.getStepLength();
    const activeThumb = this.viewModel.getData('activeThumb');
    const { leftOrTop } = this.mainView.getElementProperties();
    if (activeThumb === null) return;

    let activeThumbIndex: 0 | 1 = 0;
    if (Array.isArray(this.thumb)) {
      activeThumbIndex = this.thumb[0].isSameNode(activeThumb) ? 0 : 1;
    }

    const offset: number = stepLength * numberOfSteps;
    const position: number = parseFloat(activeThumb.style[leftOrTop]) + offset;
    activeThumb.style[leftOrTop] = `${this.getValidPosition(position, activeThumbIndex)}px`;
    this.mainView.onThumbMove(numberOfSteps, activeThumbIndex);
    this.updateClientCoordinates();
  }

  removeKeyboardListener() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  addKeyboardListener() {
    this.removeKeyboardListener();
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  private create(): Thumb {
    const valuePosition = this.viewModel.getValuePosition();
    const valuePositionArray = Array.isArray(valuePosition) ? valuePosition : [valuePosition];
    const { thumbClass } = this.viewModel.getData('classes');

    const [firstThumb, secondThumb] = valuePositionArray.map(() => {
      const newThumbElement = document.createElement('button');
      addClass(newThumbElement, thumbClass);
      newThumbElement.style.position = 'absolute';
      return newThumbElement;
    });

    this.thumb = Array.isArray(valuePosition)
      ? [firstThumb, secondThumb]
      : firstThumb;

    this.addListener();
    return this.thumb;
  }

  private getValidPosition(position: number, thumbIndex: 0 | 1 = 0): number {
    const length = this.viewModel.getData('lengthInPx');
    const { offsetWidthOrHeight, leftOrTop } = this.mainView.getElementProperties();
    const currentThumb = Array.isArray(this.thumb) ? this.thumb[thumbIndex] : this.thumb;

    let maxPosition: number = length - currentThumb[offsetWidthOrHeight] / 2;
    let minPosition: number = -currentThumb[offsetWidthOrHeight] / 2;
    if (Array.isArray(this.thumb)) {
      const [firstThumb, secondThumb] = this.thumb;
      if (thumbIndex) {
        minPosition = parseFloat(firstThumb.style[leftOrTop]);
      } else {
        maxPosition = parseFloat(secondThumb.style[leftOrTop]);
      }
    }

    if (position > maxPosition) return maxPosition;
    if (position < minPosition) return minPosition;
    return position;
  }

  private getActiveThumbIndex(thumb: HTMLElement): 0 | 1 {
    const { leftOrTop, offsetWidthOrHeight } = this.mainView.getElementProperties();
    let shouldBeSecondThumb = false;

    if (Array.isArray(this.thumb)) {
      const [firstThumb, secondThumb] = this.thumb;
      const firstThumbPosition = firstThumb.style[leftOrTop]
        + firstThumb[offsetWidthOrHeight];
      const secondThumbPosition = secondThumb.style[leftOrTop]
        + secondThumb[offsetWidthOrHeight];

      if (firstThumbPosition === secondThumbPosition) {
        const length = this.viewModel.getData('lengthInPx');
        shouldBeSecondThumb = parseFloat(firstThumbPosition) < length / 2;
      } else if (thumb.isSameNode(secondThumb)) {
        shouldBeSecondThumb = true;
      }
    }
    return shouldBeSecondThumb ? 1 : 0;
  }

  private updateClientCoordinates() {
    const activeThumb = this.viewModel.getData('activeThumb');
    if (!activeThumb) return;

    const clientX = activeThumb.getBoundingClientRect().left
      + activeThumb.offsetWidth / 2;
    const clientY = activeThumb.getBoundingClientRect().top
      + activeThumb.offsetHeight / 2;

    this.mainView.setClientCoordinates([clientX, clientY]);
  }

  // Добавляет слушатель thumb onMouseDown к ползунку(ам)
  private addListener() {
    const thumbArray = Array.isArray(this.thumb) ? this.thumb : [this.thumb];
    thumbArray.forEach((thumbElement) => {
      thumbElement.addEventListener('mousedown', this.handleThumbMouseDown);
      thumbElement.addEventListener('touchstart', this.handleThumbMouseDown);
      thumbElement.addEventListener('focusin', this.handleThumbFocusin);
      thumbElement.addEventListener('focusout', this.handleThumbFocusout);
    });

    document.addEventListener('mouseup', this.handleThumbMouseUp);
    document.addEventListener('touchend', this.handleThumbMouseUp);
  }

  private handleDocumentMouseUp() {
    this.setActiveThumb(null);
  }

  private handleThumbFocusin({ target }: FocusEvent) {
    if (!(target instanceof HTMLElement)) return;

    if (Array.isArray(this.thumb)) {
      const isFirstThumb = target.isSameNode(this.thumb[0]);
      this.setActiveThumb(isFirstThumb ? 0 : 1);
    } else {
      this.setActiveThumb();
    }
  }

  private handleThumbFocusout() {
    this.setActiveThumb(null);
  }

  // Изменяет активный ползунок, clientX/Y, обновляет слушатели
  private handleThumbMouseDown(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    event.stopPropagation();

    const { target } = event;
    const { clientXOrY } = this.mainView.getElementProperties();
    const coordinate = 'clientX' in event ? event[clientXOrY] : event.touches[0][clientXOrY];
    if (!(target instanceof HTMLElement)) return;

    this.setActiveThumb(this.getActiveThumbIndex(target));
    this.updateClientCoordinates();

    this.mainView.setThumbOffset(coordinate - this.viewModel.getData(clientXOrY));

    document.addEventListener('mouseup', this.handleThumbMouseUp);
    document.addEventListener('touchend', this.handleThumbMouseUp);
    document.addEventListener('mousemove', this.handleThumbMouseMove);
    document.addEventListener('touchmove', this.handleThumbMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    document.removeEventListener('touchend', this.handleDocumentMouseUp);
  }

  // При отжатии кнопки после ползунка убирает обработчики handleThumbMouseMove и
  // handleThumbMouseUp, добавляет слушатель handleDocumentMouseUp, который убирает
  // активный тамб при клике в любое место документа
  private handleThumbMouseUp() {
    document.removeEventListener('mousemove', this.handleThumbMouseMove);
    document.removeEventListener('touchmove', this.handleThumbMouseMove);
    document.removeEventListener('mouseup', this.handleThumbMouseUp);
    document.removeEventListener('touchend', this.handleThumbMouseUp);
    document.addEventListener('mouseup', this.handleDocumentMouseUp);
    document.addEventListener('touchend', this.handleDocumentMouseUp);
  }

  // Вызывается moveActiveThumb с numberOfSteps,
  // зависящим от смещения мыши, изменяет clientX/Y
  private handleThumbMouseMove(event: MouseEvent | TouchEvent) {
    const { clientXOrY, rightOrBottom, leftOrTop } = this.mainView.getElementProperties();
    const bar = this.mainView.getElement('bar');
    const barMaxCoordinate = bar.getBoundingClientRect()[rightOrBottom];
    const barMinCoordinate = bar.getBoundingClientRect()[leftOrTop];
    const stepLength = this.viewModel.getStepLength();
    const oldCoordinate = this.viewModel.getData(clientXOrY);
    const thumbOffset = this.viewModel.getData('thumbOffset');
    const currentCoordinate = 'clientX' in event ? event[clientXOrY] : event.touches[0][clientXOrY];

    // Если курсор выходит за бар, тогда к numberOfSteps добавить/убавить
    // число шагов, за которые вышел курсор
    if (currentCoordinate >= barMaxCoordinate) {
      this.moveActiveThumb(Math.ceil((currentCoordinate - barMaxCoordinate) / stepLength));
      return;
    }
    if (currentCoordinate <= barMinCoordinate) {
      this.moveActiveThumb(-Math.ceil((barMinCoordinate - currentCoordinate) / stepLength));
      return;
    }

    // Если пройдена половина пути, то тамб передвигается
    const numberOfSteps = Math.round(
      (currentCoordinate - oldCoordinate - thumbOffset) / stepLength,
    );
    if (!numberOfSteps) return;

    this.moveActiveThumb(numberOfSteps);
  }

  // При нажатии клавиш wasd и стрелок вызывается moveActiveThumb(1/-1)
  private handleDocumentKeyDown(event: KeyboardEvent) {
    const isThisNextKey = event.key === 'ArrowRight'
      || event.key === 'ArrowDown'
      || event.key === 'd'
      || event.key === 's';
    const isThisPrevKey = event.key === 'ArrowLeft'
      || event.key === 'ArrowUp'
      || event.key === 'a'
      || event.key === 'w';

    const shouldPreventScrolling = (
      event.key === 'ArrowDown' || event.key === 'ArrowUp'
    ) && this.viewModel.getData('activeThumb');

    if (shouldPreventScrolling) {
      event.preventDefault();
    }

    if (isThisNextKey) {
      this.moveActiveThumb(1);
    } else if (isThisPrevKey) {
      this.moveActiveThumb(-1);
    }
  }
}

export default ThumbView;
