import { IThumbView, Thumb } from './interfaceAndTypes';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import IView from '../../View/interfaces';
import areNumbersDefined from '../../../../../utilities/areNumbersDefined';

class ThumbView implements IThumbView {
  private readonly target: HTMLElement

  private readonly viewModel: IViewModelGetMethods

  private readonly mainView: IView

  private thumb: Thumb | undefined

  constructor(target: HTMLElement, viewModel: IViewModelGetMethods, mainView: IView) {
    this.target = target;
    this.viewModel = viewModel;
    this.mainView = mainView;
    this.thumb = undefined;

    this.handleThumbMouseDown = this.handleThumbMouseDown.bind(this);
    this.handleThumbMouseUp = this.handleThumbMouseUp.bind(this);
    this.handleThumbMouseMove = this.handleThumbMouseMove.bind(this);
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
  }

  // Создает и возвращает ползунок(ки) в баре
  create(): Thumb | undefined {
    const valuePosition = this.viewModel.getValuePosition();
    const { thumbClass } = this.viewModel.getClasses();

    if (typeof valuePosition === 'number') {
      const thumb = document.createElement('div');

      if (Array.isArray(thumbClass)) {
        thumb.classList.add(...thumbClass);
      } else {
        thumb.classList.add(thumbClass);
      }
      thumb.style.position = 'absolute';

      this.target.appendChild(thumb);

      if (this.viewModel.getIsVertical()) {
        thumb.style.top = `${valuePosition - thumb.offsetHeight / 2}px`;
      } else {
        thumb.style.left = `${valuePosition - thumb.offsetWidth / 2}px`;
      }

      this.thumb = thumb;
      this.addListener();
      return thumb;
    }
    if (Array.isArray(valuePosition)) {
      const thumbElements: Array<HTMLElement> = [];
      for (let i = 0; i < valuePosition.length; i += 1) {
        const newThumbElement = document.createElement('div');
        if (Array.isArray(thumbClass)) {
          newThumbElement.classList.add(...thumbClass);
        } else {
          newThumbElement.classList.add(thumbClass);
        }
        newThumbElement.style.position = 'absolute';

        this.target.appendChild(newThumbElement);

        if (this.viewModel.getIsVertical()) {
          newThumbElement.style.top = `${valuePosition[i] - newThumbElement.offsetHeight / 2}px`;
        } else {
          newThumbElement.style.left = `${valuePosition[i] - newThumbElement.offsetWidth / 2}px`;
        }

        thumbElements.push(newThumbElement);
      }

      this.thumb = [thumbElements[0], thumbElements[1]];

      this.addListener();
      return this.thumb;
    }
    return undefined;
  }

  // Удаляет ползунок(ки)
  remove() {
    if (this.thumb) {
      if (Array.isArray(this.thumb)) {
        this.thumb.forEach((element) => {
          element.remove();
        });
      } else {
        this.thumb.remove();
      }
    }
    this.thumb = undefined;
  }

  updateClientCoordinates() {
    const activeThumb = this.viewModel.getActiveThumb();
    if (activeThumb) {
      // Тут возможно this.clientX/Y = event.clientX/Y, но я сделал так,
      // чтобы положение курсора все время было в середине thumb. Т.е.
      // определение прошлого положения курсора зависит не от самого
      // курсора, а от thumb
      const clientX = activeThumb.getBoundingClientRect().left
        + activeThumb.offsetWidth / 2;

      const clientY = activeThumb.getBoundingClientRect().top
        + activeThumb.offsetHeight / 2;

      this.mainView.setClientCoordinates([clientX, clientY]);
    }
  }

  // Обновляет положение ползунков
  update() {
    if (this.thumb) {
      const currentValuePosition = this.viewModel.getValuePosition();
      let valuePositionArray: number[];
      let thumbArray: HTMLElement[];

      if (currentValuePosition !== undefined) {
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

        thumbArray.forEach((_, index) => {
          if (this.viewModel.getIsVertical()) {
            thumbArray[index].style.top = `${valuePositionArray[index] - thumbArray[index].offsetHeight / 2}px`;
            thumbArray[index].style.left = '';
          } else {
            thumbArray[index].style.left = `${valuePositionArray[index] - thumbArray[index].offsetWidth / 2}px`;
            thumbArray[index].style.top = '';
          }
        });
      }
    }
  }

  // Возвращает ползунки
  get(): Thumb | undefined {
    return this.thumb;
  }

  // Убирает активный ползунок, добавляет класс новому activeThumb, увеличивает z-index
  // нового активного ползунка, обращается к mainView
  setActiveThumb(thumbNumber: number = 1) {
    if (this.thumb) {
      this.removeActiveThumb();
      this.mainView.removeActiveThumb();

      const activeThumb = Array.isArray(this.thumb) ? this.thumb[thumbNumber] : this.thumb;
      const { activeThumbClass } = this.viewModel.getClasses();
      if (activeThumb) {
        if (Array.isArray(activeThumbClass)) {
          activeThumb.classList.add(...activeThumbClass);
        } else {
          activeThumb.classList.add(activeThumbClass);
        }

        if (Array.isArray(this.thumb)) {
          if (activeThumb.isEqualNode(this.thumb[0])) {
            const zIndex: number = window.getComputedStyle(this.thumb[1]).zIndex === 'auto'
              ? 0 : Number(window.getComputedStyle(this.thumb[1]).zIndex);
            activeThumb.style.zIndex = String(zIndex + 1);
          } else {
            const zIndex: number = window.getComputedStyle(this.thumb[0]).zIndex === 'auto'
              ? 0 : Number(window.getComputedStyle(this.thumb[0]).zIndex);
            activeThumb.style.zIndex = String(zIndex + 1);
          }
        }

        this.mainView.setActiveThumb(thumbNumber);
      }
    }
  }

  // Убирает класс активного ползунка
  removeActiveThumb(): void {
    const activeThumb = this.viewModel.getActiveThumb();
    const { activeThumbClass } = this.viewModel.getClasses();
    if (activeThumb) {
      if (Array.isArray(activeThumbClass)) {
        activeThumb.classList.remove(...activeThumbClass);
      } else {
        activeThumb.classList.remove(activeThumbClass);
      }
    }
  }

  // Перемещает ползунок на numberOfSteps шагов
  moveActiveThumb(numberOfSteps: number = 1) {
    const stepLengthAndLength = [this.viewModel.getStepLength(), this.viewModel.getLengthInPx()];

    if (areNumbersDefined(stepLengthAndLength)) {
      const [stepLength, length] = stepLengthAndLength;
      const activeThumb = this.viewModel.getActiveThumb();

      if (activeThumb) {
        let isActiveThumbFirst: boolean = false;
        if (Array.isArray(this.thumb)) {
          if (this.thumb[0].isEqualNode(this.thumb[1])) {
            isActiveThumbFirst = numberOfSteps < 0;
          } else if (this.thumb[0].isEqualNode(activeThumb)) {
            isActiveThumbFirst = true;
          }
        }

        let offsetWidthOrHeight: 'offsetHeight' | 'offsetWidth';
        let leftOrTop: 'left' | 'top';
        if (this.viewModel.getIsVertical()) {
          offsetWidthOrHeight = 'offsetHeight';
          leftOrTop = 'top';
        } else {
          offsetWidthOrHeight = 'offsetWidth';
          leftOrTop = 'left';
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
    }
  }

  // Добавляет слушатель thumb onMouseDown к ползунку(ам)
  private addListener() {
    if (Array.isArray(this.thumb)) {
      for (let i = 0; i <= 1; i += 1) {
        this.thumb[i].addEventListener('mousedown', this.handleThumbMouseDown);
        this.thumb[i].addEventListener('touchstart', this.handleThumbMouseDown);
      }
    } else if (this.thumb) {
      this.thumb.addEventListener('mousedown', this.handleThumbMouseDown);
      this.thumb.addEventListener('touchstart', this.handleThumbMouseDown);
    }

    document.addEventListener('mouseup', this.handleThumbMouseUp);
    document.addEventListener('touchend', this.handleThumbMouseUp);
  }

  private handleDocumentMouseUp() {
    this.removeActiveThumb();
    this.mainView.removeActiveThumb();
  }

  // При нажатии на ползунок убирает z-index предыдущего активного ползунка,
  // вызывает this.setActiveThumb, обращается к mainView для изменения clientX/Y, добавляет
  // обработчики handleThumbMouseMove, handleThumbMouseUp и убирает слушатель
  // handleDocumentMouseUp
  private handleThumbMouseDown(event: MouseEvent | TouchEvent) {
    const activeThumb = this.viewModel.getActiveThumb();
    event.preventDefault();
    event.stopPropagation();

    const { target } = event;
    if (target instanceof HTMLElement) {
      if (activeThumb) {
        activeThumb.style.zIndex = '';
      }

      let thumbNumber: 0 | 1 | undefined;
      const leftOrTop = this.viewModel.getIsVertical() ? 'top' : 'left';
      if (Array.isArray(this.thumb)) {
        const firstThumbPosition = this.thumb[0].style[leftOrTop];
        if (firstThumbPosition === this.thumb[1].style[leftOrTop]) {
          const length = this.viewModel.getLengthInPx();
          const shouldBeSecondThumb = length !== undefined
            && parseFloat(firstThumbPosition) + this.thumb[0].offsetWidth < length / 2;
          if (shouldBeSecondThumb) {
            thumbNumber = 1;
          } else {
            thumbNumber = 0;
          }
        } else if (target.isEqualNode(this.thumb[0])) {
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
  // handleThumbMouseUp, добавляет слушатель document-mouseup, который убирает
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
    const stepLength = this.viewModel.getStepLength();
    const activeThumb = this.viewModel.getActiveThumb();

    if (stepLength) {
      if (activeThumb) {
        let clientX;
        let clientY;
        if ('clientX' in event) {
          clientX = event.clientX;
          clientY = event.clientY;
        } else {
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        }

        const isVertical = this.viewModel.getIsVertical();
        const oldCoordinate = isVertical
          ? this.viewModel.getClientCoordinates()[1]
          : this.viewModel.getClientCoordinates()[0];
        const currentCoordinate = isVertical ? clientY : clientX;

        // Math.round - если дробная часть numberOfSteps >= его половины, то округляется к большему
        // Т.е. если пройдена половина пути, то тамб передвигается
        let numberOfSteps = Math.round(
          (currentCoordinate - Math.round(oldCoordinate)) / stepLength,
        );

        // Если курсор выходит за бар, тогда к numberOfSteps добавить/убавить
        // число шагов, за которые вышел курсор
        const bar = this.mainView.getElement('bar');
        if (bar === undefined) {
          throw new Error('bar is undefined');
        }
        const barMaxCoordinate = isVertical
          ? bar.getBoundingClientRect().bottom
          : bar.getBoundingClientRect().right;
        const barMinCoordinate = isVertical
          ? bar.getBoundingClientRect().top
          : bar.getBoundingClientRect().left;
        if (currentCoordinate >= barMaxCoordinate) {
          numberOfSteps += Math.ceil((currentCoordinate - barMaxCoordinate) / stepLength);
        } else if (currentCoordinate <= barMinCoordinate) {
          numberOfSteps -= Math.ceil((barMinCoordinate - currentCoordinate) / stepLength);
        }

        if (numberOfSteps !== 0) {
          this.moveActiveThumb(numberOfSteps);
          this.updateClientCoordinates();
        }
      } else {
        throw new Error('activeThumb is undefined');
      }
    }
  }
}

export default ThumbView;
