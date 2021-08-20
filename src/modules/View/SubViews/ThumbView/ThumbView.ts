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
    const currentValuePosition = this.viewModel.getValuePosition();
    const { leftOrTop, offsetWidthOrHeight, opposites } = this.mainView.getElementProperties();
    let valuePositionArray: number[];
    let thumbArray: HTMLElement[];

    if (typeof currentValuePosition === 'number') {
      if (!Array.isArray(this.thumb)) {
        valuePositionArray = [currentValuePosition];
        thumbArray = [this.thumb];
      } else {
        throw new Error('valuePosition is number, but thumb is array.');
      }
    } else if (Array.isArray(this.thumb)) {
      valuePositionArray = currentValuePosition;
      thumbArray = this.thumb;
    } else {
      throw new Error('valuePosition is array, but thumb is not array.');
    }

    thumbArray.forEach((element, index) => {
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

  // Убирает текущий активный ползунок, добавляет класс новому activeThumb, увеличивает z-index
  // нового активного ползунка, обращается к mainView
  setActiveThumb(thumbNumber: 0 | 1 | null = 1) {
    const { activeThumbClass } = this.viewModel.getData('classes');
    const oldActiveThumb = this.viewModel.getData('activeThumb');
    if (oldActiveThumb) {
      removeClass(oldActiveThumb, activeThumbClass);
    }
    this.mainView.setActiveThumb(null);

    if (thumbNumber !== null) {
      const activeThumb = Array.isArray(this.thumb) ? this.thumb[thumbNumber] : this.thumb;

      addClass(activeThumb, activeThumbClass);

      if (Array.isArray(this.thumb)) {
        if (oldActiveThumb) {
          const zIndex: number = window.getComputedStyle(oldActiveThumb).zIndex === 'auto'
            ? 0
            : Number(window.getComputedStyle(oldActiveThumb).zIndex);
          activeThumb.style.zIndex = String(zIndex + 1);
        }
      }

      this.mainView.setActiveThumb(thumbNumber);
    }
  }

  // Перемещает активный ползунок на numberOfSteps шагов
  moveActiveThumb(numberOfSteps: number = 1) {
    const stepLength = this.viewModel.getStepLength();
    const activeThumb = this.viewModel.getData('activeThumb');
    if (activeThumb === null) {
      return;
    }

    const length = this.viewModel.getData('lengthInPx');
    const { offsetWidthOrHeight, leftOrTop } = this.mainView.getElementProperties();

    let isActiveThumbFirst: boolean = false;
    if (Array.isArray(this.thumb)) {
      if (this.thumb[0].isSameNode(activeThumb)) {
        isActiveThumbFirst = true;
      }
    }

    let maxPosition: number = length - activeThumb[offsetWidthOrHeight] / 2;
    let minPosition: number = -activeThumb[offsetWidthOrHeight] / 2;
    if (Array.isArray(this.thumb)) {
      if (isActiveThumbFirst) {
        maxPosition = parseFloat(this.thumb[1].style[leftOrTop]);
      } else {
        minPosition = parseFloat(this.thumb[0].style[leftOrTop]);
      }
    }

    const offset: number = stepLength * numberOfSteps;
    const position: number = parseFloat(activeThumb.style[leftOrTop]) + offset;
    if (position <= maxPosition) {
      if (position >= minPosition) {
        activeThumb.style[leftOrTop] = `${position}px`;
      } else {
        activeThumb.style[leftOrTop] = `${minPosition}px`;
      }
    } else {
      activeThumb.style[leftOrTop] = `${maxPosition}px`;
    }
    const thumbNumber: 0 | 1 = isActiveThumbFirst ? 0 : 1;
    this.mainView.onThumbMove(numberOfSteps, thumbNumber);
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
    const { thumbClass } = this.viewModel.getData('classes');

    if (typeof valuePosition === 'number') {
      const thumb = document.createElement('button');

      addClass(thumb, thumbClass);
      thumb.style.position = 'absolute';

      this.thumb = thumb;
    } else {
      const thumbElements: Array<HTMLElement> = [];
      for (let i = 0; i < valuePosition.length; i += 1) {
        const newThumbElement = document.createElement('button');
        addClass(newThumbElement, thumbClass);
        newThumbElement.style.position = 'absolute';
        thumbElements.push(newThumbElement);
      }

      this.thumb = [thumbElements[0], thumbElements[1]];
    }
    this.addListener();
    return this.thumb;
  }

  private updateClientCoordinates() {
    const activeThumb = this.viewModel.getData('activeThumb');
    if (activeThumb) {
      const clientX = activeThumb.getBoundingClientRect().left
        + activeThumb.offsetWidth / 2;

      const clientY = activeThumb.getBoundingClientRect().top
        + activeThumb.offsetHeight / 2;

      this.mainView.setClientCoordinates([clientX, clientY]);
    }
  }

  // Добавляет слушатель thumb onMouseDown к ползунку(ам)
  private addListener() {
    if (Array.isArray(this.thumb)) {
      for (let i = 0; i <= 1; i += 1) {
        this.thumb[i].addEventListener('mousedown', this.handleThumbMouseDown);
        this.thumb[i].addEventListener('touchstart', this.handleThumbMouseDown);
        this.thumb[i].addEventListener('focusin', this.handleThumbFocusin);
        this.thumb[i].addEventListener('focusout', this.handleThumbFocusout);
      }
    } else if (this.thumb) {
      this.thumb.addEventListener('mousedown', this.handleThumbMouseDown);
      this.thumb.addEventListener('touchstart', this.handleThumbMouseDown);
      this.thumb.addEventListener('focusin', this.handleThumbFocusin);
      this.thumb.addEventListener('focusout', this.handleThumbFocusout);
    }

    document.addEventListener('mouseup', this.handleThumbMouseUp);
    document.addEventListener('touchend', this.handleThumbMouseUp);
  }

  private handleDocumentMouseUp() {
    this.setActiveThumb(null);
  }

  private handleThumbFocusin(event: FocusEvent) {
    if (Array.isArray(this.thumb)) {
      const { target } = event;
      if (target instanceof HTMLElement) {
        const isFirstThumb = target.isSameNode(this.thumb[0]);
        this.setActiveThumb(isFirstThumb ? 0 : 1);
      }
    } else {
      this.setActiveThumb();
    }
  }

  private handleThumbFocusout() {
    this.setActiveThumb(null);
  }

  // При нажатии на ползунок убирает z-index предыдущего активного ползунка,
  // вызывает this.setActiveThumb, обращается к mainView для изменения clientX/Y, добавляет
  // обработчики handleThumbMouseMove, handleThumbMouseUp и убирает слушатель
  // handleDocumentMouseUp
  private handleThumbMouseDown(event: MouseEvent | TouchEvent) {
    const activeThumb = this.viewModel.getData('activeThumb');
    event.preventDefault();
    event.stopPropagation();

    const { target } = event;
    if (target instanceof HTMLElement) {
      const { leftOrTop, offsetWidthOrHeight } = this.mainView.getElementProperties();
      let thumbNumber: 0 | 1 | undefined;

      if (activeThumb) {
        activeThumb.style.zIndex = '';
      }

      if (Array.isArray(this.thumb)) {
        const firstThumbPosition = this.thumb[0].style[leftOrTop];
        if (firstThumbPosition === this.thumb[1].style[leftOrTop]) {
          const length = this.viewModel.getData('lengthInPx');
          const shouldBeSecondThumb = (
            parseFloat(firstThumbPosition) + this.thumb[0][offsetWidthOrHeight]
          ) < length / 2;
          if (shouldBeSecondThumb) {
            thumbNumber = 1;
          } else {
            thumbNumber = 0;
          }
        } else if (target.isSameNode(this.thumb[0])) {
          thumbNumber = 0;
        } else {
          thumbNumber = 1;
        }
      }

      this.setActiveThumb(thumbNumber);

      this.updateClientCoordinates();

      document.addEventListener('mouseup', this.handleThumbMouseUp);
      document.addEventListener('touchend', this.handleThumbMouseUp);
      document.addEventListener('mousemove', this.handleThumbMouseMove);
      document.addEventListener('touchmove', this.handleThumbMouseMove);
      document.removeEventListener('mouseup', this.handleDocumentMouseUp);
      document.removeEventListener('touchend', this.handleDocumentMouseUp);
    }
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

  // При перемещении мыши вызывается moveActiveThumb с numberOfSteps,
  // зависящим от смещения мыши, обращается к mainView для смены coordinates
  private handleThumbMouseMove(event: MouseEvent | TouchEvent) {
    const activeThumb = this.viewModel.getData('activeThumb');
    if (activeThumb === null) {
      throw new Error('activeThumb is null');
    }

    const stepLength = this.viewModel.getStepLength();
    let clientX: number;
    let clientY: number;
    if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    const isVertical = this.viewModel.getData('isVertical');
    const oldCoordinate = isVertical
      ? this.viewModel.getData('clientY')
      : this.viewModel.getData('clientX');
    const currentCoordinate = isVertical ? clientY : clientX;
    const { leftOrTop, rightOrBottom } = this.mainView.getElementProperties();

    // Math.round - если дробная часть numberOfSteps >= его половины, то округляется к большему
    // Т.е. если пройдена половина пути, то тамб передвигается
    let numberOfSteps = Math.round(
      (currentCoordinate - Math.round(oldCoordinate)) / stepLength,
    );

    // Если курсор выходит за бар, тогда к numberOfSteps добавить/убавить
    // число шагов, за которые вышел курсор
    const bar = this.mainView.getElement('bar');
    const barMaxCoordinate = bar.getBoundingClientRect()[rightOrBottom];
    const barMinCoordinate = bar.getBoundingClientRect()[leftOrTop];
    if (currentCoordinate >= barMaxCoordinate) {
      numberOfSteps += Math.ceil((currentCoordinate - barMaxCoordinate) / stepLength);
    } else if (currentCoordinate <= barMinCoordinate) {
      numberOfSteps -= Math.ceil((barMinCoordinate - currentCoordinate) / stepLength);
    }

    if (numberOfSteps !== 0) {
      this.moveActiveThumb(numberOfSteps);
      this.updateClientCoordinates();
    }
  }

  // При нажатии клавиш wasd и стрелок вызывается moveActiveThumb(1/-1)
  private handleDocumentKeyDown(event: KeyboardEvent) {
    const isThisNextKey = event.key === 'ArrowRight'
      || event.key === 'ArrowBottom'
      || event.key === 'd'
      || event.key === 's';
    const isThisPrevKey = event.key === 'ArrowLeft'
      || event.key === 'ArrowTop'
      || event.key === 'a'
      || event.key === 'w';

    if (isThisNextKey) {
      this.moveActiveThumb(1);
    } else if (isThisPrevKey) {
      this.moveActiveThumb(-1);
    }
  }
}

export default ThumbView;
